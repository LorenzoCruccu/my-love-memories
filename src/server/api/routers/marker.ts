import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const markerRouter = createTRPCRouter({

	getAllMarkers: publicProcedure.query(async ({ ctx }) => {
		const markers = await ctx.db.marker.findMany();

		return markers ?? null;
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

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.post.findFirst({
			orderBy: { createdAt: "desc" },
			where: { createdBy: { id: ctx.session.user.id } },
		});

		return post ?? null;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		
		return "you can now see this secret message!";
	}),
});
