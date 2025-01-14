import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Allow frontend connection
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleJoinAuction(client: Socket, payload: { itemId: number }) {
    const room = `auction-${payload.itemId}`;
    client.join(room);
    console.log(`Client joined room: ${room}`);
  }

  sendAuctionUpdate(itemId: number, highestBid: number, duration: number) {
    const room = `auction-${itemId}`;
    this.server.to(room).emit('auctionUpdate', { itemId, highestBid, duration });
  }
}
