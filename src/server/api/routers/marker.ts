import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const getLevelAndProgress = (voteCount: number) => {
	if (voteCount <= 10) {
		return { level: 1, progress: (voteCount / 10) * 100 };
	} else if (voteCount <= 50) {
		return { level: 2, progress: ((voteCount - 10) / 40) * 100 };
	} else {
		return { level: 3, progress: 100 };
	}
};



export const markerRouter = createTRPCRouter({

	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		// Get the current user's ID from the session
		const userId = ctx.session?.user?.id;

		// Fetch all markers and, if a user is logged in, determine if each is visited by the current user
		const markers = await ctx.db.marker.findMany({
			include: {
				votes: true,
				MarkerComment: true,
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
			const voteCount = marker.votes.length;
			const { level } = getLevelAndProgress(voteCount);

			return {
				...marker,
				visitedByCurrentUser: userId ? marker.MarkerVisit.length > 0 : false,
				commentsCount,
				level
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
      partnerName: z.string().optional(),
      partnerInstagram: z.string().optional(),
      suggestedSpotifySongUrl: z.string().url().optional(),
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

    // Objective logic - Find the objective for "Mark 10 spots"
    const markerObjective = await ctx.db.objective.findFirst({
      where: { code: "MarkSpots10" }, // Adjust this query based on how you define objectives
    });

    if (markerObjective) {
      // Check if the user already has progress for this objective
      const userObjective = await ctx.db.userObjective.findFirst({
        where: {
          userId: userId,
          objectiveId: markerObjective.id,
        },
      });

      if (userObjective) {
        // Update the user's progress toward the objective
        const newCurrentValue = userObjective.currentValue + 1;
        const newProgress = Math.min((newCurrentValue / markerObjective.targetValue) * 100, 100);

        await ctx.db.userObjective.update({
          where: {
            id: userObjective.id,
          },
          data: {
            currentValue: newCurrentValue,
            progress: newProgress,
            completedAt: newProgress === 100 ? new Date() : null, // Mark as completed if progress reaches 100%
          },
        });
      } else {
        // If the user hasn't started this objective yet, create a new entry
        await ctx.db.userObjective.create({
          data: {
            userId: userId,
            objectiveId: markerObjective.id,
            currentValue: 1,
            progress: (1 / markerObjective.targetValue) * 100,
            completedAt: markerObjective.targetValue === 1 ? new Date() : null, // If the target is 1, mark it completed immediately
          },
        });
      }
    }

    return newMarker;
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


	getUserMarkers: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user?.id;

		if (!userId) {
			throw new Error("User not authenticated");
		}

		const markers = await ctx.db.marker.findMany({
			where: {
				createdById: userId, // Filter markers by the user's ID
			},
			include: {
				votes: true,
				MarkerComment: true,
				MarkerVisit: {
					where: {
						userId: userId, // Only fetch visits by the current user
					},
					select: {
						id: true,
					},
				},
			},
		});

		return markers.map((marker) => {
			const commentsCount = marker.MarkerComment.length;
			const voteCount = marker.votes.length;
			const { level } = getLevelAndProgress(voteCount);

			return {
				...marker,
				visitedByCurrentUser: marker.MarkerVisit.length > 0,
				commentsCount,
				level,
			};
		});
	}),

});
