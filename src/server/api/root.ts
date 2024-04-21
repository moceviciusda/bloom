import { createTRPCRouter } from '~/server/api/trpc';
import { organizationRouter } from './routers/organization';
import { matrixRouter } from './routers/matrix';
import { skillRouter } from './routers/skill';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  matrix: matrixRouter,
  skill: skillRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
