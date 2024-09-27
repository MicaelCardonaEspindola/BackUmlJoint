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
            socket.join(room);
            console.log(`Usuario ${ci} unido a la sala ${room}`);

            // Mostrar los usuarios conectados a la sala
            const usuariosEnSala = this.obtenerUsuariosEnSala(room);
            console.log(`Usuarios en la sala ${room}:`, usuariosEnSala);

            // Enviar la lista de usuarios conectados a todos los miembros de la sala
            this.io.to(room).emit('usuarios-conectados', usuariosEnSala);
        });

        // Escuchar eventos de 'diagram-update' y hacer broadcast a la sala
        socket.on('diagram-update', (data, room) => {
            socket.to(room).emit('diagram-update', data);
        });

        // Escuchar evento para dejar la sala
        socket.on('leave-room', (room) => {
            socket.leave(room);
            console.log(`Usuario ${ci} dejó la sala ${room}`);

            // Actualizar la lista de usuarios conectados
            const usuariosEnSala = this.obtenerUsuariosEnSala(room);
            this.io.to(room).emit('usuarios-conectados', usuariosEnSala);
        });

        // Desconectar usuario
        socket.on('disconnect', () => {
            console.log(`Usuario ${ci} desconectado`);

            // Actualizar la lista de usuarios conectados al desconectarse
            const rooms = Array.from(socket.rooms); // Salas a las que estaba unido
            rooms.forEach((room) => {
                const usuariosEnSala = this.obtenerUsuariosEnSala(room);
                this.io.to(room).emit('usuarios-conectados', usuariosEnSala);
            });
        });
    });
  }

  // Método para obtener los usuarios conectados a una sala
  obtenerUsuariosEnSala(room) {
    const usuarios = [];
    const roomSockets = this.io.sockets.adapter.rooms.get(room);

    if (roomSockets) {
      roomSockets.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          // Obtener el ID del cliente (ci) desde el socket
          const [valido, ci] = validateJsonWebToken(socket.handshake.query['x-token']);
          if (valido) {
            usuarios.push(ci); // Añadir el ci del usuario a la lista
          }
        }
      });
    }
    
    return usuarios;
  }
}
