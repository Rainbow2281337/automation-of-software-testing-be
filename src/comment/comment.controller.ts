import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/shared/guards/auth/auth.guard';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Creates comment record for specified post',
  })
  @ApiResponse({
    status: 200,
    description: 'The created record',
    type: Comment,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception. The provided postId has not been found.',
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createCommment({
      ...createCommentDto,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the list of comment records' })
  @ApiResponse({
    status: 200,
    description: 'The list of records',
  })
  @ApiQuery({
    name: 'postId',
    required: true,
    type: String,
  })
  findAll(@Query('postId') postId: string): Promise<Comment[]> {
    return this.commentService.findAllCommentsByPostId(postId);
  }

  @Delete(':postId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Deletes specific comment record' })
  @ApiResponse({
    status: 200,
    description: 'The deleted comment',
    type: Comment,
  })
  @ApiParam({
    name: 'postId',
    type: String,
  })
  remove(@Param('postId') restaurantId: string) {
    return this.commentService.deleteComment(restaurantId);
  }
}
