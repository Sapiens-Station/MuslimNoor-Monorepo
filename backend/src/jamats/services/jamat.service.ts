// src/jamats/services/jamat.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Jamat, JamatDocument } from '../schemas/jamat.schema';
import { PrayerTimesService } from 'src/prayer-time/services/prayer-times.service';
import { UserRole } from 'src/users/schemas/user.schema';
import { PrayerName } from '../schemas/jamat.schema';

@Injectable()
export class JamatService {
  constructor(
    @InjectModel(Jamat.name)
    private jamatModel: Model<JamatDocument>,
    private readonly prayerTimesService: PrayerTimesService,
  ) {}

  // Get a single schedule by date and mosque (public)
  async getSchedule(mosqueId: string, date: string) {
    return this.jamatModel.findOne({
      mosqueId,
      date: new Date(date),
    });
  }

  // Get schedules for the next 10 days (public)
  async getTenDays(mosqueId: string, from = new Date().toISOString()) {
    const start = new Date(from);
    const end = new Date(start);
    end.setDate(start.getDate() + 9);
    return this.jamatModel
      .find({
        mosqueId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: 1 })
      .exec();
  }

  // Create or upsert a schedule (requires mosqueAuthority or admin)
  async createSchedule(
    body: {
      mosqueId: string;
      date: string;
      jamatTimes: { prayerName: PrayerName; iqamaTime: string; azanTime?: string }[];
    },
    user: { role: string; mosqueId: string; _id: string },
  ) {
    // Only allow mosqueAuthority to create schedules in their own mosque
    if (
      user.role === UserRole.MOSQUE_AUTHORITY &&
      user.mosqueId?.toString() !== body.mosqueId
    ) {
      throw new ForbiddenException('Cannot create schedule for another mosque');
    }

    return this.jamatModel.findOneAndUpdate(
      { mosqueId: body.mosqueId, date: new Date(body.date) },
      {
        mosqueId: new Types.ObjectId(body.mosqueId),
        date: new Date(body.date),
        jamatTimes: body.jamatTimes,
        createdBy: new Types.ObjectId(user._id),
      },
      { upsert: true, new: true },
    );
  }

  // Update a schedule by ID (requires mosqueAuthority or admin)
  async updateSchedule(
    id: string,
    body: {
      mosqueId: string;
      date: string;
      jamatTimes: { prayerName: PrayerName; iqamaTime: string; azanTime?: string }[];
    },
    user: { role: string; mosqueId: string },
  ) {
    const jamat = await this.jamatModel.findById(id);
    if (!jamat) {
      throw new Error('Jamat schedule not found.');
    }
    if (
      user.role === UserRole.MOSQUE_AUTHORITY &&
      user.mosqueId?.toString() !== jamat.mosqueId.toString()
    ) {
      throw new ForbiddenException('Cannot update another mosque’s schedule');
    }
    return this.jamatModel.findByIdAndUpdate(
      id,
      {
        mosqueId: new Types.ObjectId(body.mosqueId),
        date: new Date(body.date),
        jamatTimes: body.jamatTimes,
      },
      { new: true },
    );
  }

  // Update a single prayer’s iqama time (requires mosqueAuthority or admin)
  async updatePrayerTime(
    id: string,
    prayerName: PrayerName,
    iqamaTime: string,
    user: { role: string; mosqueId: string },
  ) {
    const jamat = await this.jamatModel.findById(id);
    if (!jamat) {
      throw new Error('Jamat schedule not found.');
    }
    if (
      user.role === UserRole.MOSQUE_AUTHORITY &&
      user.mosqueId?.toString() !== jamat.mosqueId.toString()
    ) {
      throw new ForbiddenException('Cannot update another mosque’s schedule');
    }
    jamat.jamatTimes = jamat.jamatTimes.map((item) =>
      item.prayerName === prayerName
        ? { ...item, iqamaTime }
        : item,
    );
    return jamat.save();
  }

  // Auto-fill a schedule (requires mosqueAuthority or admin)
  async autoFillSchedule(
    body: { mosqueId: string; lat: number; lon: number; date: string },
    user: { role: string; mosqueId: string },
  ) {
    if (
      user.role === UserRole.MOSQUE_AUTHORITY &&
      user.mosqueId?.toString() !== body.mosqueId
    ) {
      throw new ForbiddenException('Cannot auto-fill for another mosque');
    }
    try {
      // Fetch prayer times from an external service
      const prayerTimes = await this.prayerTimesService.getDailyPrayerTimes(
        body.lat,
        body.lon,
        body.date,
      );
      // Map to jamatTimes array, casting prayerName to PrayerName
      const jamatTimes = Object.entries(prayerTimes).map(([prayerName, time]) => ({
        prayerName: prayerName as PrayerName,
        iqamaTime: String(time),
      }));
      return this.createSchedule(
        {
          mosqueId: body.mosqueId,
          date: body.date,
          jamatTimes,
        },
        // Provide an object with role, mosqueId, and userId (_id) to satisfy type checking
        { role: user.role, mosqueId: body.mosqueId, _id: user['?id'] },
      );
    } catch (error) {
      throw new Error('Failed to auto-fill jamat times: ' + error.message);
    }
  }

  // Delete a schedule (requires mosqueAuthority or admin)
  async deleteSchedule(id: string, user: { role: string; mosqueId: string }) {
    const jamat = await this.jamatModel.findById(id);
    if (!jamat) {
      throw new Error('Jamat schedule not found.');
    }
    if (
      user.role === UserRole.MOSQUE_AUTHORITY &&
      user.mosqueId?.toString() !== jamat.mosqueId.toString()
    ) {
      throw new ForbiddenException('Cannot delete another mosque’s schedule');
    }
    await this.jamatModel.findByIdAndDelete(id);
    return { message: 'Jamat schedule deleted successfully' };
  }

  async getJamatTimes(mosqueId: string, date: string) {
    return this.jamatModel.findOne({ mosqueId, date });
  }
  
}
