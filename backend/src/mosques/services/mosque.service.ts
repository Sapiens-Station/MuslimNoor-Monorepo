import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mosque } from '../schemas/mosque.schema';
import { User, UserDocument, UserRole } from 'src/users/schemas/user.schema';

@Injectable()
export class MosqueService {
  constructor(
    @InjectModel(Mosque.name) private mosqueModel: Model<Mosque>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
    const updated = await this.mosqueModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Mosque not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.mosqueModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Mosque not found');
    return { message: 'Mosque deleted successfully' };
  }

  // ✅ List users for a mosque
  async getMosqueUsers(mosqueId: string, requester: any) {
    if (
      requester.role === UserRole.MOSQUE_AUTHORITY &&
      requester.mosqueId.toString() !== mosqueId
    ) {
      throw new ForbiddenException('Cannot view another mosque’s users');
    }
    return this.userModel
      .find({ mosqueId })
      .select('-password')
      .lean()
      .exec();
  }


  async assignAuthority(mosqueId: string, userId: string) {
    const mosque = await this.mosqueModel.findById(mosqueId);
    if (!mosque) throw new NotFoundException('Mosque not found');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.role = UserRole.MOSQUE_AUTHORITY;

    // ✅ Explicit cast
    user.mosqueId = mosque._id as Types.ObjectId;

    await user.save();

    return {
      message: `User ${user.email} assigned as authority for ${mosque.name}`,
    };
  }
}
