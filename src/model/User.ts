import { model, Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  email: string;
  name: string;
  password: string;
  isActive: Boolean;
  conversations: Types.ObjectId[];
  contacts:[]
}

interface IDocument extends IUser {
  encrypt(): void;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    contacts:[
      {
        type:"ObjectId",
        // ref:"users"
      }
    ],
    conversations: [
      {
        type: "ObjectId",
        ref: "conversations",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.encrypt = async function () {
  const encryptedPass = await bcrypt.hash(this.password, 12);
  this.password = encryptedPass;
};

export default model<IDocument>("User", UserSchema);
