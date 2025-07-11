import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { AllExceptionsFilter } from './http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable helmet for secure headers
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription(`API documentation for the Expense Tracker application`)
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    //.addServer('http://localhost:9000', 'Local Development Server')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory ,{
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      filter: true,
    },
    customSiteTitle: 'Expense Tracker API'
  });

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  await app.listen(PORT);

  console.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
