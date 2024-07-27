import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import PathnameUrlPath from "../URL_Path/Url_Path";
import { BiSolidContact } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaPeopleArrows, FaRegAddressCard } from "react-icons/fa";

function DSA_Packager_View() {
    const navigate = useNavigate();
    const location = useLocation();
    const { uksId, pkgId } = location.state || {};
    const [salesPersons, setSalesPersons] = useState([]);
    const { isSidebarExpanded } = useSidebar();
    const [pkg, setPackage] = useState({});
    const [dsaId, setDsaId] = useState(null);
    const [uksDetails, setuksDetails] = useState([]);
    const [formData, setFormData] = useState({
        dsaName: "",
        dsaCompanyName: "",
        primaryNumber: "",
        email: "",
        website: "",
        dsa_status: ""
    });
    const [addressDetails, setAddressDetails] = useState({
        permanentState: '',
        permanentDistrict: '',
        permanentArea: ''
    });
    useEffect(() => {
        const fetchSalesPersons = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/sales/person/list');
                setSalesPersons(response.data);
            } catch (err) {
                // setError(err.message);
            } finally {
                // setLoading(false);
            }
        };

        fetchSalesPersons();
    }, []);

    useEffect(() => {
        const fetchUksdetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/uks/details', {
                    params: {
                        uksId: uksId
                    }
                });
                const uks = response.data;
                console.log(uks);
                setuksDetails(uks);
            } catch (error) {
                console.error('Error fetching uks details:', error);
            }
        };

        fetchUksdetails();
    }, [uksId]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/package/details?pkgId=${pkgId}`);
                const packageData = response.data.data;
                setPackage(packageData);
                setDsaId(packageData.dsaId);
            } catch (error) {
                console.error('Error fetching package details:', error);
            }
        };

        if (pkgId) {
            fetchPackages();
        }
    }, [pkgId]);

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                if (dsaId) {
                    const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
                    const dsaDetails = response.data;

                    setFormData({
                        dsaName: dsaDetails.dsaName || "",
                        dsaCompanyName: dsaDetails.dsaCompanyName || "",
                        primaryNumber: dsaDetails.primaryNumber || "",
                        email: dsaDetails.email || "",
                        website: dsaDetails.website || "",
                        dsa_status: dsaDetails.dsa_status || ""
                    });
                }
            } catch (error) {
                console.error('Error fetching DSA details:', error);
                alert("Failed to fetch DSA details");
            }
        };

        if (dsaId) {
            fetchDSADetails();
        }
    }, [dsaId]);

    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                if (dsaId) {
                    const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsaId}`);
                    const fetchedAddress = response.data;

                    setAddressDetails({
                        permanentState: fetchedAddress.permanentAddress.state || '',
                        permanentDistrict: fetchedAddress.permanentAddress.district || '',
                        permanentArea: fetchedAddress.permanentAddress.area || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
            }
        };

        if (dsaId) {
            fetchAddressDetails();
        }
    }, [dsaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const salesPersonId = e.target.elements.salesPersonName.value;
        const salesPerson = salesPersons.find(person => person._id === salesPersonId);
        const salesPersonName = salesPerson ? salesPerson.name : '';
        const transferRefNo = e.target.elements.transferRefNo.value;

        const data = {

            uksId: uksId,
            uksNumber: uksDetails.UKSNumber,
            uksName: uksDetails.name,
            dsaId: dsaId,
            dsaName: pkg.dsaName,
            dsaNumber: formData.primaryNumber,
            pkgId: pkgId,
            packageName: pkg.packageName,
            packageAmount: pkg.packageAmount,
            downloadAccess: pkg.downloadAccess,
            loanTypes: pkg.loanTypes,
            salesPersonName: salesPersonName,
            salesPersonId: salesPersonId,
            transferRefNo: transferRefNo
        };

        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/packager/activation', data);
            console.log('Activation successful:', response.data);
            navigate('/uks/dashboard', { state: { uksId } });
            // Handle success, e.g., show a success message or navigate to another page
        } catch (error) {
            console.error('Error activating packager:', error);
            // Handle error, e.g., show an error message
        }
    };
    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                {/* <PathnameUrlPath location={location} homepage={homepage} /> */}
                <Row className="apply-loan-view-header-row">
                    <Col className="apply-loan-view-header-col">
                        <Row>
                            <Col>
                                <div className="loan-amount">
                                    <h6>Selected Package Details</h6>
                                </div>
                                <Row>
                                    <Col><span style={{ fontSize: '12px', fontWeight: '700', paddingRight: '8px' }}>DSA Name:</span><span>{pkg.dsaName}</span>
                                        <div><span style={{ fontSize: '12px', fontWeight: '700', paddingRight: '8px' }}>Package Name:</span><span>{pkg.packageName}</span></div>
                                        <div><span style={{ fontSize: '12px', fontWeight: '700', paddingRight: '8px' }}>Package Amount:</span><span>{pkg.packageAmount}</span></div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', paddingRight: '8px' }}>Loan Types:</span>
                                            {pkg.loanTypes && pkg.loanTypes.map((loanType, index) => (
                                                <span key={index}> {loanType}  </span>
                                            ))}
                                        </div>
                                        <div><span style={{ fontSize: '12px', fontWeight: '700', paddingRight: '8px' }}>Download Access:</span><span>{pkg.downloadAccess}</span></div>
                                    </Col>
                                    <Col>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group controlId="salesPersonName">
                                                <Form.Label>Select Sales Person</Form.Label>
                                                <Form.Control as="select">
                                                    <option value="">Select a Sales Person</option>
                                                    {salesPersons.map((person) => (
                                                        <option key={person._id} value={person._id}>
                                                            {person.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="transferRefNo">
                                                <Form.Control type="text" placeholder="Transfer Amount Ref.No" />
                                            </Form.Group>
                                            <Button type="submit">Submit</Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>
                                <Row className="apply-loan-view-row">
                                    <Col>
                                        <div className="apply-loan-cname">
                                            {pkg.dsaName} ({formData.dsaCompanyName})
                                            <span className="apply-loan-name">
                                                <span style={{ paddingLeft: '10px', color: formData.isActive ? 'green' : 'red' }}>
                                                    {formData.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </span>
                                        </div>

                                    </Col>
                                </Row>

                                <div className="loan-contact">
                                    <Row>
                                        <Col>
                                            <div className="loan-amount">
                                                <span className="loan-days">
                                                    <BiSolidContact size={18} style={{ color: 'blue' }} className="loan-icon" />
                                                    Contact:
                                                    <span className="loan-rating"> {formData.primaryNumber} </span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <div className="loan-amount">
                                                <span className="loan-days">
                                                    <MdEmail color="orange" size={18} className="loan-icon" />
                                                    E-Mail:
                                                    <span className="loan-rating"> {formData.email}</span>
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
                                                {addressDetails.permanentState}
                                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>,</span>
                                                {addressDetails.permanentDistrict}
                                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>,</span>
                                                {addressDetails.permanentArea}
                                            </span>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="loan-days">
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <FaPeopleArrows color="green" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                            Website:
                                            <span className="loan-rating" style={{ paddingLeft: '5px' }}>{formData.website}</span>
                                        </Col>
                                    </Row>
                                </div>
                                {/* <div style={{ paddingTop: '20px' }}>
                                        <Row style={{ paddingTop: '10px' }}>
                                            <Col>
                                                <div className="loan-amount">
                                                    <span className="loan-days">
                                                        <FaPeopleArrows color="pink" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                                        <span className="loan-provide">
                                                            Loans Provide:
                                                        </span>
                                                        <span className="loan-rating" style={{ paddingLeft: '5px' }}>
                                                            {LoanDetails.map((loan, index) => (
                                                                <span key={index}>
                                                                    {loan.typeOfLoan}
                                                                    {index < LoanDetails.length - 1 && " / "}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div> */}
                            </Col>
                            <Col className="loan-feedback" lg={3}>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default DSA_Packager_View;
