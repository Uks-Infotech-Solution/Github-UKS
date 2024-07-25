import { Button, Col, Container, Row } from "react-bootstrap";
import StickyNavbar from "../../Customer/Navbar/Navbar";
import { MdArrowForwardIos } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { useState } from "react";
import './Customer-profile.css'

function Customer_Profile() {
  const { isSidebarExpanded } = useSidebar();
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleToggleSidebar = (visible) => {
    setIsSidebarVisible(visible);
  };
    const navigate = useNavigate()
    const homepage = () => {
        navigate('/customer');

       
    };
    return (
        <>
            
      {/* <StickyNavbar onToggleSidebar={handleToggleSidebar} /> */}
            
            <Container fluid className={`Customer-profile-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
            <StickyNavbar />
                <div>
                    <div className='Customer-top-nav-div'>
                        <span className='Customer-top-navi-head'>Profile View</span> |
                        <MdHome size={25} className='Customer-top-nav-home' onClick={homepage} />
                        <MdArrowForwardIos className='Customer-top-nav-arrow' />
                        <span className='Cutomer-top-navi' ><a href='/customer/login' style={{ color: 'rgb(142, 143, 144)' }}>Profile </a></span>
                        <MdArrowForwardIos className='Customer-top-nav-arrow' />
                        <span className='Cutomer-top-navi'>Profile View</span>
                    </div>
                </div>

                <Container fluid className="">
                    <div className='Customer-table-container-second-head'>Customer Profile</div>
                    <Row className="Customer-profile-main-row">
                        <Col className="Customer-profile-view-col" sm={10} lg={3}>
                            <Row className="Customer-profile-name-row">
                                <Col className="Customer-profile-name-col">
                                    <FaUserCircle size={70} className='' />
                                    <h5>UKS Infotech Solution</h5>
                                    <div>Business</div>
                                </Col>

                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CustomerPrId:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CustomerId:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CustomerNo:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Area:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Distict:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >State:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Cibil Record:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Secured Or Unsecured:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>

                        </Col>


                        <Col className="Customer-profile-view-col" sm={10} lg={3}>

                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Loan Amount:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Previous Any Loan:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Outstanding Amount:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Document In Hand:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Previous Loan Bank / Finance Name:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >DPT Status:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CheckBounds_Status:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Bussiness Type:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                        </Col>


                        <Col className="Customer-profile-view-col" sm={10} lg={3}>

                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Monthly Income:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >GSTNo:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >IT_File_Status:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CustomerBlock_Status:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>
                            <Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >CustomerFile_Status:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row><Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >UpdateBy:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row><Row className="Customer-profile-row">
                                <Col xl={5} sm={2} className="Customer-profile-view-div-second"> <div >Update_Date:</div></Col>
                                <Col xl={5} sm={4} className="Customer-profile-view-div-second"><div ></div></Col>
                            </Row>

                        </Col>
                        <Col className="Customer-profile-view-col" sm={10} lg={2}>

                            <Row className="Customer-profile-row">
                                <Col  className="Customer-profile-view-div-second"> <h6 >PDF:</h6></Col>
                            </Row>
                            <Row className="Customer-profile-download">
                                <div  > <Button>Send Email</Button></div>or
                                        
                                <div > <Button>Download pdf</Button></div>
                            </Row>
                            

                        </Col>






                    </Row>
                </Container>
            </Container>
        </>
    );
}
export default Customer_Profile