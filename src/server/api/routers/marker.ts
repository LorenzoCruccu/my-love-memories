import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({

	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		try {
			const userId = ctx.session?.user?.id;
	
			const markers = await ctx.db.marker.findMany({
				include: {
					MarkerVisit: userId
						? {
								where: {
									userId: userId,
								},
								select: {
									id: true,
								},
							}
						: false,
				},
			});
	
			return markers.map(marker => ({
				...marker,
				visitedByCurrentUser: userId ? marker.MarkerVisit.length > 0 : false,
			}));
		} catch (error) {
			console.error("Failed to fetch markers:", error);
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to fetch markers',
			});
		}
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
