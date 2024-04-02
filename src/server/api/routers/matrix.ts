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
            create: matrix.categories.map((category) => ({
              name: category.name,
              weight: category.weight,

              competences: {
                create: category.competences.map((competence) => ({
                  name: competence.name,
                  weight: competence.weight,

                  skills: {
                    create: competence.skills.map((skill) => ({
                      skillId: skill.skillId,
                      weight: skill.weight,
                    })),
                  },
                })),
              },
            })),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        matrix: z.object({
          id: z.string().cuid(),
          name: z
            .string()
            .min(1, 'Name is required')
            .max(64, 'Maximum name length is 64 characters'),
          slug: z.string().min(1),

          categoryOrder: z.array(z.string().cuid()),
          categories: z.array(
            z.object({
              id: z.string().cuid(),
              name: z
                .string()
                .min(1, 'Name is required')
                .max(32, 'Max length is 32 characters'),
              weight: z.number().int().min(1).max(100),

              competenceOrder: z.array(z.string().cuid()),
              competences: z.array(
                z.object({
                  id: z.string().cuid(),
                  categoryId: z.string().cuid(),
                  name: z
                    .string()
                    .min(1, 'Name is required')
                    .max(32, 'Max length is 32 characters'),
                  weight: z.number().int().min(1).max(100),

                  skillOrder: z.array(z.string().cuid()),
                  skills: z.array(
                    z.object({
                      id: z.string().cuid(),
                      competenceId: z.string().cuid(),
                      skillId: z.string().cuid(),
                      weight: z.number().int().min(1).max(100),
                    })
                  ),
                })
              ),
            })
          ),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const matrix = await ctx.db.matrix.findFirst({
        where: { id: input.matrix.id },
        include: {
          categories: {
            include: { competences: { include: { skills: true } } },
          },
        },
      });

      if (!matrix) {
        throw new Error('Matrix not found');
      }

      const categoryIds = matrix.categories.map((category) => category.id);
      const competenceIds = matrix.categories.flatMap((category) =>
        category.competences.map((competence) => competence.id)
      );
      const skillIds = matrix.categories.flatMap((category) =>
        category.competences.flatMap((competence) =>
          competence.skills.map((skill) => skill.id)
        )
      );

      const newCategoryIds = input.matrix.categories.map(
        (category) => category.id
      );
      const newCompetenceIds = input.matrix.categories.flatMap((category) =>
        category.competences.map((competence) => competence.id)
      );
      const newSkillIds = input.matrix.categories.flatMap((category) =>
        category.competences.flatMap((competence) =>
          competence.skills.map((skill) => skill.id)
        )
      );

      const categoryIdsToDelete = categoryIds.filter(
        (id) => !newCategoryIds.includes(id)
      );
      const competenceIdsToDelete = competenceIds.filter(
        (id) => !newCompetenceIds.includes(id)
      );
      const skillIdsToDelete = skillIds.filter(
        (id) => !newSkillIds.includes(id)
      );

      const categoryIdsToUpdate = categoryIds.filter((id) =>
        newCategoryIds.includes(id)
      );
      const competenceIdsToUpdate = competenceIds.filter((id) =>
        newCompetenceIds.includes(id)
      );
      const skillIdsToUpdate = skillIds.filter((id) =>
        newSkillIds.includes(id)
      );

      const categoryIdsToCreate = newCategoryIds.filter(
        (id) => !categoryIds.includes(id)
      );
      const competenceIdsToCreate = newCompetenceIds.filter(
        (id) => !competenceIds.includes(id)
      );
      const skillIdsToCreate = newSkillIds.filter(
        (id) => !skillIds.includes(id)
      );

      await ctx.db.matrixCategory.deleteMany({
        where: { id: { in: categoryIdsToDelete } },
      });

      await ctx.db.matrixCompetence.deleteMany({
        where: { id: { in: competenceIdsToDelete } },
      });

      await ctx.db.skill.deleteMany({
        where: { id: { in: skillIdsToDelete } },
      });

      for (const category of input.matrix.categories) {
        if (categoryIdsToUpdate.includes(category.id)) {
          await ctx.db.matrixCategory.update({
            where: { id: category.id },
            data: {
              name: category.name,
              weight: category.weight,
            },
          });
        }
      }

      for (const competence of input.matrix.categories.flatMap(
        (category) => category.competences
      )) {
        if (competenceIdsToUpdate.includes(competence.id)) {
          await ctx.db.matrixCompetence.update({
            where: { id: competence.id },
            data: {
              name: competence.name,
              weight: competence.weight,
            },
          });
        }
      }

      for (const skill of input.matrix.categories.flatMap((category) =>
        category.competences.flatMap((competence) => competence.skills)
      )) {
        if (skillIdsToUpdate.includes(skill.id)) {
          await ctx.db.skillsOnCompetences.update({
            where: { id: skill.id },
            data: {
              weight: skill.weight,
            },
          });
        }
      }

      for (const category of input.matrix.categories) {
        if (categoryIdsToCreate.includes(category.id)) {
          await ctx.db.matrixCategory.create({
            data: {
              name: category.name,
              weight: category.weight,
              matrixId: input.matrix.id,
            },
          });
        }
      }

      for (const competence of input.matrix.categories.flatMap(
        (category) => category.competences
      )) {
        if (competenceIdsToCreate.includes(competence.id)) {
          await ctx.db.matrixCompetence.create({
            data: {
              name: competence.name,
              weight: competence.weight,
              categoryId: competence.categoryId,
            },
          });
        }
      }

      for (const skill of input.matrix.categories.flatMap((category) =>
        category.competences.flatMap((competence) => competence.skills)
      )) {
        if (skillIdsToCreate.includes(skill.id)) {
          await ctx.db.skillsOnCompetences.create({
            data: {
              skillId: skill.skillId,
              weight: skill.weight,
              competenceId: skill.competenceId,
            },
          });
        }
      }

      return ctx.db.matrix.update({
        where: { id: input.matrix.id },
        data: {
          name: input.matrix.name,
          slug: input.matrix.slug,
          categoryOrder: input.matrix.categoryOrder,
        },
      });
    }),

  createCategory: protectedProcedure
    .input(
      z.object({
        matrixId: z.string().cuid(),
        name: z
          .string()
          .min(1, 'Name is required')
          .max(32, 'Max length is 32 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newCategory = await ctx.db.matrixCategory.create({
        data: {
          name: input.name,
          matrixId: input.matrixId,
        },
      });

      await ctx.db.matrix.update({
        where: { id: input.matrixId },
        data: {
          categoryOrder: {
            push: newCategory.id,
          },
        },
      });

      return newCategory;
    }),

  updateCompetenceOrder: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().cuid(),
        competenceOrder: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.matrixCategory.update({
        where: { id: input.categoryId },
        data: {
          competenceOrder: input.competenceOrder,
        },
      });
    }),

  updateSkillsOnCompetence: protectedProcedure
    .input(
      z.object({
        competenceId: z.string().cuid(),
        skills: z.array(
          z.object({
            skillId: z.string().cuid(),
            weight: z.number().int().min(1).max(100),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.skillsOnCompetences.deleteMany({
        where: { competenceId: input.competenceId },
      });

      return ctx.db.skillsOnCompetences.createMany({
        data: input.skills.map((skill) => ({
          skillId: skill.skillId,
          weight: skill.weight,
          competenceId: input.competenceId,
        })),
      });
    }),

  updateSkillOrder: protectedProcedure
    .input(
      z.object({
        competenceId: z.string().cuid(),
        skillOrder: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.matrixCompetence.update({
        where: { id: input.competenceId },
        data: {
          skillOrder: input.skillOrder,
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
          users: { include: { user: true } },
          categories: {
            include: { competences: { include: { skills: true } } },
          },
        },
      });
    }),

  getFullBySlug: protectedProcedure
    .input(z.object({ orgSlug: z.string(), matrixSlug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.matrix.findFirst({
        where: { organizationSlug: input.orgSlug, slug: input.matrixSlug },
        include: {
          users: { select: { permissions: true, user: true } },
          categories: {
            include: {
              competences: {
                include: { skills: { include: { skill: true } } },
              },
            },
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

  selfUnshare: protectedProcedure
    .input(z.object({ matrixId: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.matrix.update({
        where: { id: input.matrixId },
        data: {
          users: {
            delete: {
              userId_matrixId: {
                userId: ctx.session.user.id,
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

  updateCategoryOrder: protectedProcedure
    .input(
      z.object({
        matrixId: z.string().cuid(),
        categoryOrder: z.array(z.string().cuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.matrix.update({
        where: { id: input.matrixId },
        data: {
          categoryOrder: input.categoryOrder,
        },
      });
    }),
});
