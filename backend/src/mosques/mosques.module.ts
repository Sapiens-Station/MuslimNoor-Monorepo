import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Mosque, MosqueSchema } from './schemas/mosque.schema'
import { MosquesController } from './controllers/mosques.controller'
import { MosqueService } from './services/mosque.service'
import { User, UserSchema } from '~/users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mosque.name, schema: MosqueSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MosquesController],
  providers: [MosqueService],
  exports: [MosqueService],
})
export class MosquesModule {}
