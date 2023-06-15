import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerDocs from "./docs/swagger"
import { ServicioPersonaje } from './definicionJuego/application/servicioPersonaje';
import { ServicioUsuario } from './definicionJuego/application/servicioUsuario';
import { ServicioLogger} from "./definicionJuego/application/servicioLogger.js";
import { ServicioSnapshot } from "./definicionJuego/application/servicioSnapshot";
import { ServicioPartida } from './definicionJuego/application/servicioPartida';
import { ServicioTienda } from './definicionJuego/application/servicioTienda';
import { RepositoryLoggerImplFicheros } from "./definicionJuego/infraestructura/RepositoryLogger.js";
import { RepositorySnapshotImplFicheros } from './definicionJuego/infraestructura/RepositorySnapshot';
import { ControllerLogger } from "./definicionJuego/infraestructura/ControllerLogger.js";
import { ControllerSnapshot } from './definicionJuego/infraestructura/ControllerSnapshot';
import { ControllerUsuario } from "./definicionJuego/infraestructura/ControllerUsuario";
import { ControllerPersonaje } from "./definicionJuego/infraestructura/ControllerPersonaje.js";
import { ControllerPartida } from './definicionJuego/infraestructura/ControllerPartida';
import { ControllerTienda } from "./definicionJuego/infraestructura/ControllerTienda";
import { ServicioLog } from "./commons/report/ServicioLog.js"
import { debug } from 'console';
import { ErrorCircuitBreaker } from './commons/ErrorCircuitBreaker';
import { DependencyContainer } from './commons/dependecy-container/DependencyContainer';
import { Configurator } from './commons/configurator/Configurator';
import { Configuration } from './commons/configurator/configuration/Configuration';

const app = express();
let server: any //TODO: Corregir any.
//Implementar variable susceptible a cambio por comando
let tiempo: number = 10000;

const http = require('http')
const serverSocket = http.createServer(app)

const puertoSocket: number = 3001;
const { Server } = require('socket.io')
const io = new Server(serverSocket, { pingInterval: 2000, pingTimeout: 5000 })

const RpsGame = require('./rps-game');

async function onInit() {
  await Configurator.cargarConfiguracion();
  serve();
}

function serve() {
  const dependecyContainer = DependencyContainer.getInstance();
  //Partida
  const repoPartidaQuery = dependecyContainer.getPartidaRepoQuery()
  const repoPartidaCommand = dependecyContainer.getPartidaRepoCommand() 
  const servicioPartida = ServicioPartida.initialize(repoPartidaQuery,repoPartidaCommand);
  //Personaje
  const repoPersonajeQuery = dependecyContainer.getPersonajeRepoQuery()
  const repoPersonajeCommand = dependecyContainer.getPersonajeRepoCommand() 
  const servicioPersonaje = ServicioPersonaje.initialize(repoPersonajeQuery,repoPersonajeCommand);
  //Tienda
  const repoTiendaQuery = dependecyContainer.getTiendaRepoQuery()
  const repoTiendaCommand = dependecyContainer.getTiendaRepoCommand();
  const servicioTienda = ServicioTienda.initialize(repoTiendaQuery,repoTiendaCommand);
 
  //Usuario
  const repoUsuarioQuery = dependecyContainer.getUsuarioRepoQuery()
  const repoUsuarioCommand = dependecyContainer.getUsuarioRepoCommand();
  const servicioUsuario = ServicioUsuario.initialize(repoUsuarioQuery,repoUsuarioCommand);


  //Log
  const repoLogger = new RepositoryLoggerImplFicheros();
  const servicioLogger = ServicioLogger.initialize(repoLogger);

  const puerto = Configuration.getInstance().getPuerto()
  //Snapshot
  const repoSnapshot = new RepositorySnapshotImplFicheros();
  const servicioSnapshot = ServicioSnapshot.initialize(repoSnapshot);

//IntepretaciónApi
// const servicioInterpretacionApi = ServicioInterpretacionApi.initialize(repoOperaApiCommand)
//Controllers
const controllerPersonaje = new ControllerPersonaje(servicioPersonaje);
const controllerPartida = new ControllerPartida(servicioPartida);
const controllerTienda = new ControllerTienda(servicioTienda);
const controllerUsuario = new ControllerUsuario(servicioUsuario);
const controllerSnapshot = new ControllerSnapshot(servicioSnapshot);
const controllerLogger = new ControllerLogger(servicioLogger);

const limiteRequestBody = Configuration.getInstance().getLimiteRequestBody()+"mb"
  // Middlewares
  app.use(cors());
//   app.use('/assets', [
//     express.static(dirname + '/node_modules/jquery/dist/'),
//     express.static(dirname + '/node_modules/materialize-css/dist/'),
//     ...
// ]);

  app.use(bodyParser.json({ limit: limiteRequestBody }));
  app.use(bodyParser.urlencoded({ extended: true, limit: limiteRequestBody }));

  // Start the server
  server = app.listen(puerto, async () => {
    ServicioLog.getInstance().info("Escuchando por el puerto " + puerto);
    swaggerDocs(app, puerto)
  });

  // Se cargan los modulos necesarios.
  var path = require('path');


  // obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
  var publicPath = path.resolve(__dirname, 'assets'); //path.join(__dirname, 'public'); también puede ser una opción
  
  // Para que los archivos estaticos queden disponibles.
  app.use(express.static(publicPath));

// Controllers
app.use('/personaje',controllerPersonaje.getRouter());
app.use('/partida', controllerPartida.getRouter());
app.use('/tienda', controllerTienda.getRouter());
app.use('/usuario', controllerUsuario.getRouter());
app.use('/logger',controllerLogger.getRouter());
app.use('/snapshot', controllerSnapshot.getRouter());
app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendFile(__dirname + '/assets/index.html')
})
// app.use(express.static('public'))

