import "reflect-metadata";
import express, { Application ,Request,Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { Router } from "./Router";
import "./controller/User";
import "./controller/Chat";
import "./controller/Conversation";
import http, { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { Packet } from "./library/Packet";

declare var process: {
  env: {
    PORT: number;
    SECURE_KEY: string;
    MONGO_URI: string;
  };
};

interface Users {
  userId: string;
  socketId: string;
}

export class Server {
  private PORT: number;
  private app: Application;
  private MONGO_URI: string;
  private HTTP: http.Server;
  private IO: SocketServer;
  private users: Users[] = [];

  constructor() {
    this.PORT = process.env.PORT;
    this.app = express();
    this.MONGO_URI = process.env.MONGO_URI;
    this.HTTP = createServer(this.app);
    this.IO = new SocketServer(this.HTTP, {
      cors: { origin: "http://localhost:3000" },
    });
  }

  init(): void {
    this.middleware();
    this.database();
    this.io();
  }

  middleware(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(Router.getInstance());
    this.app.get("/",(req:Request,res:Response)=>{
      res.status(201).json(Packet("Welcome to the server"))
    })
  }

  database(): void {
    mongoose.connect(this.MONGO_URI).then(() => {
      this.HTTP.listen(this.PORT, () => {
        console.log(`Server Running on http://localhost:${this.PORT}`);
      });
    });
  }

  addUser(userId: string, socketId: string): void {
    const isUserExist = this.users.filter(
      (obj: Users) => obj.userId === userId
    );

    if (isUserExist.length !== 0) {
      this.users.map((obj: Users) =>
        obj.userId === userId ? { ...obj, socketId } : obj
      );
    } else {
      this.users.push({ userId, socketId });
    }
    this.users = this.users.filter((obj) => obj.userId !== null);
  }

  removeUser(socketId: string): void {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  getUser(userId: string): Users {
    return this.users.find((user) => user.userId === userId);
  }

  io(): void {
    this.IO.on("connection", (socket) => {
      /**@ON_CONNECTION */

      socket.on("addUser", (userId) => {
        this.addUser(userId, socket.id);
        this.IO.emit("getUsers", this.users);
      });

      socket.on(
        "sendMessage",
        ({
          sender,
          receiver,
          message,
        }: {
          sender: string;
          receiver: string;
          message: string;
        }) => {
          const user = this.getUser(receiver);

          if (!user) return;

          this.IO.to(user.socketId).emit("getMessage", {
            sender,
            message,
          });
        }
      );

      /**@ON_DISCONNECTION */

      socket.on("disconnect", () => {
        this.removeUser(socket.id);
        this.IO.emit("getUsers", this.users);
      });
    });
  }
}
