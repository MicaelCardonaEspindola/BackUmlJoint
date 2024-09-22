
export class Sockets {

  constructor(io) {
    this.io = io;

    this.socketEvents();
    
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      // Cuando el cliente envía un evento 'diagram-update'
      socket.on('diagram-update', (data) => {
        // Broadcast a todos los clientes menos el que envió el evento
        socket.broadcast.emit('diagram-update', data);
      });

    });
  }
}