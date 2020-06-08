import Server from './server/server';
import routerUser from './routes/user';
import routerPersonage from './routes/personage';
import routerStory from './routes/story';
import routerStoryPersonage from './routes/story_personage';
import routerUserAuth from './routes/user_auth';

import MySQL from './mysql/mysql';
import bodyParser = require('body-parser');

import { port } from './config/config';

const server = Server.init( port );
server.app.use(bodyParser.urlencoded({ extended: false }));
server.app.use(bodyParser.json());

server.app.use(routerUserAuth);
server.app.use(routerUser);
server.app.use(routerPersonage);
server.app.use(routerStory);
server.app.use(routerStoryPersonage);

MySQL.instance;

server.start( () => {
    console.log(`Servidor corrieldo en el puerto ${port}`);
} );