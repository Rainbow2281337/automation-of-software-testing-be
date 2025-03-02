import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/shared/guards/auth/auth.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schema/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Creates post' })
  @ApiResponse({
    status: 200,
    description: 'The created record',
    type: Posts,
  })
  public create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get posts list' })
  @ApiQuery({
    description: 'Optionalliy filters query params can be passed.',
  })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: Array<Posts>,
  })
  public findAll(@Query() filters: Posts): Promise<Posts[]> {
    return this.postsService.getPostList(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post details by id' })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Posts,
  })
  public findOne(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getPostById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Updates post details by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated record.',
    type: Posts,
  })
  public update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdatePostDto,
  ): Promise<Posts | null> {
    return this.postsService.updatePost(id, updateRestaurantDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete post by id.',
  })
  @UseGuards(AuthGuard)
  public remove(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