app.get('/juego', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendFile(__dirname + '/assets/juengoonline.html')
})

// add this
app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});
///

serverSocket.listen(puertoSocket, () => {
  console.log(`Example app listening on port ${puertoSocket}`)
})

const backEndPlayers:any = {}

const SPEED = 10

let waitingPlayer:any = null;

  /**
   * Error Handler
   * 
   * En Express es necesario que ocupe la última posición de los handlers para asegurar el uso de la función next
   * */
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ErrorCircuitBreaker) {
      ServicioLog.getInstance().info("Se ha inciado el proceso de cierre de la aplicación codErr:" + err.getCodigoError + " con el mensaje: " + err.getMsgError)
      onExit()
    }
    res.status(500).send('Something broke! ' + err.message);
  });


  io.on('connection', (socket: { id: string | number; on: (arg0: string, arg1: { (reason: any): void; ({ keycode, sequenceNumber }: { keycode: any; sequenceNumber: any; }): void; (player: any): void; (data: any): void; (text: any): void; (result: any): void; (newBackground: any): void; (divId: any): void; }) => void; broadcast: { emit: (arg0: string, arg1: any) => void; }; }) => {

    if (waitingPlayer) {
      new RpsGame(waitingPlayer, socket);
      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
    }
  
    console.log('a user connected');
    backEndPlayers[socket.id] = {
      x: 500 * Math.random(),
      y: 500 * Math.random(),
      sequenceNumber: 0
    }
  
    io.emit('updatePlayers', backEndPlayers)
  
    socket.on('disconnect', (reason) => {
      console.log(reason)
      delete backEndPlayers[socket.id]
      io.emit('updatePlayers', backEndPlayers)
    });
  
    socket.on('keydown', ({ keycode, sequenceNumber }) => {
      backEndPlayers[socket.id].sequenceNumber = sequenceNumber
      switch (keycode) {
        case 'KeyW':
          backEndPlayers[socket.id].y -= SPEED
          break
  
        case 'KeyA':
          backEndPlayers[socket.id].x -= SPEED
          break
  
        case 'KeyS':
          backEndPlayers[socket.id].y += SPEED
          break
  
        case 'KeyD':
          backEndPlayers[socket.id].x += SPEED
          break
      }
    })
  
    socket.on('eliminateLastImage', (player)=>{
      io.emit('eliminateLastImage', player);
    });
  
    // Escuchar evento de arrastre de un div
    socket.on('dragDiv', (data) => {
      // Emitir el evento a todos los demás clientes conectados
      socket.broadcast.emit('dragDiv', data);
    });
  
    socket.on('message', (text) => {
      io.emit('message', text);
    });
  
    socket.on('diceResult', (result) => {
      io.emit('showResultToAll', result);
    });
  
    socket.on('changeBackground', (newBackground) => {
      io.emit('backgroundChange', newBackground);
    });
  
    socket.on('eliminateDiv', (divId) =>{
      io.emit('eliminateDiv', divId);
    })
  
  })
  
  setInterval(() => {
    io.emit('updatePlayers', backEndPlayers)
  }, 15)
  
  
}

function onExit() {
DependencyContainer.getInstance().Close();
server.close(() => {
  // Ejemplo para cerrar una dependencia que necesite un cierre
  // mongoose.connection.close(false, () => {
  //   console.log('MongoDb connection closed.');
  //   process.exit(0);
  // });
  debug('Servidor cerrado')
  process.exit(0)
})
setTimeout(() => {
  debug('Servidor cerrado por tiempo')
  process.exit(0)
}, tiempo).unref()
}

/**
* Para conseguir Gracefully shutdown de la applicación en local
*/
process.on('SIGINT', () => {
debug('Señal recibida: cerrando servidor')
ServicioLog.getInstance().info("Se ha inciado el proceso de cierre de la aplicación ejecutado en local")
onExit()
})

/**
* Para conseguir Gracefully shutdown de la applicación desde fuera
*/
process.on('SIGTERM', () => {
debug('Señal recibida: cerrando servidor')
ServicioLog.getInstance().info("Ejecución de Gracefull shutdown para la aplicación ejecutado en remoto");
onExit()
})

onInit();


