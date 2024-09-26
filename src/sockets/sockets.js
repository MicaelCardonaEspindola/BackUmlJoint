import { obtenerLosUsuariosDeUnaSalaModelByCi } from "../components/sala/sala.models.js";
import { validateJsonWebToken } from "../helpers/validateJsonWebToken.js";

export class Sockets {

  constructor(io) { 
    this.io = io;
    this.socketEvents();
  } 

  socketEvents() {
    this.io.on('connection', async (socket) =>  {
        // Validar JWT y obtener el ID del cliente (ci)
        const [valido, ci] = validateJsonWebToken(socket.handshake.query['x-token']);

        if (!valido) {
            console.log('No Autenticado');
            return socket.disconnect();
        }

        console.log(`Usuario conectado: ${ci}`);

        // Obtener el ID de la sala desde los parámetros de la conexión
        socket.on('join-room', async (room) => {
         // const room = await obtenerLosUsuariosDeUnaSalaModelByCi(ci);
            socket.join(room);
            console.log(`Usuario ${ci} unido a la sala ${room}`);
        });
        // Escuchar eventos de 'diagram-update' y hacer broadcast a la sala
        socket.on('diagram-update', (data,room) => {
            socket.to(room).emit('diagram-update', data);
        });

        // Escuchar evento para dejar la sala
        socket.on('leave-room', (room) => {
            socket.leave(room);
            console.log(`Usuario ${ci} dejó la sala ${room.id_sala}`);
        });

        // Desconectar usuario
        socket.on('disconnect', () => {
            console.log(`Usuario ${ci} desconectado`);
        });
    });
  }
}
