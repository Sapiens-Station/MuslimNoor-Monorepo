// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

type JwtPayload = { sub: string; role: string; mosqueId?: string }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies?.['accessToken'] ? req.cookies['accessToken'] : null),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload) {
    // If you want to ensure the user still exists, do a DB lookup here.
    // Otherwise, trust payload:
    return {
      _id: payload.sub,
      role: payload.role,
      mosqueId: payload.mosqueId,
    }
  }
}
