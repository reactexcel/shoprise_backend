// chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../data-service/entities/message.entity';
import { MessagePayloadDto } from './dto/messagePayload.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async saveMessage(messageData:MessagePayloadDto): Promise<Message> {
        const newMessage = this.messageRepository.create(messageData);
        return await this.messageRepository.save(newMessage);
    }

    async getMessages(senderId: number, recipientId: number): Promise<Message[]> {
        return await this.messageRepository.find({
            where: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId },
            ],
        });
    }
}
