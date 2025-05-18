import React, { useEffect, useState } from 'react';
import { FaHelmetSafety, FaMaskFace } from "react-icons/fa6";
import { IoEar } from "react-icons/io5";
import { HiHandRaised } from "react-icons/hi2";
import "./style.css";

const epiConfig = [
  {
    label: "CAPACETE",
    key: "SEM CAPACETE",
    icon: FaHelmetSafety
  },
  {
    label: "PROTETOR AURICULAR",
    key: "SEM PROTETOR AURICULAR",
    icon: IoEar
  },
  {
    label: "MÁSCARA",
    key: "SEM MÁSCARA",
    icon: FaMaskFace
  },
  {
    label: "LUVAS",
    key: "SEM LUVAS",
    icon: HiHandRaised
  }
];

const Violations = () => {
  const [violacoes, setViolacoes] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/violacoes");
        const data = await res.json();
        setViolacoes(data.violacoes || []);
      } catch (error) {
        console.error("Erro ao buscar violações:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderEpiStatus = ({ key, label, icon: Icon }) => {
    const hasViolation = violacoes.includes(key);
    return (
      <div className='violations--ppe-violation' key={label}>
        <Icon className={hasViolation ? "violations--icons-alert" : "violations--icons"} />
        {hasViolation ? (
          <strong>{label} não está sendo utilizado corretamente.</strong>
        ) : (
          `${label} está sendo utilizado corretamente.`
        )}
      </div>
    );
  };
  

  return (
    <div className="violations--container">
      <h3>Monitoramento de EPIs</h3>
      <div className='violations--info-container'>
        <div className='violations--info-text-container'>
          {epiConfig.map(renderEpiStatus)}
        </div>
        <img
          src="http://localhost:5000/video_feed"
          alt="Vídeo ao vivo"
          className='violations--video'
        />
      </div>
    </div>
  );
}

export default Violations;
