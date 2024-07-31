import React from "react";
import img from '../images/uks-bg.png'
export const Navigation = (props) => {
  return (
    <nav id="menu" className="sticky-top" style={{backgroundColor:'white'}}>
      <div className="container">
        <div className="">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"  
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            <span ><img src={img} alt='' style={{width:'30px'}}/>
            <span style={{color:"#145693"} }>UKS Infotech Solution</span>
              </span>
          </a>{" "}
        </div>

        <div
          className=""
          // id="bs-example-navbar-collapse-1"
        >
          <ul className=" d-flex justify-contant-end align-items-center mt-2 " style={{color:'#2492eb',paddingLeft:'10%'}}>
          <li>
              <a href="#header" className="page-scroll site-navi" style={{color:'#2492eb'}}>
               Home
              </a>
            </li>
          <li>
              <a href="#about" className="page-scroll site-navi" style={{color:'#2492eb'}}>
                About Us
              </a>
            </li>
            <li>
              <a href="#mission" className="page-scroll site-navi" style={{color:'#2492eb'}}>
                Our Mission
              </a>
            </li>
            
            <li>
              <a href="#services" className="page-scroll site-navi" style={{color:'#2492eb'}}>
                Services
              </a>
            </li>
            <li>
              <a href="#ourteam" className="page-scroll site-navi" style={{color:'#2492eb'}}>
              Our Team
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll site-navi" style={{color:'#2492eb'}}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
