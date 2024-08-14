import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

type CommentWithLikes = {
  id: number;
  markerId: number;
  text: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    image: string | null;
  };
  likedByCurrentUser: boolean;
  likeCount: number;
};

export const markerCommentRouter = createTRPCRouter({

	getCommentsFromMarkerId: publicProcedure
  .input(z.object({ markerId: z.number() }))
  .query(async ({ ctx, input }): Promise<CommentWithLikes[]> => {
    const markerComments = await ctx.db.markerComment.findMany({
      include: {
        createdBy: true,
        CommentLike: true, // Include likes to track if the current user has liked the comment
      },
      where: {
        markerId: input.markerId,
      },
    });

    // Return comments with a flag indicating if the current user liked them
    return markerComments.map((comment) => ({
      id: comment.id,
      markerId: comment.markerId,
      text: comment.text,
      createdById: comment.createdById,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      createdBy: {
        id: comment.createdBy.id,
        name: comment.createdBy.name!,
        image: comment.createdBy.image,
      },
      likedByCurrentUser: comment.CommentLike.some(
        (like) => like.userId === ctx.session?.user?.id
      ),
      likeCount: comment.CommentLike.length,
    }));
  }),


	create: protectedProcedure
		.input(z.object(
			{
				markerId: z.number(),
				text: z.string().min(1),
			}))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.markerComment.create({
				data: {
					markerId: input.markerId,
					text: input.text,
					createdById: ctx.session.user.id,
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


		toggleLike: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the comment is already liked by the user
      const existingLike = await ctx.db.commentLike.findFirst({
        where: {
          commentId: input.commentId,
          userId: userId,
        },
      });

      if (existingLike) {
        // If a like exists, remove it (unlike)
        await ctx.db.commentLike.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        // If no like exists, add a new like
        await ctx.db.commentLike.create({
          data: {
            commentId: input.commentId,
            userId: userId,
          },
        });
      }
		
})})
