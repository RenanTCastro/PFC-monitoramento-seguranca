import React, { useEffect, useState } from "react";
import CardEnviroment from "../CardEnviroment/CardEnviroment";
import { MdOutlineThermostat, MdOutlineWaterDrop, MdOutlineVolumeUp, MdOutlineMasks } from "react-icons/md";
import "./style.css";

const EnvironmentTracker = () => {
  const [alert, setAlert] = useState({})
  const [sensorData, setSensorData] = useState({});

  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://localhost:3001/sensorData");
      const data = await response.json();
      setSensorData({
        temperature: data.temperature,
        humidity: data.humidity,
        sound: data.sound === 1 ? "Ruído elevado" : "Ruído controlado",
        gasDetected: data.gasToxic === 0 ? "Gás Detectado" : "Sem Gás",
      });
      setAlert(data.alert);
      console.log(data, alert)
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000); 
    return () => clearInterval(interval);
  }, []);

  const cardsInfo = [  
    {
      icon: <MdOutlineThermostat className="enviroment-tracker--icon" />,
      title: "Sensor de temperatura",
      value: sensorData.temperature,
      unit: "Graus Celcius",
      className: alert?.temperature ? "card-alert" : "",
    },
    {
      icon: <MdOutlineWaterDrop className="enviroment-tracker--icon" />,
      title: "Sensor de umidade",
      value: sensorData.humidity,
      unit: "Porcentagem",
      className: alert?.humidity ? "card-alert" : "",
    },
    {
      icon: <MdOutlineVolumeUp className="enviroment-tracker--icon" />,
      title: "Sensor de ruído",
      value: sensorData.sound,
      unit: "",
      className: alert?.sound ? "card-alert" : "",
    },
    {
      icon: <MdOutlineMasks className="enviroment-tracker--icon" />,
      title: "Gás detectado",
      value: sensorData.gasDetected,
      unit: "",
      className: alert?.gasToxic ? "card-alert" : "",
    },
  ];

  return (
    <div className="enviroment-tracker--container">
      <h3>Condições ambientais</h3>
      <div className="enviroment-tracker--cards-container">
        {cardsInfo.map((info, index) => (
          <CardEnviroment {...info} key={index} />
        ))}
      </div>
    </div>
  );
};

export default EnvironmentTracker;
