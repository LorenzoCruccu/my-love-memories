import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({

	// Get all markers
	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		const markers = await ctx.db.marker.findMany({
			include: {
				votes: true,
				MarkerComment: true,
			},
		});

		return markers.map((marker) => ({
			...marker,
			commentsCount: marker.MarkerComment.length,
		}));
	}),

	// Create a new marker
	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string(),
				lat: z.number(),
				lng: z.number(),
				address: z.string(),
				mood: z.string().optional(),
				partnerName: z.string().optional(),
				partnerInstagram: z.string().optional(),
				suggestedSpotifySongUrl: z.string().url().or(z.literal('')),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Create a new marker
			const newMarker = await ctx.db.marker.create({
				data: {
					title: input.title,
					description: input.description,
					lat: input.lat,
					lng: input.lng,
					address: input.address,
					mood: input.mood,
					partnerName: input.partnerName,
					partnerInstagram: input.partnerInstagram,
					suggestedSpotifySongUrl: input.suggestedSpotifySongUrl,
					createdBy: { connect: { id: userId } },
				},
			});

			// Objective logic for "Mark 10 spots"
			const markerObjective = await ctx.db.objective.findFirst({
				where: { code: "MarkSpots10" },
			});

			if (markerObjective) {
				const userObjective = await ctx.db.userObjective.findFirst({
					where: {
						userId,
						objectiveId: markerObjective.id,
					},
				});

				if (userObjective) {
					const newCurrentValue = userObjective.currentValue + 1;
					const newProgress = Math.min((newCurrentValue / markerObjective.targetValue) * 100, 100);

					await ctx.db.userObjective.update({
						where: { id: userObjective.id },
						data: {
							currentValue: newCurrentValue,
							progress: newProgress,
							completedAt: newProgress === 100 ? new Date() : null,
						},
					});
				} else {
					await ctx.db.userObjective.create({
						data: {
							userId,
							objectiveId: markerObjective.id,
							currentValue: 1,
							progress: (1 / markerObjective.targetValue) * 100,
							completedAt: markerObjective.targetValue === 1 ? new Date() : null,
						},
					});
				}
			}

			return newMarker;
		}),


	// Get user-specific markers
	getUserMarkers: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;

		if (!userId) {
			return []
		}

		const markers = await ctx.db.marker.findMany({
			where: { createdById: userId },
			include: {
				votes: true,
				MarkerComment: true,
				createdBy: {
					select: {
						image: true,
						name: true,
					},
				},
			},
		});

		return markers.map((marker) => ({
			...marker,
			commentsCount: marker.MarkerComment.length,
		}));
	}),

	getSharedMarkers: publicProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;

		// Fetch all markers that are shared and not created by the current user
		const sharedMarkers = await ctx.db.marker.findMany({
			include: {
				votes: true,
				MarkerComment: true,
				createdBy: {
					select: {
						image: true,
						name: true
					},
				},
			},
			where: {
				isShared: true,
				createdById: {
					not: userId ?? undefined, // Exclude markers created by the current user
				},
			},

		});

		// Map over the markers and return the relevant data
		return sharedMarkers.map((marker) => ({
			...marker,
			commentsCount: marker.MarkerComment.length,
		}));
	}),

	// Toggle "isShared" field
	toggleIsShared: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const marker = await ctx.db.marker.findUnique({
				where: { id: input.id },
			});

			if (!marker) {
				throw new Error("Marker not found");
			}

			const updatedMarker = await ctx.db.marker.update({
				where: { id: input.id },
				data: {
					isShared: !marker.isShared, // Toggle the isShared value
				},
			});

			return updatedMarker;
		}),


	// Delete a marker
	delete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.marker.delete({ where: { id: input.id } });
			return { success: true };
		}),
});
