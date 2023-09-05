import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import {Server} from 'socket.io';

import viewsRoute from './routes/views.js';


const app = express();
const port=8080;

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRoute);


const httpServer = app.listen(port, () => {
    console.log('Server ON')
})

const io = new Server(httpServer);

let messages = []; ///Array para almacenar los mensajes.

io.on('connection', socket => {
    console.log("Nuevo cliente conectado.");

    socket.on('message', data => {
        ///Al array se le pushea el objeto que pasamos en index.js.
        messages.push(data);
        ///Emito a todos los sockets, el logs de mensajes con el array.
        io.emit('messageLogs', messages);
    })

    //Cuando el usuario se loguea y es avisado.
    //Es un canal diferente al messsage.
    socket.on('authenticated', data=> {
        //envia mensaje a todos los conectados excepto a el.
        //data sera el usuario conectado.
        socket.broadcast.emit('newUserConnected', data);
    })
})