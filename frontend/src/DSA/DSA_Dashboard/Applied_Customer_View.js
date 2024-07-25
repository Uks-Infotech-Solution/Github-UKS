import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { MdStar, MdEmail } from "react-icons/md";
import { BiSolidContact } from "react-icons/bi";
import { FaPeopleArrows, FaRegAddressCard } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import PathnameUrlPath from "../../URL_Path/Url_Path";
import Applied_DSA_View from "./Applied_DSA_View";
import { LiaRupeeSignSolid } from "react-icons/lia";

function Applied_Customer_View() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loanId, applicationNumber, dsaId } = location.state || {};
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const [LoanDetails, setLoanDetails] = useState([]);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [loanApp, setLoanApp] = useState(null);
    const { isSidebarExpanded } = useSidebar();
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        _id: "",
        dsaName: "",
        dsa_status: "",
        dsaCompanyName: "",
        primaryNumber: "",
        alternateNumber: "",
        whatsappNumber: "",
        email: "",
        website: ""
    });
    const [addressDetails, setAddressDetails] = useState({
        permanentState: '',
        permanentDistrict: '',
        permanentArea: ''
    });
    const [feedbackData, setFeedbackData] = useState({
        rating: '',
        textFeedback: '',
        serviceQuality: ''
    });

    const homepage = () => {
        navigate('/dsa/dashboard', { state: { dsaId } });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const loanResponse = await axios.get(`http://localhost:8000/api/dsa/applications/loan/${loanId}`);
                const loanApplication = loanResponse.data.loanApplication;
                console.log(loanApplication);
                setLoanApp(loanApplication);
                const { dsaId, customerId } = loanApplication;

                const dsaResponse = await axios.get(`http://localhost:8000/api/dsa?dsaId=${dsaId}`);
                const dsaDetails = dsaResponse.data;

                setFormData({
                    _id: dsaDetails._id || "",
                    dsaName: dsaDetails.dsaName || "",
                    dsa_status: dsaDetails.dsa_status || "",
                    dsaCompanyName: dsaDetails.dsaCompanyName || "",
                    primaryNumber: dsaDetails.primaryNumber || "",
                    alternateNumber: dsaDetails.alternateNumber || "",
                    whatsappNumber: dsaDetails.whatsappNumber || "",
                    email: dsaDetails.email || "",
                    website: dsaDetails.website || ""
                });

                const customerResponse = await axios.get('http://localhost:8000/customer-details', {
                    params: { customerId: customerId }
                });
                const customerDetails = customerResponse.data;
                setCustomerDetails(customerDetails);
                console.log(customerDetails);
                setAddressDetails(customerDetails.address || {});
                fetchAddressDetails(customerId);
                fetchTableCount(customerId);
                fetchDownloadTableCount(customerId);

            } catch (error) {
                console.error('Error fetching details:', error);
                alert("Failed to fetch details");
            }
        };

        if (loanId) {
            fetchDetails();
        }
    }, [loanId]);

    const fetchAddressDetails = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/view-address`, {
                params: { customerId: customerId }
            });
            if (response.data) {
                setAddressDetails(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error fetching address details:', error);
        }
    };

    const fetchTableCount = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/dsa-customer/table/count?customerId=${customerId}`);
            setTableCount(response.data.count);
            console.log(response.data.count);

        } catch (error) {
            console.error('Error fetching table count:', error.message);
        }
    };

    const fetchDownloadTableCount = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/dsa-customer/downloadtable/count?customerId=${customerId}`);
            setDownloadTableCount(response.data.count);
            console.log(response.data.count);
        } catch (error) {
            console.error('Error fetching download table count:', error.message);
        }
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/buy_packages/dsa/${dsaId}`);
                setPackages(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPackages();
    }, [dsaId]);
    const handleMoreDetailsClick = () => {
        navigate('/dsa/customer/download', { state: { dsaId, customerId: customerDetails?._id } });
    };
    return (
        <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
            <div style={{ paddingBottom: '18px' }}>
                <PathnameUrlPath location={location} homepage={homepage} />
            </div>
            <Row className="apply-loan-view-header-row">
                <Col className="apply-loan-view-header-col">
                    <Applied_DSA_View />
                    <hr />
                    <Row>
                        <Col>
                            <Row className="apply-loan-view-row">
                                <Col>
                                    <div className="apply-loan-cname">
                                        {customerDetails?.title} {loanApp?.customerName}
                                        <span className="loan-rating"> (UKS-CUS-00{loanApp?.customerNo})</span>
                                        <span className="apply-loan-name">
                                            <span style={{ paddingLeft: '10px', color: 'green' }}>
                                                {loanApp?.customerLoanStatus}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="apply-loan-name">
                                        {customerDetails?.customerType}
                                        <span className="loan-rating" style={{ fontWeight: '400', fontSize: '11px', marginLeft: '3px', marginRight: '3px' }}>|</span>
                                        <span className="loan-rating">{tableCount} Views</span>
                                        <span className="loan-rating" style={{ fontWeight: '400', fontSize: '11px', marginLeft: '3px', marginRight: '3px' }}>|</span>
                                        <span className="loan-rating">{downloadTableCount} Downloads</span>
                                    </div>

                                </Col>
                            </Row>
                            <div className="loan-amount">
                                <span className="loan-days">Applied Loan: <span className="loan-rating">{loanApp?.loanType}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Loan Amount: <span className="loan-rating"><LiaRupeeSignSolid size={15} />{loanApp?.loanAmount}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Required Days: <span className="loan-rating">{loanApp?.loanRequiredDays}</span></span>
                            </div>

                            {/* {packages?.some(pkg => pkg.packageStatus === 'Active') && (
                                <>
                                    <div className="loan-contact">
                                        <Row>
                                            <Col>
                                                <div className="loan-amount">
                                                    <span className="loan-days">
                                                        <BiSolidContact size={18} style={{ color: 'blue' }} className="loan-icon" />
                                                        Contact:
                                                        <span className="loan-rating"> {customerDetails?.customercontact}</span>
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row style={{ paddingTop: '10px' }}>
                                            <Col>
                                                <IoLogoWhatsapp color="green" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                                Whatsapp:
                                                <span className="loan-rating" style={{ paddingLeft: '5px' }}>{customerDetails?.customerwhatsapp}</span>
                                            </Col>
                                        </Row>

                                        <Row style={{ paddingTop: '10px' }}>
                                            <Col>
                                                <div className="loan-amount">
                                                    <span className="loan-days">
                                                        <MdEmail color="orange" size={18} className="loan-icon" />
                                                        E-Mail:
                                                        <span className="loan-rating"> {loanApp?.customerMailId}</span>
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="loan-days">
                                        <Row style={{ paddingTop: '10px' }}>
                                            <Col>
                                                <FaRegAddressCard color="brown" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                                Address:
                                                <span className="loan-rating" style={{ paddingLeft: '5px' }}>
                                                    {addressDetails?.permanentDoorNo}<span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '2px', marginRight: '5px' }}></span>
                                                    {addressDetails?.permanentStreet}<span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '2px', marginRight: '5px' }}></span>
                                                    {addressDetails?.permanentCity}<span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '2px', marginRight: '5px' }}></span>
                                                    {addressDetails?.permanentDistrict}<span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '2px', marginRight: '5px' }}></span>
                                                    {addressDetails?.permanentState} {addressDetails?.permanentZip}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                    
                                </>
                            )} */}
                            <div style={{marginTop:'10px'}}>
                            <Button style={{fontSize:'12px',padding:'5px'}} onClick={handleMoreDetailsClick}>
                            More Details</Button>
                            </div>
                        </Col>
                        <Row>
                            <Col>
                            
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Applied_Customer_View;
