import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerDocumentOptions,SwaggerModule} from '@nestjs/swagger'
import { join } from 'path';
import {Server} from 'socket.io'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const httpServer = app.getHttpServer();
  // const io = new Server(httpServer);
  // app.useWebSocketAdapter(new IoAdapter(io));

  const config = new DocumentBuilder()
    .setTitle('SHOP RISE')
    .setDescription('SHOP RISE API')
    .setVersion('1.0')
    .addBearerAuth()
    .setExternalDoc('Collection', '/docs-json')
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useStaticAssets(join(__dirname,'..',  'uploads'));
  await app.listen(3000);
}
bootstrap();
