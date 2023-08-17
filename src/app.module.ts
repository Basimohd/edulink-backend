import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { FacultyModule } from './faculty/faculty.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school-management'),
    UserModule,
    AdminModule,
    FacultyModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'edulinkschoolofficial@gmail.com',
          pass: 'rvdyuzkcjgcbnird'
        }
      }
    }),
    JwtModule.register({
      global: true,
      secret: "jwtSecret",
      signOptions: { expiresIn: '3d' },
    }),
    
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
        { path: 'faculty/register', method: RequestMethod.POST },
        { path: 'faculty/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
