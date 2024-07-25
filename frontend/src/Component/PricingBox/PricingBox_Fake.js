import React from "react";
// import Box from "./Box";
import { Container, Col, Row } from "react-bootstrap";

import './PricingBox.css'
const PricingBoxx = () => {
  return (
    <Container fluid style={{width:'100%', padding:'20px'}}>
      <h3 className="text-uppercase text-center">pricing plan</h3>
      <Row className="mt-5">
        <Col lg={3} md={6} sm={6} className="mt-2">
          <div className="card">
            <div className="card-body text-center mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '50' }} fill="#e83e8c" class="bi bi-box" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
              </svg>
              <h3 className="fw-bold text-upercase mt-3">Basic</h3>
              <h3 className="fw-bold text-upercase mt-3">7000/-</h3>
              <p className="mt-4">personal Loan</p>
              <p>10 profilee download</p>
              <a><button className="btn btn-primary mt-3 ">purchare</button></a>
            </div>
          </div>
        </Col>
        <Col lg={3} md={6} sm={6} className="mt-2">
          <div className="card">
            <div className="card-body text-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" style={{width:'50'}} fill="blue" class="bi bi-trophy" viewBox="0 0 16 16">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
              </svg>
              <h3 className=" fw-bold text-upercase mt-4 ">Silver</h3>
              <h3 className="fw-bold text-upercase mt-3">12000/-</h3>

              <p > Personal Loan</p>
              <p>Home loan</p>
              <p>Mortage loan</p>
              <p>Unlimited download</p>
              <p>Cibile score  Download available</p>
              <p>Promote bussiness by email (100)</p>
              <a><button className="btn btn-primary mt-2">purchare</button></a>

            </div>

          </div>
        </Col>

        <Col lg={3} md={6} sm={6} className="mt-2">
          <div className="card">
            <div className="card-body text-center mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" style={{width: '50'}} fill="green" class="bi bi-trophy" viewBox="0 0 16 16">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
              </svg>
              <h3 className=" fw-bold text-upercase mt-4">Gold</h3>
              <h3 className="fw-bold text-upercase mt-3">15000/-</h3>
              <p className="mt-4">All Type Of Loan</p>
              <p>unlimited  Download</p>
              <p>cibile score  Download</p>
              <p>promote bussiness by email</p>
              <p>promote bussiness by whatsup</p>
              <a><button className="btn btn-primary mt-2">purchare</button></a>

            </div>

          </div>

        </Col>
        <Col lg={3} md={6} sm={6} className="mt-2">
          <div className="card">
            <div className="card-body text-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" style={{width:'50'}} fill="red" class="bi bi-trophy" viewBox="0 0 16 16">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
              </svg>
              <h3 className=" fw-bold text-upercase mt-4 ">Platinum</h3>
              <h3 className="fw-bold text-upercase mt-3">22500/-</h3>
              <p className="mt-3"> All type of Loan</p>
              <p >Unlimited download</p>
              <p>Cibile score  Download </p>
              <p>Whatsup by email</p>
              <p>Five star ratin  given</p>
              {/* <p>Cutomer more thyen 5laks files visible</p> */}
              <a><button className="btn btn-primary mt-2">purchare</button></a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default PricingBoxx;
