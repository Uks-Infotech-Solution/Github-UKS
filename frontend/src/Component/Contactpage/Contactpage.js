import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Contactpage.css'
function Contactpage() {
    return (



        <Container fluid className='mt-5'>
            <Row className='allcard'>
                <Col>
                    <div className='card1' >

                    </div>

                </Col>
                <Col>
                    <div className='card2' >

                    </div>

                </Col>
                <Col>
                    <div className='card3' >

                    </div>

                </Col>
                <Col>
                    <div className='card4' >

                    </div>

                </Col>
            </Row>
            <Row>
                <div>
                    <h2>Contact Us</h2>
                    <input placeholder='Enter Your Name' />
                    <input placeholder='Enter a Valid email address ' />
                    <input />
                    <button>Submit</button>
                </div>
            </Row>
        </Container>



    )
}

export default Contactpage