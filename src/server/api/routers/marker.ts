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
				intimacyLevel:z.number().nullable()

			}))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.marker.create({
				data: {
					title: input.title,
					description: input.description,
					lat:  input.lat,
					lng: input.lng,
					intimacyLevel:input.intimacyLevel,
					createdBy: { connect: { id: ctx.session.user.id } },
				},
			});
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
