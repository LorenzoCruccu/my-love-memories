import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const markerVisitRouter = createTRPCRouter({

  // Toggle marker visit status (visited/unvisited)
  toggleVisit: protectedProcedure
    .input(z.object({ markerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the marker is already visited by the user
      const existingVisit = await ctx.db.markerVisit.findFirst({
        where: {
          markerId: input.markerId,
          userId: userId,
        },
      });

      if (existingVisit) {
        // If a visit exists, remove it (unvisit)
        await ctx.db.markerVisit.delete({
          where: {
            id: existingVisit.id,
          },
        });
      } else {
        // If no visit exists, add a new visit
        await ctx.db.markerVisit.create({
          data: {
            markerId: input.markerId,
            userId: userId,
          },
        });
      }

      return { success: true };
    }),

  // Optionally, you can add a query to check if a marker is visited by the current user
  isVisited: protectedProcedure
    .input(z.object({ markerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingVisit = await ctx.db.markerVisit.findFirst({
        where: {
          markerId: input.markerId,
          userId: userId,
        },
      });

      return Boolean(existingVisit);
    }),
});

