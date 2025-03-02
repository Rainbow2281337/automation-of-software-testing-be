import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Posts {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  comments: string[];
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

export type PostsDocument = HydratedDocument<Posts>;
