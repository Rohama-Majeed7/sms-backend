import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('API documentation for School Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    autoTagControllers: false,
  });
  document.tags = [
    { name: 'Authentication', description: 'Authentication APIs' },
    { name: 'Users', description: 'User APIs' },
    { name: 'User - Profile', description: 'User Profile APIs' },
    { name: "User - School Connection", description: "School Connection APIs" },
    { name: 'User - Schools', description: "User Schools APIs" },
    { name: 'Admin', description: 'Admin APIs' },
    { name: 'Admin - School', description: 'Admin School APIs' }
  ];
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({
    origin: [process.env.sms_user_portal_url, process.env.sms_admin_portal_url],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}

void bootstrap();
