import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const markerVote = createTRPCRouter({
	voteMarker: protectedProcedure
  .input(
    z.object({
      markerId: z.number(),
      vote: z.enum(["UP", "DOWN"]),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { markerId, vote } = input;

    // Find existing vote for the user on this marker
    const existingVote = await ctx.db.markerVote.findUnique({
      where: {
        markerId_userId: {
          markerId,
          userId: ctx.session.user.id,
        },
      },
    });

    if (existingVote) {
      // If a vote already exists, update it
      await ctx.db.markerVote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          vote: vote,
        },
      });
    } else {
      // Otherwise, create a new vote record
      await ctx.db.markerVote.create({
        data: {
          markerId,
          userId: ctx.session.user.id,
          vote: vote,
        },
      });

      // If the vote is an "UP" vote, track progress towards the "Upvote10" objective
      if (vote === "UP") {
        // Objective logic for "Upvote 10 times"
        const upvoteObjective = await ctx.db.objective.findFirst({
          where: { code: "Upvote10" },
        });

        if (upvoteObjective) {
          const userObjective = await ctx.db.userObjective.findFirst({
            where: {
              userId: ctx.session.user.id,
              objectiveId: upvoteObjective.id,
            },
          });

          if (userObjective) {
            const newCurrentValue = userObjective.currentValue + 1;
            const newProgress = Math.min(
              (newCurrentValue / upvoteObjective.targetValue) * 100,
              100
            );

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
                userId: ctx.session.user.id,
                objectiveId: upvoteObjective.id,
                currentValue: 1,
                progress: (1 / upvoteObjective.targetValue) * 100,
                completedAt: upvoteObjective.targetValue === 1 ? new Date() : null,
              },
            });
          }
        }
      }
    }

    return { success: true };
  }),


		checkUserVote: protectedProcedure
    .input(
      z.object({
        markerId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingVote = await ctx.db.markerVote.findUnique({
        where: {
          markerId_userId: {
            markerId: input.markerId,
            userId: ctx.session.user.id,
          },
        },
      });

      return { hasVoted: !!existingVote };
    }),

		removeVote: protectedProcedure
    .input(
      z.object({
        markerId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingVote = await ctx.db.markerVote.findUnique({
        where: {
          markerId_userId: {
            markerId: input.markerId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (existingVote) {
        await ctx.db.markerVote.delete({
          where: {
            id: existingVote.id,
          },
        });
      }

      return { success: true };
    }),

  getTotalVotes: publicProcedure
    .input(
      z.object({
        markerId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const totalVotes = await ctx.db.markerVote.count({
        where: {
          markerId: input.markerId,
        },
      });

      return totalVotes ;
    }),
});
