import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({

	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		// Get the current user's ID from the session
		const userId = ctx.session?.user?.id;
	
		// Fetch all markers and determine if each is visited by the current user
		const markers = await ctx.db.marker.findMany({
			include: {
				MarkerVisit: {
					where: {
						userId: userId, // Only fetch visits by the current user
					},
					select: {
						id: true, // You can select additional fields if needed
					},
				},
			},
		});
	
		// Map over the markers to add a 'visitedByCurrentUser' flag
		return markers.map(marker => ({
			...marker,
			visitedByCurrentUser: marker.MarkerVisit.length > 0,
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
