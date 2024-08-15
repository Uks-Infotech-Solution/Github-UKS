import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Col, Row, Button, Modal } from "react-bootstrap";
import './PricingBox.css';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GrCheckboxSelected } from "react-icons/gr";
import { TiInputChecked } from "react-icons/ti";
import { FcRight } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";

const PricingBox = () => {
  const [packageDetails, setPackageDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { isSidebarExpanded } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { dsaId } = location.state || {};
  const [dsaData, setDsaData] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/PackageDetails`);
        setPackageDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
  }, []);

  useEffect(() => {
    const fetchDSADetails = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
        setDsaData(response.data);
      } catch (error) {
        console.error('Error fetching DSA details:', error);
      }
    };

    if (dsaId) {
      fetchDSADetails();
    }
  }, [dsaId]);

  const handlePurchaseClick = async (pkg) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/check/dsa/address?dsaId=${dsaId}`);
      if (response.data) {
        setSelectedPackage(pkg);
        setShowModal(true);
      } else {
        alert("Please update the address to purchase the package");
        navigate('/dsa/updation', { state: { dsaId } });
      }
    } catch (error) {
      console.error('Error checking address:', error);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!dsaData || !selectedPackage) return;

    // Extracting loan types from selected package
    const loanTypes = selectedPackage.loanTypes;

    // Filtering active additional inputs
    const activeAdditionalInputs = selectedPackage.additionalInputs.filter(item => item.InputStatus === 'Active');

    // Prepare purchase data
    const purchaseData = {
      dsaId: dsaId,
      dsaNumber: dsaData.dsaNumber,
      dsaName: dsaData.dsaName,
      dsaCompanyName: dsaData.dsaCompanyName,
      email: dsaData.email,
      primaryNumber: dsaData.primaryNumber,
      packageName: selectedPackage.packageName,
      downloadAccess: selectedPackage.downloadAccess,
      validity:selectedPackage.validity,
      amount:selectedPackage.amount,
      comparison:selectedPackage.comparison,
      packageAmount: selectedPackage.packageAmount,
      packageStatus: "Inactive",
      loanTypes: loanTypes,
      additionalInputs: activeAdditionalInputs
    };

    try {
      await axios.post('https://uksinfotechsolution.in:8000/buy_packagers', purchaseData);
      setShowModal(false);
      setShowSuccessModal(true); // Show success modal upon successful purchase
    } catch (error) {
      console.error('Error purchasing package:', error);
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <h3 className="text-uppercase text-center">Pricing Plans</h3>
      <Row className="mt-5" style={{ justifyContent: 'center' }}>
        {packageDetails.length > 0 ? (
          packageDetails.map((pkg) => (
            <Col className="mt-2" key={pkg._id} lg={6}>
              <div className="card">
                <div className="card-body mt-4">
                  <Row>
                    <Col style={{ alignItems: 'center', textAlign: 'center ' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '50px' }} fill="red" className="bi bi-trophy" viewBox="0 0 16 16">
                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z" />
                      </svg>
                      <h5 className="fw-bold text-uppercase mt-4">{pkg.packageName}</h5>
                      <h4 className="fw-bold text-uppercase mt-3">{pkg.packageAmount}/-</h4>
                      <Button className="btn btn-primary mt-2" style={{ backgroundColor: '' }} onClick={() => handlePurchaseClick(pkg)}>Purchase</Button>

                    </Col>
                    <Col >
                      {pkg.loanTypes.map((loanType, index) => (
                        <>
                          <Row style={{ alignItems: 'center', justifyContent: 'center', padding: '0px' }}>
                            <Col ><FcApproval size={18} color="blue" style={{ marginRight: '0.5rem' }} />
                              <span key={index} className="">{loanType}</span>
                            </Col>

                          </Row>
                        </>
                      ))}
                      <div className="mt-3">
                        <FcRight size={18} color="green" style={{ marginRight: '0.5rem' }} />
                        <span className=" mt-3">Download Access : {pkg.downloadAccess}</span>
                        <div>
                        <FcRight size={18} color="green" style={{ marginRight: '0.5rem' }} />
                        <span className=" mt-3">Validity : {pkg.validity} Days</span></div>
                        {pkg.additionalInputs.map((item, index) => (
                          item.InputStatus === 'Active' && (
                            <div key={index} className="">
                              <FcRight size={18} color="green" style={{ marginRight: '0.5rem' }} />
                              <span>{item.value}</span>
                            </div>
                          )
                        ))}
                      </div>

                    </Col>
                  </Row>


                </div>
              </div>
            </Col>
          ))
        ) : (
          <p className="text-center">No packages available</p>
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          You Have Selected {selectedPackage && selectedPackage.packageName}. Are You Sure You Want to Purchase This Package?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmPurchase}>Confirm</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'green' }}>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center', color: 'green' }}>
          Package Has Been Successfully Purchased!
          <p>Your Package will be Activate Soon. Please Contact Admin</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PricingBox;
