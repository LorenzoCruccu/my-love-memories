import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const markerVote = createTRPCRouter({
  voteMarker: protectedProcedure
    .input(
      z.object({
        markerId: z.number(),
        vote: z.enum(["UP", "DOWN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { markerId } = input;

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
            voteType:input.vote,
          },
        });
      } else {
        // Otherwise, create a new vote record
        await ctx.db.markerVote.create({
          data: {
            markerId,
            userId: ctx.session.user.id,
            voteType:input.vote,
          },
        });
      }

      // Optionally, return the updated marker or some other relevant data
      return { success: true };
    }),
});
