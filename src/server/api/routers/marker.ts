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

		// Fetch all markers and, if a user is logged in, determine if each is visited by the current user
		const markers = await ctx.db.marker.findMany({
			include: {
				votes:true,
				MarkerComment:true,
				MarkerVisit: userId
					? {
						where: {
							userId: userId, // Only fetch visits by the current user
						},
						select: {
							id: true, // You can select additional fields if needed
						},
					}
					: false, // Skip the MarkerVisit inclusion if userId is undefined
			},
		});

		// Map over the markers to add a 'visitedByCurrentUser' flag if user is logged in
		return markers.map((marker) => {
			const commentsCount = marker.MarkerComment.length

			return {
				...marker,
				visitedByCurrentUser: userId ? marker.MarkerVisit.length > 0 : false,
				commentsCount
			};
		});

	}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string(),
				lat: z.number(),
				lng: z.number(),
				address: z.string(),
				mood: z.string().optional(),
				mustSee: z.string().optional(),
				suggestedWith: z.string().optional(),
				suggestedAgeFrom: z.number().optional(),
				suggestedAgeTo: z.number().optional(),
				suggestedSpotifySongUrl: z.string().url().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.marker.create({
				data: {
					title: input.title,
					description: input.description,
					lat: input.lat,
					lng: input.lng,
					address: input.address,
					mood: input.mood,
					mustSee: input.mustSee,
					suggestedWith: input.suggestedWith,
					suggestedAgeFrom: input.suggestedAgeFrom,
					suggestedAgeTo: input.suggestedAgeTo,
					suggestedSpotifySongUrl: input.suggestedSpotifySongUrl,
					status: "PENDING",  // Set status to pending
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
