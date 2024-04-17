// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import {Server , Socket} from 'socket.io'
import { ChatService} from './chat.service';
import { MessagePayloadDto } from './dto/messagePayload.dto';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private chatService: ChatService, private authService:AuthService) {} 

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        const token = client.handshake.headers?.authorization.split(' ')[1];
        const decodedData = this.authService.verifyJwtToken(token);
        client.join(decodedData.id.toString())
    }

    handleDisconnect(client: Socket) {
        console.log(`Client ${client.id} disconnected`);
    }

    @SubscribeMessage('message')
    async handleMessage(client: Socket, payload:MessagePayloadDto): Promise<void> {
        try {
            await this.chatService.saveMessage(payload);
        } catch (error) {
            console.error('Error saving message to database:', error);
            return;
        }
        this.server.to(payload.recipientId.toString()).emit('message', payload);
    }
}
