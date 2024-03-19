import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      let slug = slugify(input.name);

      await ctx.db.organization
        .findUnique({
          where: { slug },
        })
        .then((org) => {
          if (org) {
            // generate a unique slug
            const index = Math.floor(Math.random() * 22);
            slug = `${slug}-${ctx.session.user.id.substring(index, index + 2)}`;
          }
        });

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
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.organization.findMany({
      where: { members: { some: { user: { id: ctx.session.user.id } } } },
    });
  }),

  getActive: protectedProcedure.query(({ ctx }) => {
    return ctx.db.organization.findMany({
      where: {
        members: {
          some: { user: { id: ctx.session.user.id }, isActive: true },
        },
      },
    });
  }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
    }),

  updateName: protectedProcedure
    .input(z.object({ slug: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });

      if (!organization) throw new Error('Organization not found');

      if (organization.ownerId === ctx.session.user.id) {
        return ctx.db.organization.update({
          where: { slug: input.slug },
          data: { name: input.name },
        });
      }
    }),

  changeOwner: protectedProcedure
    .input(z.object({ slug: z.string(), newOwnerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });

      if (!organization) throw new Error('Organization not found');

      if (organization.ownerId === ctx.session.user.id) {
        return ctx.db.organization.update({
          where: { slug: input.slug },
          data: { owner: { connect: { id: input.newOwnerId } } },
        });
      }
    }),

  changeSlug: protectedProcedure
    .input(z.object({ slug: z.string(), newSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const slugTaken = await ctx.db.organization.findUnique({
        where: { slug: input.newSlug },
      });
      if (slugTaken) throw new Error('Slug is already taken');

      const organization = await ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
      if (!organization) throw new Error('Organization not found');

      if (organization.ownerId === ctx.session.user.id) {
        return ctx.db.organization.update({
          where: { slug: input.slug },
          data: { slug: input.newSlug },
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { id: input.id },
        include: { owner: true, _count: { select: { members: true } } },
      });
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
        data: { isActive: false },
      });
    }),
});
