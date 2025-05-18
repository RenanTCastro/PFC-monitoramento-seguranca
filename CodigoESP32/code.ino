#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Pinos dos sensores
#define DHTPIN 26
#define DHTTYPE DHT22
#define SOUND_SENSOR_PIN 33
#define GAS_SENSOR_PIN 32

DHT dht(DHTPIN, DHTTYPE);

// Rede e senha do Wi-Fi
const char* ssid ="SSID";
const char* password = "PASS";

// Endereço do broker MQTT
const char* mqtt_server = "MQTT_SERVER";

WiFiClient espClient;
PubSubClient client(espClient);

// Conecta ao Wi-Fi
void connectToWiFi() {
  Serial.print("Conectando ao Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado! IP: ");
  Serial.println(WiFi.localIP());
}

// Conecta ao broker MQTT
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Tentando conectar ao MQTT...");
    if (client.connect("ESP32SensorClient")) {
      Serial.println("Conectado ao MQTT!");
    } else {
      Serial.print("Erro: ");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  dht.begin();
  pinMode(SOUND_SENSOR_PIN, INPUT);
  pinMode(GAS_SENSOR_PIN, INPUT);
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Leitura dos sensores
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int gasValue = digitalRead(GAS_SENSOR_PIN);
  int soundValue = digitalRead(SOUND_SENSOR_PIN);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Falha ao ler o DHT22");
    return;
  }

  String payload = "{";
  payload += "\"temperature\":" + String(temperature) + ",";
  payload += "\"humidity\":" + String(humidity) + ",";
  payload += "\"gasToxic\":" + String(gasValue) + ",";
  payload += "\"sound\":" + String(soundValue);
  payload += "}";

  // Publica no tópico desejado
  client.publish("esp32/sensores", payload.c_str());

  Serial.println("Publicado no MQTT: " + payload);
 
  // Le e publica os dados a caada 2 segundos
  delay(2000);
}
