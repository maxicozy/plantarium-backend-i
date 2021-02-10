import dotenv from 'dotenv';
import express from 'express';
import expressws from 'express-ws';
import mongoose from 'mongoose';
import Garden from './models/garden.js';
import Module from './models/module.js';
import SensorData from './models/sensorData.js';

const config = dotenv.config(process.env.PLANTRARIUM_CONFIG).parsed;
mongoose.set('useCreateIndex', true);

const PORT = Number.parseInt(config.PORT) || 3030;

const app = express();
expressws(app);

const { DB_PASSWORD, DB_USERNAME } = config;
const DEV = process.env.NODE_ENV !== 'production'

const mongoUrl = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@plantarium.89hal.mongodb.net/plantarium?retryWrites=true&w=majority`;

async function start() {

  await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: DEV })    
    .then(() => console.log('Erfolgreich an Datenbank angeschlossen!'))
    .catch(err => console.log(err));

  app.ws('/socket', async (socket, req) => {

    //Aus Testzwecken und weil es noch keinen Setup prozess gibt kommen aktuell alle Daten in den Dev-Garden
    const devGarden = config.DEV_GARDEN === 'true' ? await Garden.findOne() : null
    const gardenId = devGarden?._id ?? Number.parseInt(req.headers.authorization ?? '')

      if(!gardenId) {
        // kreiere neuen leeren Garten, wenn er zum ersten mal Daten ans backend schickt
        console.log('Registriere neuen Garten')
        const newGarden = await Garden.create({ name: 'Dev' })
        socket.send(JSON.stringify({ messageType: 'register', id: newGarden._id }))
      }

      else console.log(`Sockel von Garten ${gardenId} angeschlossen`)

      socket.on('message', async msg => {
        const { messageType, ...data } = JSON.parse(msg)

        if(messageType === 'sensorData') {
          // Empfing Sensordaten
          
          // Modul finden oder sonst neues erstellen
          const findBy = { garden: gardenId, position: data.position }
          const mod = await Module.findOne(findBy) ?? await Module.create({ 
            ...findBy,
            plant: data.plant,
          })

          // Sensordaten einfaedeln
          SensorData.create({ ...data, time: new Date(data.time), module: mod })
          console.log(data);
        
        }
      });

      socket.on('close', (data) => {
        console.log(data); 
        console.log('Sockel geschlossen!') 
      });

  });

  // server starten
  app.listen(PORT, () => {
    console.log("Applikation hört zu auf Hafen " + PORT + "!");
  });

}

start();