import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      let slug = input.name.toLowerCase().replace(/ /g, '-');

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
          members: { connect: { id: ctx.session.user.id } },
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
      where: { members: { some: { id: ctx.session.user.id } } },
    });
  }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { slug: input.slug },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.organization.findUnique({
        where: { id: input.id },
        include: { owner: true, _count: { select: { members: true } } },
      });
    }),

  removeUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.organization.update({
        where: { id: input.id },
        data: {
          members: { disconnect: { id: ctx.session.user.id } },
        },
      });
    }),
});
