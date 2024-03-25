import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import slugify from '~/utils/slugify';

export const matrixRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ orgSlug: z.string(), name: z.string() }))
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

  getOwned: protectedProcedure.query(({ ctx }) => {
    return ctx.db.matrix.findMany({
      where: {
        users: { some: { userId: ctx.session.user.id, permissions: 'OWNER' } },
      },
    });
  }),

  getShared: protectedProcedure.query(({ ctx }) => {
    return ctx.db.matrix.findMany({
      where: {
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
