import { validateJsonWebToken } from "../helpers/validateJsonWebToken.js";

export class Sockets {

  constructor(io) {
    this.io = io;

    this.socketEvents();
    
  }

  socketEvents() {
    this.io.on('connection', (socket) => {

      const [valido,ci]= validateJsonWebToken(socket.handshake.query['x-token']);

      if (!valido){
        console.log('No Autenticado: ');
        return socket.disconnect();
      }
      console.log('A user connected  ' + ci);


      // Cuando el cliente envía un evento 'diagram-update'
      socket.on('diagram-update', (data) => {
        // Broadcast a todos los clientes menos el que envió el evento
        socket.broadcast.emit('diagram-update', data);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });

    });
  }
}