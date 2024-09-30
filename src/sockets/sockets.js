import { obtenerUsuariosById } from "../components/user/user.models.js";
import { validateJsonWebToken } from "../helpers/validateJsonWebToken.js";

export class Sockets {

  constructor(io) { 
    this.io = io;
    this.locks = {}; // Añadir un objeto para gestionar los bloqueos
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

        // Manejar eventos de 'join-room'
        socket.on('join-room', async (room) => {
            socket.join(room);
            console.log(`Usuario ${ci} unido a la sala ${room}`);

            // Mostrar los usuarios conectados a la sala
            const usuariosEnSala = await this.obtenerUsuariosEnSala(room);
            console.log(`Usuarios en la sala ${room}:`, usuariosEnSala);

            // Enviar la lista de usuarios conectados a todos los miembros de la sala
            this.io.to(room).emit('usuarios-conectados', usuariosEnSala);
        });

        // Manejar solicitudes de bloqueo
        socket.on('request-lock', (data) => {
            const { cellId, userId, room } = data;

            // Verificar si el nodo ya está bloqueado
            if (this.locks[cellId]) {
                // Si el nodo está bloqueado, denegar la solicitud
                socket.emit('lock-denied', { cellId });
            } else {
                // Si no está bloqueado, asignar el bloqueo al usuario
                this.locks[cellId] = userId;
                console.log(`Bloqueo otorgado para ${cellId} por el usuario ${userId}`);

                // Notificar a todos en la sala que el nodo ha sido bloqueado
                this.io.to(room).emit('lock-granted', { cellId, userId });
            }
        });

        // Manejar la liberación de bloqueos
        socket.on('release-lock', (data) => {
            const { cellId, userId, room } = data;

            // Verificar si el bloqueo pertenece al usuario
            if (this.locks[cellId] === userId) {
                // Eliminar el bloqueo
                delete this.locks[cellId];
                console.log(`Bloqueo liberado para ${cellId} por el usuario ${userId}`);

                // Notificar a todos en la sala que el nodo ha sido desbloqueado
                this.io.to(room).emit('lock-released', { cellId });
            }
        });

        // Escuchar eventos de 'diagram-update' y hacer broadcast a la sala
        socket.on('diagram-update', (data, room) => {
            socket.to(room).emit('diagram-update', data);
        });

        // Manejar el evento para dejar la sala
        socket.on('leave-room', async (room) => {
            socket.leave(room);
            console.log(`Usuario ${ci} dejó la sala ${room}`);

            // Actualizar la lista de usuarios conectados
            const usuariosEnSala = await this.obtenerUsuariosEnSala(room);
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
  async obtenerUsuariosEnSala(room) {
    const roomSockets = this.io.sockets.adapter.rooms.get(room);
    
    if (!roomSockets) {
      return [];
    }
  
    const socketPromises = Array.from(roomSockets).map(async (socketId) => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        const [valido, ci] = validateJsonWebToken(socket.handshake.query['x-token']);
        if (valido) {
          return obtenerUsuariosById(ci);
        }
      }
      return null;
    });
  
    const usuarios = await Promise.all(socketPromises);
    return usuarios.filter(usuario => usuario !== null);
  }
}
