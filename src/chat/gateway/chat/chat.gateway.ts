import { InjectModel } from '@nestjs/mongoose';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { groupType, messageDetails, saveMessageDetails, senderType } from '../../interfaces/messageDetails.interface';
import { communityChat } from 'models/community-chat.schema';
import { messages, messagesDocument } from 'models/messages.schema';
import { Model } from 'mongoose';
import { Server,Socket } from 'socket.io';
import { groupChat } from 'models/group-chat.schema';

@WebSocketGateway({cors:[process.env.FRONTEND_URL]})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect{
  
  constructor(
    @InjectModel('communityChat') private readonly communityChatModel: Model<communityChat>,
    @InjectModel('groupChat') private readonly groupChatModel: Model<groupChat>,
    @InjectModel('messages') private readonly messagesChatModel: Model<messages>,
  ){ }
  @SubscribeMessage('sendMessage')
  async handleMessage(soket:Socket,message:messageDetails) {
    const messageDetails:saveMessageDetails = {
      message: message.content
    }
    if(message.senderType == senderType.STUDENT){
      messageDetails.studentSender = message.senderId
    }else{
      messageDetails.facultySender = message.senderId
    }
    const messageSaved = await new this.messagesChatModel(messageDetails).save();

    if (messageSaved) {
      if (message.groupType === groupType.COMMUNITY) { 
        await this.communityChatModel.updateOne(
          { _id: message.groupId },
          {
            $push: { messages: messageSaved._id }
          }
        );
      } else {
        await this.groupChatModel.updateOne(
          { _id: message.groupId },
          {
            $push: { messages: messageSaved._id }
          }
        );
      }
    }
    this.server.emit('newMessage',message)
  }

  @WebSocketServer()
  server : Server

  handleConnection() {
      console.log("cnn made")

  }

  handleDisconnect() {
      console.log("disconnected");
      
  }

}
