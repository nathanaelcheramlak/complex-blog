import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Glogbal prefix /api
  app.setGlobalPrefix('api');

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog Api')
    .setDescription('Blog API documentation')
    .setVersion('1.0.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 5000);
}

async function bootstrapCli() {
  await CommandFactory.run(AppModule);
}

if (process.argv.includes('seed')) {
  void bootstrapCli();
} else {
  void bootstrap();
}
