import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { MdPeople } from "react-icons/md";
import '../DashBoardDesign/Header_SectionThird.css';


function Header_SectionThird() {

   
  return (
    <Container fluid>
         <Row className='h-section-3 mx-auto'>
                 <Col>
                        <div  className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>30,000</h1>
                                {/* <h1>{formData}</h1> */}

                                <p> New Customer   </p>
                            </div>
                        </div>

                </Col>

                <Col>
                        <div  className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>14,000</h1>

                                <p> New Members   </p>
                            </div>
                        </div>

                </Col>

                <Col>
                        <div  className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>70,000</h1>

                                <p> Active Customer   </p>
                            </div>
                        </div>

                </Col>

                <Col>
                        <div  className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>100</h1>

                                <p> Inactive Customer   </p>
                            </div>
                        </div>

                </Col>
                <Col>
                        <div  className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>100</h1>

                                <p> Inactive Customer   </p>
                            </div>
                        </div>

                </Col>
                <Col>
                        <div className='h-cardthird'>
                            <div className='h-peoplethird'>
                                <MdPeople className='MdPeoplethird' />
                            </div>
                            <div className='h-amountthird'>
                                <h1>100</h1>

                                <p> Inactive Customer   </p>
                            </div>
                        </div>

                </Col>
            
            </Row>
    </Container>
  )
}

export default Header_SectionThird
