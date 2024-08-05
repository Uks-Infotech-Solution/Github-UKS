import React, { useState, useEffect } from "react";
import { Mission } from "./components/mission";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Header } from "./components/header";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import { Ourteam } from "./components/ourteam";
import Navigation from "./components/navigation";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Homeapp = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (     
    <div>
      <Navigation/>
      <Header data={landingPageData.Header} />
      <div style={{borderBottom:'0.5px solid', borderColor:'#2492eb', margin:'15px'}}></div>
      
      <About data={landingPageData.About} />
      <div style={{borderBottom:'0.5px solid', borderColor:'#2492eb', margin:'15px'}}></div>
      
      <Mission data={landingPageData.Mission} />
      <div style={{borderBottom:'0.5px solid', borderColor:'#2492eb', margin:'15px'}}></div>

      <Services data={landingPageData.Services} />
      
      <Ourteam/>
      {/* <Testimonials data={landingPageData.Testimonials} /> */}
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default Homeapp;
