// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'ws';

// @WebSocketGateway({ path: '/api/live-stats' })
// export class LiveStatsGateway {
//   @WebSocketServer()
//   server: Server;

//   // Broadcast job updates to all connected clients
//   broadcastJobUpdate(jobId: string, status: string) {
//     this.server.clients.forEach(client => {
//       if (client.readyState === client.OPEN) {
//         client.send(JSON.stringify({ jobId, status }));
//       }
//     });
//   }
// }

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({
  path: '/api/live-stats',
  cors: {
    origin: 'http://localhost:3001', // Allow WebSocket connections from this origin
    credentials: true,
  },
})
export class LiveStatsGateway {
  @WebSocketServer()
  server: Server;

  broadcastJobUpdate(jobId: string, status: string) {
    this.server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ jobId, status }));
      }
    });
  }
}