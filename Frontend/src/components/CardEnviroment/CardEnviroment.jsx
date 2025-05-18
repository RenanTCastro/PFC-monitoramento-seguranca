import React from "react";

import "./style.css"

const CardEnviroment = ({ icon, title, value, unit, className })=>{
    return(
        <div className={`card-enviroment--container ${className}`}>
            <p className="card-enviroment--text-title">{title}</p>
            <div className="card-enviroment--info-container">
                {icon}
                <p>{value}</p>
            </div>
            <p className="card-enviroment--unit-text">{unit}</p>
        </div>
    )
}

export default CardEnviroment;
