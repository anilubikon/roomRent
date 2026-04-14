import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { registerSocket } from './socket/socketServer.js';

async function bootstrap() {
  await connectDb();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
    },
  });

  registerSocket(io);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap app', error);
  process.exit(1);
});
