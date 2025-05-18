import os
import cv2
import threading
from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app) 

model_path = os.path.join("modelo", "best.pt")
model = YOLO(model_path)

violacoes_atuais = []
lock = threading.Lock()

def gen_frames():
    global violacoes_atuais

    # url_camera = "rtsp://usuario:senha@ip_da_camera:porta/stream"
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    while True:
        for _ in range(1):
            cap.grab()
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 360))
        results = model(frame)[0]

        annotated_frame = frame.copy()
        novas_violacoes = []

        for det in results.boxes.data.tolist():
            x1, y1, x2, y2, score, class_id = det

            if score < 0.2:
                continue

            label = results.names[int(class_id)]
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
            
            if label not in ["head", "hands", "face", "ear"]:
                continue

            label_customizado = {
                "hands": "SEM LUVAS",
                "head": "SEM CAPACETE",
                "face": "SEM MÁSCARA",
                "ear": "SEM PROTETOR AURICULAR",
            }

            nome_exibido = label_customizado.get(label, label)
            if label in ["hands", "head", "face", "ear"]:
                novas_violacoes.append(nome_exibido)

            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(annotated_frame, nome_exibido, (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)

        with lock:
            violacoes_atuais = novas_violacoes

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/violacoes')
def get_violacoes():
    with lock:
        return jsonify({"violacoes": violacoes_atuais})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
