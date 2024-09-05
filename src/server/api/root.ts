import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { markerRouter } from "./routers/marker";
import { markerCommentRouter } from "./routers/marker-comment";
import { markerVote } from "./routers/marker-vote";
import { objectiveRouter } from "./routers/objective";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	marker:markerRouter,
	markerComment:markerCommentRouter,
	markerVote:markerVote,
	objective:objectiveRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
