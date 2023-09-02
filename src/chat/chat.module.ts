import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { studentSchema } from '../models/student.schema';
import { communityChatSchema } from '../models/community-chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { messagesSchema } from '../models/messages.schema';
import { groupChatSchema } from '../models/group-chat.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:'students',schema:studentSchema},
    {name:'communityChat',schema:communityChatSchema},
    {name:'groupChat',schema:groupChatSchema},
    {name:'messages',schema:messagesSchema},
]),],
  providers: [ChatGateway]
})
export class ChatModule {}
