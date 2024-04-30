// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessagePayloadDto } from './dto/messagePayload.dto';
import { AuthService } from 'src/auth/auth.service';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers?.authorization.split(' ')[1];
      if (!token) {
        return;
      }
      const decodedData = this.authService.verifyJwtToken(token);
      client.join(decodedData.id.toString());
      console.log(`Client ${decodedData.firstName} ${client.id} Connected`);
    } catch (error) {
      Logger.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    const token = client.handshake.headers?.authorization.split(' ')[1];
    if (!token) {
      return;
    }
    const decodedData = this.authService.verifyJwtToken(token);
    client.join(decodedData.id.toString());
    console.log(`Client ${decodedData.firstName} ${client.id} Disconnected`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: MessagePayloadDto,
  ): Promise<void> {
    try {
      await this.chatService.saveMessage(payload);
    } catch (error) {
      console.error('Error saving message to database:', error);
      return;
    }
    this.server.to(payload.recipientId.toString()).emit('message', payload);
  }

  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(client: Socket, receiverId: any) {
    try {
      const currentUser = client.handshake.headers?.authorization.split(' ')[1];
      if (!currentUser) {
        return;
      }
      const decodedData = this.authService.verifyJwtToken(currentUser);
      const senderData = await this.userService.fetchById(decodedData.id);
      const receiverData = await this.userService.fetchById(
        receiverId.receiverId,
      );

      console.log(senderData.firstName, receiverData.firstName, '0000');
      const messages = await this.chatService.getMessages(
        decodedData.id.toString(),
        receiverId.receiverId,
      );

      const payload = {
        senderData: senderData,
        receiverData: receiverData,
        messages: messages,
      };

      this.server.to(decodedData.id.toString()).emit('fetchMessages', payload);
    } catch (error) {
      Logger.error('Error fetching messages:', error);
      client.emit('fetchMessagesError', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('fetchAllReceivers')
  async handleFetchAllReceivers(client: Socket): Promise<void> {
    try {
      const token = client.handshake.headers?.authorization.split(' ')[1];
      if (!token) {
        return;
      }
      const decodedData = this.authService.verifyJwtToken(token);
      const receiverNames = await this.userService.fetchAllReceiver(
        decodedData.id.toString(),
      );
      this.server
        .to(decodedData.id.toString())
        .emit('fetchAllReceivers', receiverNames);
    } catch (error) {
      Logger.error('Error fetching all receivers:', error);
      client.emit('fetchAllReceiversError', {
        success: false,
        message: error.message,
      });
    }
  }
}
