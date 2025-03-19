import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prayer, PrayerDocument } from '../schemas/prayer.schema';
import { CreatePrayerDto } from 'src/dtos/create-prayer.dto';
import { UpdatePrayerDto } from 'src/dtos/update-prayer.dto';

@Injectable()
export class PrayerService {
  constructor(@InjectModel(Prayer.name) private prayerModel: Model<PrayerDocument>) {}

  async create(createPrayerDto: CreatePrayerDto): Promise<Prayer> {
    const prayer = new this.prayerModel(createPrayerDto);
    return prayer.save();
  }

  async findAll(): Promise<Prayer[]> {
    return this.prayerModel.find().exec();
  }

  async findById(id: string): Promise<Prayer> {
    const prayer = await this.prayerModel.findById(id).exec();
    if (!prayer) throw new NotFoundException('Prayer not found');
    return prayer;
  }

  async update(id: string, updatePrayerDto: UpdatePrayerDto): Promise<Prayer> {
    const updatedPrayer = await this.prayerModel.findByIdAndUpdate(id, updatePrayerDto, { new: true }).exec();
  
    if (!updatedPrayer) {
      throw new NotFoundException(`Prayer with ID ${id} not found`);
    }
  
    return updatedPrayer;
  }
  

  async delete(id: string): Promise<{ message: string }> {
    await this.prayerModel.findByIdAndDelete(id);
    return { message: 'Prayer deleted successfully' };
  }
}
