import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentService } from 'src/comment/comment.service';
import { UpdateCommentDto } from 'src/comment/dtos/update-comment.dto';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiOkResponse({ description: 'Comment found', type: CommentEntity })
  async getCommentById(@Param('id') id: number): Promise<CommentEntity> {
    return this.commentService.getCommentById(id);
  }

  @ApiBearerAuth('jwt')
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiOkResponse({ description: 'Comment updated', type: CommentEntity })
  async updateComment(
    @CurrentUser('userId') userId: number,
    @Param('id') id: number,
    @Body() body: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.updateComment(userId, id, body);
  }

  @ApiBearerAuth('jwt')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiNoContentResponse({ description: 'Comment deleted' })
  async deleteComment(
    @CurrentUser('userId') userId: number,
    @Param('id') id: number,
  ): Promise<void> {
    return this.commentService.deleteComment(userId, id);
  }
}
