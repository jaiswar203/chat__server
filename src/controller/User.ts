import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { Packet as packet } from "../library/Packet";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

import {
  get,
  post,
  controller,
  bodyValidator,
  use,
  patch,
  del,
} from "../decorator";
import UserAuth from "../middleware/user";

dotenv.config()

@controller("/user")
class AuthController {

  @get("/:username")
  async getUserByUsername(req:Request,res:Response){
    const {username}=req.params

    const user=await User.findOne({username})

    if(!user) return res.status(404).json(packet("No User Founded"))

    res.status(201).json(packet("User found",{user}))
  }

  @post("/")
  @bodyValidator("email","password")
  async login(req: Request, res: Response) {
    const {email,password}=req.body

    const isUser=await User.findOne({email}).populate("contacts")

    if(!User) return res.status(201).json(packet("No User with this Email ID"))

    try {
      
      const token=jwt.sign({email,password,_id:isUser._id},process.env.SECURE_KEY)
  
      res.status(201).json(packet("User LoggedIn",{user:isUser,token}))
    } catch (error) {
      console.log({error})
      res.status(501).json(packet("Message"))
    }

  }

  @post("/create")
  @bodyValidator("email", "password", "name","username")
  async create(req: Request, res: Response) {
    const { email, password, name,username } = req.body;
    console.log(req.body)

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(401).json({ message: "User Exist with this email" });
    }

    const user = new User({ email, password, name,username });
    await user.save();

    res.status(201).json(packet("User Created Succesfully", {user}));
  }

  
  @patch("/:id")
  @use(UserAuth)
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const body = req.body;

    const isUserExist = await User.findById(id);

    if (!isUserExist) {
      return res.status(401).json({ message: "User Exist with this email" });
    }

    const updatedData = await User.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );
    updatedData?.encrypt();

    res.status(201).json(packet("User Updated Succesfully", updatedData));
  }

  @del("/:id")
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const isUserExist = await User.findById(id);

    if (!isUserExist) {
      return res.status(401).json({ message: "User Exist with this email" });
    }

    await isUserExist.delete();
    res.status(201).json(packet("Deleted"));
  }
}
