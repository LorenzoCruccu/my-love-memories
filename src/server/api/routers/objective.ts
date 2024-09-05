import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const objectiveRouter = createTRPCRouter({
	objectivesList: publicProcedure.query(async ({ ctx }) => {
		// Fetch all objectives from the database
		const objectives = await ctx.db.objective.findMany();

		// Fetch the current user's objective status
		const userId = ctx.session?.user.id;
		if (!userId) return [];

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
