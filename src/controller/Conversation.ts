import { bodyValidator, controller, del, get, post, use } from "../decorator";
import { Request, Response } from "express";
import Conversation from "../model/Conversation";
import { Packet } from "../library/Packet";
import Chat from "../model/Chat";
import UserAuth from "../middleware/user";

@controller("/conversation")
class ConversationController{

    @get("/:from/:to")
    // @use(UserAuth)
    async getConversation(req:Request,res:Response){
        const {from,to}=req.params

        const conversation=await Conversation.findOne({
            $or:[
                {from,to},
                {from:to,to:from}
            ]
        }).populate("conversation")

        await Chat.updateMany({$or:[{from,to},{from:to,to:from}]},{seen:true},{multi:true})
        
        if(!conversation) return res.status(404).json(Packet("No Coversation with this ID"))
        
        conversation.decrypt()
        
        res.status(201).json(Packet("Created",conversation))
    }
    
    @del("/chat/:id")
    @use(UserAuth)
    async deleteChat(req:Request,res:Response){
        const {id}=req.params
        const {chatId}=req.query
        
        const conversation=await Conversation.findById(id)

        if(!conversation) return res.status(404).json(Packet("No Coversation with this ID"))

        await Conversation.findByIdAndUpdate(id,{$pull:{conversation:chatId}},{new:true})
        
        res.status(201).json(Packet("Created",conversation))
    }

}