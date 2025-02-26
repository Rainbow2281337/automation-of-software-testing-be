import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JWT_SECRET } from 'src/shared/consts';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
