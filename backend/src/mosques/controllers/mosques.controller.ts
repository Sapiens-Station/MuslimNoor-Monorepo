import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common'
import { MosqueService } from '../services/mosque.service'

@Controller('mosques')
export class MosquesController {
  constructor(private readonly mosqueService: MosqueService) {}

  @Post()
  create(@Body() body: any) {
    return this.mosqueService.create(body)
  }

  @Get()
  findAll() {
    return this.mosqueService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mosqueService.findById(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.mosqueService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mosqueService.delete(id)
  }
}
