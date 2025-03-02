import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryAbstract } from 'src/shared/db-tools/repository-abstract';
import { Comment, CommentDocument } from './schema/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CommentService extends RepositoryAbstract<
  Comment,
  CommentDocument
> {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {
    super(commentModel);
  }

  /**
   * Checks if the post exists. If it does not exist, it throws an exception. Otherwise, it returns true.
   *
   * @param postId - The post id
   * @returns - True if the post exists, otherwise throws an exception
   * @memberof CommentService
   */
  private async checkIfPostExists(postId: string): Promise<boolean> {
    const post = await this.postsService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return true;
  }

  /**
   * Takes a comment data as a param and creates a new comment
   *
   * @param commentData - data of the comment to be created
   * @returns - created comment
   * @memberof CommentService
   */
  public async createCommment(commentData: Comment): Promise<Comment> {
    await this.checkIfPostExists(commentData.postId);

    return this.create(commentData);
  }

  /**
   * Checks if the post exists. If it does not exist, it throws an exception.
   * Otherwise it returns comments of the post.
   *
   * @param postId - The post id
   * @returns - List of comments
   * @memberof CommentService
   */
  public async findAllCommentsByPostId(postId: string): Promise<Comment[]> {
    await this.checkIfPostExists(postId);

    return this.findMultiple({
      postId,
    } as FilterQuery<CommentDocument>);
  }

  /**
   * Deletes a comment based on the provided comment id
   *
   * @param commentId - The comment id
   * @returns - The deleted comment
   * @memberof CommentService
   */
  public deleteComment(commentId: string): Promise<unknown> {
    return this.remove({ _id: commentId });
  }
}
