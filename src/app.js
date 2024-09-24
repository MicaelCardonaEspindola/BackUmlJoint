import express from "express";
import cors from "cors"
import router from "./routes/routes.js";
import http from 'http';
import { Server as socketio } from 'socket.io'; // Socket.IO con import
import { Sockets } from './sockets/sockets.js'; // Importamos la clase Sockets

export class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.portSocket = process.env.PORT_SOCKET;
    this.server = http.createServer(this.app);
    this.routerMain = "/api-v1"; 
    //configuracion del socket

    this.io = new socketio(this.server, {
      cors: {
        origin: "http://localhost:3000", // La URL del cliente React
        methods: ["GET", "POST"]
      }
    });
  } 
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/api-v1", router);
  }

  configureSockets() {
    new Sockets(this.io);
  }

  execute() {
    this.middlewares();
    this.configureSockets();
    this.server.listen(this.portSocket, () => {
      console.log(`Socket.IO server is running on port ${this.portSocket}`);
    });

    // Escuchar en el puerto configurado para Express o 3001 por defecto
    this.app.listen(this.port || 3001, () => {
      let message = "Server is running on port " + (this.port || 3001);
      console.log(message);
    });
  }


}

