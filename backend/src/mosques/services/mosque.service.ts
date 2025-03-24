import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mosque } from '../schemas/mosque.schema';

@Injectable()
export class MosqueService {
  constructor(@InjectModel(Mosque.name) private mosqueModel: Model<Mosque>) {}

  async create(data: Partial<Mosque>) {
    return this.mosqueModel.create(data);
  }

  async findAll() {
    return this.mosqueModel.find();
  }

  async findById(id: string) {
    const mosque = await this.mosqueModel.findById(id);
    if (!mosque) throw new NotFoundException('Mosque not found');
    return mosque;
  }

  async update(id: string, data: Partial<Mosque>) {
    return this.mosqueModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.mosqueModel.findByIdAndDelete(id);
  }
}