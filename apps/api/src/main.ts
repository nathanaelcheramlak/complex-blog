import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
