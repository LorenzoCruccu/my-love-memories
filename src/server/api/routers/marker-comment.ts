import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerCommentRouter = createTRPCRouter({

	getCommentsFromMarkerId: publicProcedure.input(z.object(
		{
			markerId: z.number()
		}))
		.query(async ({ ctx, input }) => {
			const markerComments = await ctx.db.markerComment.findMany({
				include: {
					createdBy: true
				},
				where: {
					markerId: {
						equals: input.markerId,
					},

				}
			});
			return markerComments ?? null;
		}),

	create: protectedProcedure
		.input(z.object(
			{
				markerId: z.number(),
				text: z.string().min(1),
			}))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.markerComment.create({
				data: {
					markerId: input.markerId,
					text: input.text,
					createdById: ctx.session.user.id,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.object({
			id: z.number(), // Ensure the input includes the ID of the marker to delete
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.markerComment.delete({
				where: { id: input.id },
			});
			return { success: true };
		}),

});
