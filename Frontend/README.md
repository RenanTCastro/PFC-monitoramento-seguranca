# Frontend - Dashboard de Monitoramento

Este módulo é o frontend do sistema de monitoramento, construído com **React**. Ele exibe em tempo real os dados recebidos do backend de sensores (temperatura, gás, umidade, ruído) e as violações e vídeo com detecção de EPIs da visão computacional.

## 🚀 Tecnologias

- React
- Vite
- Axios
- WebSocket


## ⚙️ Pré-requisitos

- Node.js 16 ou superior
- Backend rodando em `http://localhost:3001`
- Visão computacional rodando em `http://localhost:5000`

## ▶️ Como executar

### 1. Instale as dependências e inicie o projeto

```bash
npm install
npm run dev
```
## 📡 Funcionalidades
- Exibe os valores e alerta dos sensores: gás tóxico, som, temperatura, umidade
- Exibe violações de EPI detectadas visualmente
- Incorpora o vídeo ao vivo com anotações via YOLOv8
