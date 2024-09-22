import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWTKEY,
            signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        }),
        UserModule,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
    controllers: [AuthController],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
