const cors = require('cors');
const mqtt = require('mqtt');
const express = require('express');
const TelegramBot = require("node-telegram-bot-api");

require('dotenv').config();

const app = express();
app.use(cors());

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

let sensorData = {};

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

const minimumAlertTime = 5 * 60 * 1000; // 5 minutos
const lastAlert = {
  gasToxic: 0,
  sound: 0,
  temperature: 0,
  humidity: 0,
};
const alertActive = {
  gasToxic: false,
  sound: false,
  temperature: false,
  humidity: false,
};

function verificarAlertas(data) {
  const now = Date.now();
  
  // Gás Tóxico (0 = detectado, 1 = normal)
  if (!alertActive.gasToxic && data.gasToxic === 0) {
    if (now - lastAlert.gasToxic > minimumAlertTime) {
      alertActive.gasToxic = true;
      lastAlert.gasToxic = now;
      bot.sendMessage(chatId, "🚨 Gás tóxico detectado!");
    }
  } else if (alertActive.gasToxic && data.gasToxic === 0) {
    alertActive.gasToxic = false;
  }

  // Som (1 = som alto, 0 = normal)
  if (!alertActive.sound && data.sound === 1) {
    if (now - lastAlert.sound > minimumAlertTime) {
      alertActive.sound = true;
      lastAlert.sound = now;
      bot.sendMessage(chatId, "🚨 Nível de som elevado detectado!");
    }
  } else if (alertActive.sound && data.sound === 0) {
    alertActive.sound = false;
  }

  // Temperatura
  if (!alertActive.temperature && data.temperature > 30) {
    if (now - lastAlert.temperature > minimumAlertTime) {
      alertActive.temperature = true;
      lastAlert.temperature = now;
      bot.sendMessage(chatId, "🚨 Temperatura elevada!");
    }
  } else if (alertActive.temperature && data.temperature < 27) {
    alertActive.temperature = false;
  }

  // Umidade 
  if (!alertActive.humidity && data.humidity > 90) {
    if (now - lastAlert.humidity > minimumAlertTime) {
      alertActive.humidity = true;
      lastAlert.humidity = now;
      bot.sendMessage(chatId, "🚨 Umidade acima de 90%!");
    }
  } else if (alertActive.humidity && data.humidity < 85) {
    alertActive.humidity = false;
  }
}

// Quando conectar ao broker
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  client.subscribe('esp32/sensores');
});

// Quando receber mensagem no tópico
client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    verificarAlertas(data); 

    sensorData = {
      ...data,
      alert: {
        gasToxic: data.gasToxic === 0,
        sound: data.sound === 1,
        temperature: data.temperature >= 30,
        humidity: data.humidity >= 90
      }
    };

    console.log('Dados recebidos:', data);
  } catch (error) {
    console.error('Erro ao converter JSON:', error);
  }
});

// Rota que disponibiliza os dados dos sensores 
app.get('/sensorData', (req, res) => {
  res.json(sensorData);
});

// Inicia servidor na porta 3001
app.listen(3001, () => {
  console.log('Servidor HTTP rodando em http://localhost:3001');
});