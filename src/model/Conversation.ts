import { model, Document, Schema, Types } from "mongoose";
import Chat, { IChat } from "./Chat";
import { decrypt } from "../util/cryptography";

interface IConvesation extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  conversation: typeof Chat[];
}

interface IMethods extends IConvesation{
    decrypt():void
}

const ConversationSchema = new Schema<IConvesation>({
  from: {
    type: "ObjectId",
    required: true,
  },
  to: {
    type: "ObjectId",
    required: true,
  },
  conversation: [
    {
      type: "ObjectId",
      ref: "Chat",
    },
  ],
},{
  timestamps:true
});

ConversationSchema.methods.decrypt=async function(){
    const conversation=this.conversation
    conversation.map((item:IChat):void=>{
        item.message=decrypt(item.message)
    })
}


export default model<IMethods>("Conversation", ConversationSchema);
