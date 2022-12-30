import { model, Document, Schema, Types } from "mongoose";
import { encrypt } from "../util/cryptography";

export interface IChat extends Document {
  from: Types.ObjectId
  to: Types.ObjectId
  message: string;
  seen:boolean
}

interface IDocument extends IChat,Document {
  encrypt(): void
  // markAsSeened():void
}

const ChatSchema = new Schema<IChat>(
  {
    from: {
      type: "ObjectId",
      required: true,
    },
    to: {
      type: "ObjectId",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen:{
      type:Boolean,
      default:false 
    }
  },
  {
    timestamps: true,
  }
);

ChatSchema.methods.encrypt = function () {
  const message = encrypt(this.message);
  this.message = message;
};



export default model<IDocument>("Chat", ChatSchema);
