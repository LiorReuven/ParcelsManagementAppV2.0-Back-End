import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'
import { Server } from 'socket.io';
import helmet from 'helmet';


import parcelsRoutes from './routes/parcels.js'
import userRoutes from './routes/user.js'
import storagesRoutes from './routes/storages.js'
import companiesRoutes from './routes/companies.js'

const app = express();
app.use(cors());
dotenv.config();
app.use(helmet())


app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));



//Socket io Setup
const CLIENT_URL = process.env.CLIENT_URL

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // '*'   for all
    methods: ['get', 'post', 'patch', 'put', 'delete']
  }
})
console.log(CLIENT_URL)
//


app.use('/parcels', parcelsRoutes)
app.use('/user', userRoutes)
app.use('/storages', storagesRoutes)
app.use('/companies', companiesRoutes)






// Socket Functionality

// const connectionLimit = 2
 
io.on('connection', (socket => {
  console.log('socket connected', socket.id)

  // if (io.engine.clientsCount > connectionLimit) {
  //   socket.disconnect()
  //   console.log('client discconected, reached max users')
  //   return
  // }

  //parcels listeners
  socket.on('createParcel', (createdParcel) => {
    socket.broadcast.emit('createParcel', createdParcel)
  })
  socket.on('unstockParcel', (unstockedParcel) => {
    socket.broadcast.emit('unstockParcel', unstockedParcel)
  })
  socket.on('updateParcel', (updatedParcel) => {
    socket.broadcast.emit('updateParcel', updatedParcel)
  })
  socket.on('deleteParcel', (deletedParcel) => {
    socket.broadcast.emit('deleteParcel', deletedParcel)
  })

  //storages listeners 
  socket.on('createStorage', (updatedStorages) => {
    socket.broadcast.emit('createStorage', updatedStorages)
  })
  socket.on('updateStorage', (updatedStorages) => {
    socket.broadcast.emit('updateStorage', updatedStorages)
  })
  socket.on('deleteStorage', (updatedStorages) => {
    socket.broadcast.emit('deleteStorage', updatedStorages)
  })

   //companies listeners 
   socket.on('createCompany', (createdCompany) => {
    socket.broadcast.emit('createCompany', createdCompany)
  })
  socket.on('updateCompany', (updatedCompany) => {
    socket.broadcast.emit('updateCompany', updatedCompany)
  })
  socket.on('deleteCompany', (deletedCompany) => {
    socket.broadcast.emit('deleteCompany', deletedCompany)
  })






  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}))





const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//MongoDB

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {server.listen(PORT || 5000, () => {console.log(`MongoDB and Server connected on PORT: ${PORT}`)})})
.catch(error => {console.log(error)});

