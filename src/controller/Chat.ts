import { bodyValidator, controller, del, get, post } from "../decorator";
import { Request, Response } from "express";
import Chat from "../model/Chat";
import Conversation from "../model/Conversation";
import { Packet } from "../library/Packet";
import { decrypt } from "../util/cryptography";
import User from "../model/User";
import mongoose from "mongoose";

@controller("/chat")
class ChatController {
  @get("/:id")
  async getChat(req: Request, res: Response) {
    const { id } = req.params;

    const chat = await Chat.findById(id);

    if (!chat) return res.status(404).json(Packet("No Chat with this Id"));

    const message = decrypt(chat.message);

    res.status(201).json(Packet("Chat Founded", message));
  }

  @post("/:from/:to")
  @bodyValidator("message")
  async createChat(req: Request, res: Response) {
    const { from, to } = req.params;
    const { message } = req.body;

    const isUserExist = await User.find({ $or: [{ _id: from }, { _id: to }] });

    if (isUserExist.length !== 2)
      return res.status(404).json(Packet("User is Missing"));

    const conversation = await Conversation.findOne({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    const chat = new Chat({ from, to, message });
    chat.encrypt();
    await chat.save();

    if (!conversation) {
      const conversation = new Conversation({ from, to });
      await User.updateMany(
        { $or: [{ _id: from }, { _id: to }] },
        { $push: { conversations: conversation._id } }
      );
      await User.findOneAndUpdate(
        { _id: from },
        { $push: { contacts: to } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { _id: to },
        { $push: { contacts: from } },
        { new: true }
      );
      
      conversation?.conversation.push(chat._id);
      await conversation.save();
      return res.status(201).json(Packet("Chat Added", { chat }));
    }

    conversation?.conversation.push(chat._id);
    await conversation.save();
    res.status(201).json(Packet("Chat Added", { chat }));
  }

  @del("/:id")
  async deleteChat(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(201).json(Packet("Invalid Id"));

    try {
      await Chat.findByIdAndRemove(id);

      res.status(201).json(Packet("Chat Deleted"));
    } catch (error) {
      res.status(501).json(Packet("Error Occured"));
    }
  }
}
