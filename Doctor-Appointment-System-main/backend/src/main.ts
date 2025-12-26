import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Enable CORS - simplified configuration
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`✅ Backend is running on http://localhost:${port}`);
  console.log('✅ CORS enabled for: http://localhost:3001 and http://localhost:3000');
  console.log('✅ Available routes:');
  console.log('   POST /users/login - User login');
  console.log('   POST /users - Create user');
  console.log('   GET /users - Get all users');
}
bootstrap();
