import React, { useState } from "react";
import "./style.css";

const CardViolation = ({ id, ultimo_estado, ultima_atualizacao, historico }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <>
      <div className="card-violation--container">
        <img
          alt="imagem da violação atual"
          src={historico[historico.length - 1]?.imagem}
          className="card-violation--image"
        />

        <div className="card-violation--text-container">
            <h4 className="card-violation--text-title"> ID: {id}</h4>
            <h4 className="card-violation--text-title">Violação encontrada</h4>
            <p className="card-violation--text-date-time">
                {formatDate(ultima_atualizacao)}
            </p>

            {ultimo_estado.map((text, index) => (
                <p key={index} className="card-violation--text-violations">
                {text}
                </p>
            ))}
            <button onClick={() => setShowModal(true)}>Ver histórico completo</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Histórico de Violações — ID {id}</h3>
            <button onClick={() => setShowModal(false)}>Fechar</button>

            <div className="modal-history-list">
              {historico.map((registro, idx) => (
                <div key={idx} className="modal-history-item">
                  <img
                    src={registro.imagem}
                    alt={`Violação ${idx}`}
                    className="modal-history-img"
                  />
                  <div>
                    <p><strong>Data:</strong> {formatDate(registro.timestamp)}</p>
                    <p><strong>Violações:</strong> {registro.violacoes.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardViolation;
