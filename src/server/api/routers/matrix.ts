import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import slugify from '~/utils/slugify';

export const matrixRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string().min(1),
        name: z
          .string()
          .min(1, 'Name is required')
          .max(64, 'Maximum name length is 64 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let slug = slugify(input.name);
      let slugTaken = !!(await ctx.db.matrix.findFirst({
        where: { organizationSlug: input.orgSlug, slug },
      }));

      while (slugTaken) {
        const rand1 = Math.floor(Math.random() * ctx.session.user.id.length);
        const rand2 = Math.floor(Math.random() * ctx.session.user.id.length);
        slug = `${slug}-${ctx.session.user.id[rand1]}${ctx.session.user.id[rand2]}`;
        slugTaken = !!(await ctx.db.matrix.findFirst({
          where: { organizationSlug: input.orgSlug, slug },
        }));
      }

      return ctx.db.matrix.create({
        data: {
          name: input.name,
          slug,
          organizationSlug: input.orgSlug,
          users: {
            create: [
              {
                userId: ctx.session.user.id,
                permissions: 'OWNER',
              },
            ],
          },
        },
      });
    }),

  clone: protectedProcedure
    .input(
      z.object({
        matrixId: z.string().cuid(),
        name: z
          .string()
          .min(1, 'Name is required')
          .max(64, 'Maximum name length is 64 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const matrix = await ctx.db.matrix.findFirst({
        where: { id: input.matrixId },
        include: {
          categories: {
            include: { competences: { include: { skills: true } } },
          },
        },
      });

      if (!matrix) {
        throw new Error('Matrix not found');
      }

      let slug = slugify(input.name);
      let slugTaken = !!(await ctx.db.matrix.findFirst({
        where: { organizationSlug: matrix.organizationSlug, slug },
      }));

      while (slugTaken) {
        const rand1 = Math.floor(Math.random() * ctx.session.user.id.length);
        const rand2 = Math.floor(Math.random() * ctx.session.user.id.length);
        slug = `${slug}-${ctx.session.user.id[rand1]}${ctx.session.user.id[rand2]}`;
        slugTaken = !!(await ctx.db.matrix.findFirst({
          where: { organizationSlug: matrix.organizationSlug, slug },
        }));
      }

      return ctx.db.matrix.create({
        data: {
          name: input.name,
          slug,
          organizationSlug: matrix.organizationSlug,
          users: {
            create: [
              {
                userId: ctx.session.user.id,
                permissions: 'OWNER',
              },
            ],
          },
          categories: {
            createMany: {
              data: matrix.categories.map((category) => ({
                name: category.name,
                weight: category.weight,
                competences: {
                  createMany: {
                    data: category.competences.map((competence) => ({
                      name: competence.name,
                      weight: competence.weight,
                      skills: {
                        createMany: {
                          data: competence.skills.map((skill) => ({
                            skillId: skill.skillId,
                            weight: skill.weight,
                          })),
                        },
                      },
                    })),
                  },
                },
              })),
            },
          },
        },
      });
    }),

  getUsers: protectedProcedure
    .input(z.object({ matrixId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.usersOnMatrices.findMany({
        where: { matrixId: input.matrixId },
        include: { user: true },
        orderBy: { permissions: 'desc' },
      });
    }),

  getFull: protectedProcedure
    .input(z.object({ matrixId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.matrix.findFirst({
        where: { id: input.matrixId },
        include: {
          categories: {
            include: { competences: { include: { skills: true } } },
          },
        },
      });
    }),

  getOwned: protectedProcedure
    .input(z.object({ organizationSlug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.matrix.findMany({
        where: {
          organizationSlug: input.organizationSlug,
          users: {
            some: { userId: ctx.session.user.id, permissions: 'OWNER' },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ matrixId: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.matrix.delete({
        where: {
          id: input.matrixId,
          users: { some: { userId: ctx.session.user.id } },
        },
      });
    }),

  unshare: protectedProcedure
    .input(
      z.object({
        matrixId: z.string().cuid(),
        userId: z.string().cuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.matrix.update({
        where: { id: input.matrixId },
        data: {
          users: {
            delete: {
              userId_matrixId: {
                userId: input.userId,
                matrixId: input.matrixId,
              },
            },
          },
        },
      });
    }),

  getShared: protectedProcedure
    .input(z.object({ organizationSlug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.matrix.findMany({
        where: {
          organizationSlug: input.organizationSlug,
          users: {
            some: {
              userId: ctx.session.user.id,
              permissions: { in: ['EDITOR', 'VIEWER'] },
            },
          },
        },
      });
    }),

  share: protectedProcedure
    .input(
      z.object({
        matrixId: z.string(),
        users: z.array(
          z.object({
            userId: z.string().cuid(),
            permissions: z.enum(['VIEWER', 'EDITOR']),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const matrix = await ctx.db.matrix.findFirst({
        where: { id: input.matrixId },
      });

      if (!matrix) {
        throw new Error('Matrix not found');
      }

      return ctx.db.matrix.update({
        where: { id: input.matrixId },
        data: {
          users: {
            upsert: input.users.map((user) => ({
              where: {
                userId_matrixId: {
                  userId: user.userId,
                  matrixId: input.matrixId,
                },
              },
              create: {
                userId: user.userId,
                permissions: user.permissions,
              },
              update: {
                permissions: user.permissions,
              },
            })),
          },
        },
      });
    }),
});
