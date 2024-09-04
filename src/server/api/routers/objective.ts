import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

export const objectiveRouter = createTRPCRouter({
  objectivesList: protectedProcedure.query(async ({ ctx }) => {
    // Fetch all objectives from the database
    const objectives = await ctx.db.objective.findMany();

    // Fetch the current user's objective status
    const userId = ctx.session.user.id;
    const userObjectives = await ctx.db.userObjective.findMany({
      where: {
        userId,
      },
      include: {
        objective: true,
      },
    });

    // Create a map to quickly lookup the user's progress for each objective
    const userObjectiveMap = new Map(
      userObjectives.map((uo) => [uo.objectiveId, uo])
    );

    // Return the list of objectives with their status for the current user
    return objectives.map((objective) => {
      const userObjective = userObjectiveMap.get(objective.id);

      return {
        id: objective.id,
        name: objective.name,
        description: objective.description,
        targetValue: objective.targetValue,
        currentValue: userObjective?.currentValue ?? 0,
        progress: userObjective?.progress ?? 0,
        completedAt: userObjective?.completedAt ?? null,
      };
    });
  })
});
