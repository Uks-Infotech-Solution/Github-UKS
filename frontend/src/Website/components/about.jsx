import React from "react";

export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src="img/about-2.jpeg" className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2 style={{color:"#145693"}}>About Us</h2>
              <p style={{color:'#777'}}>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3 style={{color:"#145693"}}>Our Story</h3>
              <div className="about-text">
                <p style={{color:'#777'}}>
                Our journey began with a vision to transform the IT landscape. Sriram Krishnaraj started UKS Infotech Solution with a passion for technology and a commitment to delivering exceptional service. Over the years, we have grown into a team of dedicated professionals who are experts in their fields
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{borderBottom:'1px solid'}}></div> */}
    </div>
  );
};
