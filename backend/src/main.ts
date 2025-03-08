
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  app.useWebSocketAdapter(new WsAdapter(app));

    // Enable CORS
    app.enableCors({
      origin: 'http://localhost:3001', // Allow requests from this origin
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Allow cookies and credentials
    });

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();

