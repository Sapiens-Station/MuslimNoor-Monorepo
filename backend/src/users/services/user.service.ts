import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
  private users = [];

  async findAll() : Promise<User[]> {
    const users = await this.userModel.find().exec();
    console.log('🔍 Users Retrieved:', users); // ✅ Debugging log
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    if (!updatedUser) throw new NotFoundException('User not found');
    
    return updatedUser;
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndDelete(id);
    return { message: 'User deleted successfully' };
  }
}