# Visão Computacional

Este módulo captura a imagem da câmera IP e utiliza YOLOv8 para detectar ausência de EPIs (capacete, máscara, luvas, protetor auricular) em tempo real.

## 📁 Estrutura
- `modelo/`: contém o modelo YOLOv8 treinado (`best.pt`)
- `main.py`: script principal com servidor Flask

## ▶️ Como executar

### 1. Instale as dependências

```bash
pip install -r requirements.txt
```

### 2. Configure o acesso à câmera

O sistema está usando por padrão a webcam local:

```python
cap = cv2.VideoCapture(0)
```
Se você quiser usar uma câmera IP, edite essa linha no main.py e substitua pela sua URL RTSP:

```python
cap = cv2.VideoCapture("rtsp://usuario:senha@ip_da_camera:porta/stream")
```

### 3. Execute o sistema
```bash
python main.py
```