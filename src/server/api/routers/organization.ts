import { randomBytes } from 'crypto';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { utapi } from '~/server/uploadthing';
import slugify from '~/utils/slugify';

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Name is required')
          .max(64, 'Maximum name length is 64 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let slug = slugify(input.name);
      let slugTaken = !!(await ctx.db.organization.findUnique({
        where: { slug },
      }));

      while (slugTaken) {
        // generate a unique slug
        const rand1 = Math.floor(Math.random() * ctx.session.user.id.length);
        const rand2 = Math.floor(Math.random() * ctx.session.user.id.length);
        slug = `${slug}-${ctx.session.user.id[rand1]}${ctx.session.user.id[rand2]}`;
        slugTaken = !!(await ctx.db.organization.findUnique({
          where: { slug },
        }));
      }

      return ctx.db.organization.create({
        data: {
          slug,
          name: input.name,
          owner: { connect: { id: ctx.session.user.id } },
          members: {
            create: {
              role: 'OWNER',
              user: { connect: { id: ctx.session.user.id } },
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.organization.delete({
        where: { id: input.id, ownerId: ctx.session.user.id },
      });
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
    }),

  updateImage: protectedProcedure
    .input(z.object({ slug: z.string(), image: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: {
          slug: input.slug,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      });
      if (!organization) throw new Error('Unauthorized');
      if (organization.image)
        await utapi.deleteFiles(
          organization.image.substring(organization.image.lastIndexOf('/') + 1)
        );

      return ctx.db.organization.update({
        where: { slug: input.slug },
        data: { image: input.image },
      });
    }),

  deleteImage: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: {
          slug: input.slug,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      });
      if (!organization) throw new Error('Unauthorized');
      if (!organization.image) return;

      // Delete the file from the storage provider
      await utapi.deleteFiles(
        organization.image.substring(organization.image.lastIndexOf('/') + 1)
      );

      return ctx.db.organization.update({
        where: { slug: input.slug },
        data: { image: null },
      });
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string().min(1).max(64, 'Maximum name length is 64 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
      if (!organization) throw new Error('Unexpected Error');
      if (input.name === organization.name) return;

      const isOwnerOrAdmin = await ctx.db.usersOnOrganizations.findFirst({
        where: {
          organizationId: organization.id,
          userId: ctx.session.user.id,
          role: { in: ['OWNER', 'ADMIN'] },
        },
      });
      if (!isOwnerOrAdmin) throw new Error('Unauthorized');

      return ctx.db.organization.update({
        where: { slug: input.slug },
        data: { name: input.name },
      });
    }),

  changeOwner: protectedProcedure
    .input(z.object({ slug: z.string(), newOwnerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });

      if (!organization) throw new Error('Organization not found');

      if (organization.ownerId !== ctx.session.user.id)
        throw new Error('Unauthorized');

      await ctx.db.usersOnOrganizations.update({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId: organization.id,
          },
          role: 'OWNER',
        },
        data: { role: 'ADMIN' },
      });

      await ctx.db.usersOnOrganizations.update({
        where: {
          userId_organizationId: {
            userId: input.newOwnerId,
            organizationId: organization.id,
          },
        },
        data: { role: 'OWNER' },
      });

      return ctx.db.organization.update({
        where: { slug: input.slug },
        data: { owner: { connect: { id: input.newOwnerId } } },
      });
    }),

  updateSlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        newSlug: z.string().max(64, 'Maximum slug length is 64 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
      if (!organization) throw new Error('Unexpected Error');

      const newSlug = slugify(input.newSlug);

      if (newSlug === organization.slug)
        throw new Error('Slug is the same after removing invalid characters');

      const slugTaken = await ctx.db.organization.findUnique({
        where: { slug: newSlug },
      });
      if (slugTaken) throw new Error('Slug is already taken');

      const isOwnerOrAdmin = await ctx.db.usersOnOrganizations.findFirst({
        where: {
          organizationId: organization.id,
          userId: ctx.session.user.id,
          role: { in: ['OWNER', 'ADMIN'] },
        },
      });
      if (!isOwnerOrAdmin) throw new Error('Unauthorized');

      return ctx.db.organization.update({
        where: { slug: input.slug },
        data: { slug: newSlug },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          owner: true,
          _count: { select: { members: true, matrices: true } },
        },
      });
    }),

  addUser: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        userId: z.string().cuid(),
        role: z.enum(['USER', 'ADMIN', 'OWNER']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });

      if (!organization) throw new Error('Organization not found');

      return ctx.db.usersOnOrganizations.create({
        data: {
          role: input.role,
          user: { connect: { id: input.userId } },
          organization: { connect: { id: organization.id } },
        },
      });
    }),

  joinBySecret: protectedProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const secret = await ctx.db.organizationSecret.findUnique({
        where: { secret: input.secret },
        include: { organization: true },
      });

      if (!secret) throw new Error('Invalid secret');

      const existing = await ctx.db.usersOnOrganizations.findFirst({
        where: {
          userId: ctx.session.user.id,
          organizationId: secret.organization.id,
        },
      });
      if (existing?.isActive) throw new Error('Already a member');

      existing
        ? // If the user was previously a member, reactivate them
          await ctx.db.usersOnOrganizations.update({
            where: {
              userId_organizationId: {
                userId: existing.userId,
                organizationId: existing.organizationId,
              },
            },
            data: { isActive: true },
          })
        : // Otherwise, create a new membership
          await ctx.db.usersOnOrganizations.create({
            data: {
              role: 'USER',
              user: { connect: { id: ctx.session.user.id } },
              organization: { connect: { id: secret.organization.id } },
            },
          });

      return secret.organization;
    }),

  getUsers: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization
        .findUnique({
          where: { slug: input.slug },
        })
        .members({
          include: { user: true },
        });
    }),

  getActiveUsers: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization
        .findUnique({
          where: { slug: input.slug },
        })
        .members({
          where: { isActive: true },
          include: { user: true },
        });
    }),

  getAdmins: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization
        .findUnique({
          where: { slug: input.slug },
        })
        .members({
          where: { role: 'ADMIN' },
          include: { user: true },
        });
    }),

  updateUserRole: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().cuid(),
        userId: z.string().cuid(),
        role: z.enum(['USER', 'ADMIN', 'OWNER']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.usersOnOrganizations.update({
        where: {
          userId_organizationId: {
            userId: input.userId,
            organizationId: input.organizationId,
          },
        },
        data: { role: input.role },
      });
    }),

  setUserInactive: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().cuid(),
        userId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.usersOnOrganizations.update({
        where: {
          userId_organizationId: {
            userId: input.userId ?? ctx.session.user.id,
            organizationId: input.organizationId,
          },
        },
        data: { isActive: false, lastActive: new Date() },
      });
    }),

  generateSecret: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.organizationSecret.create({
        data: {
          organizationId: input.id,
          secret: randomBytes(32).toString('base64'),
        },
      });
    }),

  deleteSecret: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.organizationSecret.delete({
        where: { id: input.id },
      });
    }),

  getSecrets: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization
        .findUnique({
          where: {
            slug: input.slug,
            members: {
              some: {
                userId: ctx.session.user.id,
                role: { in: ['ADMIN', 'OWNER'] },
              },
            },
          },
        })
        .secrets();
    }),

  getStats: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { slug: input.slug },
        select: {
          _count: { select: { members: true, matrices: true } },
        },
      });
    }),
});
