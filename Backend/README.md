# Backend - Monitoramento de Condições Ambientais

Este módulo Node.js atua como servidor de backend para monitoramento em tempo real de condições ambientais (temperatura, umidade, gás tóxico e ruído), com envio de alertas via Telegram.

## 📦 Funcionalidades

- Recebe dados via **MQTT** de sensores conectados ao ESP32
- Avalia os valores e detecta situações críticas
- Envia alertas automáticos para o Telegram
- Expõe um endpoint HTTP com os dados atualizados

## ⚙️ Pré-requisitos

- Node.js instalado
- Um broker MQTT (ex: Mosquitto) em funcionamento
- ESP32 publicando no tópico `esp32/sensores`
- Bot Telegram criado e ativo

## ▶️ Como executar

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o `.env`

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
TELEGRAM_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui
MQTT_BROKER_URL=seu_mqtt_broker_url
```

### 3. Execute o servidor

```bash
node src/index.js
```

### 4. Endpoint disponível

GET http://localhost:3001/sensorData

Exemplo de resposta:

```json
{
  "temperature": 31.4,
  "humidity": 92,
  "sound": 1,
  "gasToxic": 0,
  "alert": {
    "gasToxic": true,
    "sound": true,
    "temperature": true,
    "humidity": true
  }
}
```

## 🚨 Alertas automáticos

- Enviados via Telegram quando os valores ultrapassam limites definidos
- Cada tipo de alerta tem um intervalo mínimo de 5 minutos entre disparos
