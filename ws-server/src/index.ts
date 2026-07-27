import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const port = Number(requireEnv('WS_PORT'));
const corsOrigin = requireEnv('WS_CORS_ORIGIN');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: corsOrigin },
});

let activeTabs = 0;

io.on('connection', (socket) => {
  activeTabs += 1;
  io.emit('active-tabs', activeTabs);

  socket.on('disconnect', () => {
    activeTabs -= 1;
    io.emit('active-tabs', activeTabs);
  });
});

httpServer.listen(port, () => {
  console.log(`ws-server listening on port ${port}`);
});
