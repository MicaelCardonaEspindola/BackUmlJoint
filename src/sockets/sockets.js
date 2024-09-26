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
        const room = await obtenerLosUsuariosDeUnaSalaModelByCi(ci);
        console.log(room)



        // Unir al usuario a la sala correspondiente
        socket.join(room.id_sala);
        console.log(`Usuario ${ci} unido a la sala ${room.id_sala}`);

        // Escuchar eventos de 'diagram-update' y hacer broadcast a la sala
        socket.on('diagram-update', (data) => {
            socket.to(room.id_sala).emit('diagram-update', data);
        });

        // Desconectar usuario
        socket.on('disconnect', () => {
            console.log(`Usuario ${ci} desconectado de la sala ${room.id_sala}`);
        });
    });
}
}