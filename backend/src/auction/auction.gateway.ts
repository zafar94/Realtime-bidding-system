import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ItemsService } from '../items/items.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly itemsService: ItemsService) { }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinAuction')
  async handleJoinAuction(client: Socket, itemId: number) {
    client.join(`auction_${itemId}`);
    console.log(`Client ${client.id} joined auction_${itemId}`);
  }

  async broadcastAuctionUpdate(itemId: number) {
    const item = await this.itemsService.getItemById(itemId);
    this.server.to(`auction_${itemId}`).emit('auctionUpdate', {
      highestBid: item.highestBid,
      duration: item.duration,
    });
  }
}
