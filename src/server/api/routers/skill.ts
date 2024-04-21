import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const skillRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Name is required')
          .max(128, 'Max length is 128 characters'),
        description: z
          .string()
          .max(2200, 'Max length is 2200 characters')
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) =>
      ctx.db.skill.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: ctx.session.user.id,
        },
      })
    ),
});
