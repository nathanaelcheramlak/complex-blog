import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTagDto } from 'src/tag/dtos/create-tag.dto';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { TagService } from 'src/tag/tag.service';

@ApiTags('Tags')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ description: 'List of all tags', type: [TagEntity] })
  async getTags(): Promise<TagEntity[]> {
    return this.tagService.getTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Tag ID' })
  @ApiOkResponse({ description: 'Tag found', type: TagEntity })
  async getTagById(@Param('id') id: number): Promise<TagEntity> {
    return this.tagService.getTagById(id);
  }

  @ApiBearerAuth('jwt')
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiCreatedResponse({ description: 'Tag created', type: TagEntity })
  async createTag(
    @CurrentUser('userId') userId: number,
    @Body() body: CreateTagDto,
  ): Promise<TagEntity> {
    return this.tagService.createTag(userId, body);
  }
}
