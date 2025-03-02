import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryAbstract } from 'src/shared/db-tools/repository-abstract';
import { Posts, PostsDocument } from './schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService extends RepositoryAbstract<Posts, PostsDocument> {
  constructor(@InjectModel(Posts.name) postModel: Model<PostsDocument>) {
    super(postModel);
  }

  /**
   * Takes a post data as a param and creates a new post
   *
   * @param postData - data of the post to be created
   * @returns - created post
   * @memberof PostsService
   */
  public createPost(postData: Posts): Promise<Posts> {
    return this.create({
      ...postData,
      comments: [],
    });
  }

  /**
   * Returns a list of posts based on the provided filters
   *
   * @param filters - filters to be applied
   * @returns - list of posts
   * @memberof PostsService
   */
  public async getPostList(filters: FilterQuery<Posts>): Promise<Posts[]> {
    const posts = await this.findMultiple(filters);

    if (posts?.length > 0) {
      return posts;
    }
    return [];
  }

  /**
   * Returns a post with the provided id
   *
   * @param id - id of the post to be fetched
   * @returns - post with the provided id
   * @memberof PostsService
   */
  public async getPostById(id: string): Promise<Posts> {
    const post = await this.findOne({ _id: id });

    if (!post) {
      throw new NotFoundException(`Post with provided id: ${id} not found`);
    }
    return post;
  }

  /**
   * Updates a post with the provided id
   *
   * @param id - id of the post to be updated
   * @param postData - data to be updated
   * @returns - updated post
   * @memberof PostsService
   */
  public async updatePost(
    id: string,
    postData: UpdatePostDto,
  ): Promise<Posts | null> {
    const post = { ...postData };

    return this.update({ _id: id }, post);
  }

  /**
   * Deletes a post with the provided id
   *
   * @param id - id of the post to be deleted
   * @returns - deleted post
   * @memberof PostsService
   */
  public async deletePost(id: string): Promise<unknown> {
    return this.remove({ _id: id });
  }
}
