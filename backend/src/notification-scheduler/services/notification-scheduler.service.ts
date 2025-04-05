import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import * as dayjs from 'dayjs'
import { JamatService } from 'src/jamats/services/jamat.service'
import { MosqueService } from 'src/mosques/services/mosque.service'
import { NotificationService } from 'src/notification/notification.service'

@Injectable()
export class NotificationSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(NotificationSchedulerService.name)
  private scheduledTimers: NodeJS.Timeout[] = []

  constructor(
    private readonly jamatService: JamatService,
    private readonly notificationService: NotificationService,
    private readonly mosqueService: MosqueService
  ) {}

  async onModuleInit() {
    await this.scheduleTodayJamatNotifications()
  }

  async scheduleTodayJamatNotifications() {
    try {
      this.clearScheduledTimers()

      const mosqueId = 'mosque123' // Still hardcoded for now
      const date = dayjs().format('YYYY-MM-DD')

      await this.scheduleMosqueJamatNotifications(mosqueId, date)

      return { message: `Jamat notifications scheduled for ${mosqueId}` }
    } catch (error) {
      this.logger.error('Error scheduling Jamat notifications', error)
      throw error
    }
  }

  private clearScheduledTimers() {
    for (const timer of this.scheduledTimers) {
      clearTimeout(timer)
    }
    this.scheduledTimers = []
  }

  private async sendJamatNotification(
    mosqueId: string,
    prayerName: string,
    time: string
  ) {
    try {
      await this.notificationService.sendToUsers({
        title: 'Jamat Time',
        body: `It's time for ${prayerName} prayer at ${time}`,
        topic: `mosque-${mosqueId}`,
      })
      this.logger.log(`Notification sent for ${prayerName} at ${time}`)
    } catch (error) {
      this.logger.error(`Failed to send notification for ${prayerName}`, error)
    }
  }

  private async scheduleMosqueJamatNotifications(
    mosqueId: string,
    date: string
  ) {
    try {
      const jamatData = await this.jamatService.getJamatTimes(mosqueId, date)

      if (!jamatData || !jamatData.jamatTimes) {
        this.logger.warn(`No Jamat data found for ${mosqueId} on ${date}`)
        return
      }

      for (const { prayerName, time } of jamatData.jamatTimes) {
        const now = dayjs()
        const target = dayjs(`${date} ${time}`)
        const delay = target.diff(now)

        if (delay > 0) {
          const timer = setTimeout(() => {
            this.sendJamatNotification(mosqueId, prayerName, time)
          }, delay)

          this.scheduledTimers.push(timer)
          this.logger.log(`[${mosqueId}] Scheduled ${prayerName} at ${time}`)
        }
      }
    } catch (err) {
      this.logger.error(`[${mosqueId}] Failed to schedule notifications`, err)
    }
  }
}
