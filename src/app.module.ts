import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { FacultyModule } from './faculty/faculty.module';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv'

dotenv.config()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    UserModule,
    AdminModule,
    FacultyModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PASSWORD
        }
      }
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ChatModule,
    
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/verifyOtp', method: RequestMethod.POST },
        { path: 'admin/login', method: RequestMethod.POST },
        { path: 'user/loginWithGoogle', method: RequestMethod.POST },
        { path: 'user/webhook', method: RequestMethod.POST },
        { path: 'user/homeCount', method: RequestMethod.GET },
        { path: 'faculty/register', method: RequestMethod.POST },
        { path: 'faculty/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
