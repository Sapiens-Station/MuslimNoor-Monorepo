import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from '../schemas/donation.schema';
import { CreateDonationDto } from 'src/dtos/create-donation.dto';
import { UpdateDonationDto } from 'src/dtos/update-donation.dto';

@Injectable()
export class DonationService {
  constructor(@InjectModel(Donation.name) private donationModel: Model<DonationDocument>) {}

  async create(createDonationDto: CreateDonationDto): Promise<Donation> {
    const donation = new this.donationModel(createDonationDto);
    return donation.save();
  }

  async findAll(): Promise<Donation[]> {
    return this.donationModel.find().exec();
  }

  async findById(id: string): Promise<Donation> {
    const donation = await this.donationModel.findById(id).exec();
    if (!donation) throw new NotFoundException('Donation not found');
    return donation;
  }

  async update(id: string, updateDonationDto: UpdateDonationDto): Promise<Donation> {
    
    const updateDonation = await this.donationModel.findByIdAndUpdate(id, updateDonationDto, { new: true }).exec();
      
    if (!updateDonation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
  
    return updateDonation;
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.donationModel.findByIdAndDelete(id);
    return { message: 'Donation deleted successfully' };
  }
}
