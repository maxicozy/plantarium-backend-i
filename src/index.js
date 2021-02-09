import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import expressws from 'express-ws'
import Garden from './models/garden.js'
import Module from './models/module.js'
import SensorData from './models/sensorData.js'

dotenv.config();
mongoose.set('useCreateIndex', true);

const PORT = Number.parseInt(process.env.PORT) || 80;

const app = express();
expressws(app);

const { DB_PASSWORD, DB_USERNAME } = process.env;
const DEV = process.env.NODE_ENV !== 'production'

const mongoUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@plantarium.89hal.mongodb.net/plantarium?retryWrites=true&w=majority`;

async function start() {

  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: DEV })    
    .then(() => console.log('Erfolgreich an Datenbank angeschlossen!'))
    .catch(err => console.log(err));
  
  app.get('/', (_, res) => {
      res.status(200).send();
  });

  app.ws('/', async (socket, req) => {

    const devGarden = process.env.DEV_GARDEN === 'true' ? await Garden.findOne() : null
    const gardenId = devGarden?._id ?? Number.parseInt(req.headers.authorization ?? '')

      if(!gardenId) {
        // Create new empty garden
        console.log('Register new garden')
        const newGarden = await Garden.create({ name: 'Dev' })
        socket.send(JSON.stringify({ messageType: 'register', id: newGarden._id }))
      }

      else console.log(`Sockel von Garten ${gardenId} angeschlossen`)

      socket.on('message', async msg => {
        const { messageType, ...data } = JSON.parse(msg)

        if(messageType === 'sensorData') {
          
          const findBy = { garden: gardenId, position: data.position }
          const mod = await Module.findOne(findBy) ?? await Module.create({ 
            ...findBy,
            plant: data.plant,
          })

          SensorData.create({ ...data, module: mod })
          console.log(data);
        
        }
      });

      socket.on('close', (data) => {
        console.log(data); 
        console.log('Sockel geschlossen!') 
      });

  });

  app.listen(PORT, () => {
    console.log("Applikation hört zu auf Hafen " + PORT + "!");
  });

}

start();