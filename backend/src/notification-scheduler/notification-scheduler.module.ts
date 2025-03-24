import { Module } from '@nestjs/common';import { JamatModule } from 'src/jamats/jamat.module';
import { NotificationSchedulerController } from './controllers/notification-scheduler.controller';
import { NotificationSchedulerService } from './services/notification-scheduler.service';
import { UsersModule } from 'src/users/users.module';
import { MosquesModule } from 'src/mosques/mosques.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [JamatModule, UsersModule, JamatModule, MosquesModule, NotificationModule],
  controllers: [NotificationSchedulerController],
  providers: [NotificationSchedulerService],
})
export class NotificationSchedulerModule {}
