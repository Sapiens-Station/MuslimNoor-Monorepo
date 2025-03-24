import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mosque, MosqueSchema } from './schemas/mosque.schema';
import { MosquesController } from './controllers/mosques.controller';
import { MosqueService } from './services/mosque.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Mosque.name, schema: MosqueSchema }])],
  controllers: [MosquesController],
  providers: [MosqueService],
  exports: [MosqueService],
})
export class MosquesModule {}