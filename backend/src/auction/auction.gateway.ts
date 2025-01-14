import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody
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

  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { itemId: number },
  ) {
    const room = `auction-${payload.itemId}`;
    client.join(room);
    console.log(`Client joined room: ${room}`);
  }

  sendAuctionUpdate(itemId: number, highestBid: number, remainingTime: number) {
    const room = `auction-${itemId}`;
    this.server.to(room).emit('auctionUpdate', { highestBid, remainingTime });
  }
}
