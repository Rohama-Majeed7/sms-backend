import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('API documentation for LMS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: [process.env.sms_user_portal_url, process.env.sms_admin_portal_url],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
