import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
      transform: true,
      whitelist: true
    }),
  );
  
  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
