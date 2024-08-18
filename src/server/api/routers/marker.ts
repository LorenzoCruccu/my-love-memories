import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({

	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		// Get the current user's ID from the session
	
		// Fetch all markers and, if a user is logged in, determine if each is visited by the current user
		const markers = await ctx.db.marker.findMany();
	
		// Map over the markers to add a 'visitedByCurrentUser' flag if user is logged in
		return markers.map((marker) => ({
			...marker,
			visitedByCurrentUser: true,
		}));
	}),
	
	create: protectedProcedure
		.input(z.object(
			{
				title: z.string().min(1),
				description:z.string(),
				lat: z.number(),
				lng: z.number(),
				address:z.string(),
				intimacyLevel:z.number().nullable()

			}))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.marker.create({
				data: {
					title: input.title,
					description: input.description,
					lat:  input.lat,
					lng: input.lng,
					address:input.address,
					intimacyLevel:input.intimacyLevel,
					createdBy: { connect: { id: ctx.session.user.id } },
				},
			});
		}),

		delete: protectedProcedure
		.input(z.object({
			id: z.number(), // Ensure the input includes the ID of the marker to delete
		}))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.marker.delete({
				where: { id: input.id },
			});
			return { success: true };
		}),

});
