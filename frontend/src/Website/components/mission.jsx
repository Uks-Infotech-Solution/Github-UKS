import React from "react";

export const Mission = (props) => {
  return (
    <div id="mission" className="text-center">
      <div className="container">
        <div className="  ">
          <h2 style={{color:"#145693",fontWeight:'700'}}>Our Mission</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="  mission-item" style={{textAlign:'left'}}>
                  <p style={{textAlign:'left', fontSize:'15px',color:'#777'}}>{d.text}</p>
                  <h3 style={{fontWeight:'600',color:'#145693'}}>{d.title}</h3>
                  <p style={{textAlign:'left', fontSize:'15px',color:'#777'}}>{d.para}</p>

                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>

  );
};
