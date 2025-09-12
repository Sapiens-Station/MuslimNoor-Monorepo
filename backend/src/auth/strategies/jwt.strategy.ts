import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { User, UserDocument } from 'src/users/schemas/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

async validate(payload: JwtPayload): Promise<any> {
  const user = await this.userModel.findById(payload.sub).lean();
  if (!user) throw new UnauthorizedException('Invalid token');
  // return a sanitized object instead of the entire user
  return {
    _id: user._id.toString(),
    role: user.role,
    mosqueId: user.mosqueId?.toString(),
  };
}

}
