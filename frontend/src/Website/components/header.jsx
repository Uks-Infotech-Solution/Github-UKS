import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">      
        <div className="">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1 >
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <h1></h1>
                <p >{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="/ldp/finserv"
                  className="btn-custom btn-lg page-scroll"
                >
                  LDP Finserv
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
