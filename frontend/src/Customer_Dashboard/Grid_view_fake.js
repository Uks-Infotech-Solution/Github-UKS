import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Grid_Loan.css';
import { MdStar } from "react-icons/md";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../URL_Path/Url_Path';
import { useLocation } from 'react-router-dom';

const LoanGridView = () => {
  const [expandedLoanId, setExpandedLoanId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const homepage = () => {
    navigate('/customer-dashboard');
  };
  const loans = [
    { id: 1, companyName: 'Hdfc Limited', dsaName: 'John Wick', loanType: 'Home Loan', details: 'Additional details about Home Loan from Hdfc Limited.', rating: 4 },
    { id: 2, companyName: 'ICICI Bank', dsaName: 'Alice Smith', loanType: 'Personal Loan', details: 'Additional details about Personal Loan from ICICI Bank.', rating: 3 },
    { id: 3, companyName: 'Axis Bank', dsaName: 'Bob Brown', loanType: 'Car Loan', details: 'Additional details about Car Loan from Axis Bank.', rating: 5 },
    { id: 1, companyName: 'Hdfc Limited', dsaName: 'John Wick', loanType: 'Home Loan', details: 'Additional details about Home Loan from Hdfc Limited.', rating: 4 },
    { id: 2, companyName: 'ICICI Bank', dsaName: 'Alice Smith', loanType: 'Personal Loan', details: 'Additional details about Personal Loan from ICICI Bank.', rating: 3 },
    { id: 3, companyName: 'Axis Bank', dsaName: 'Bob Brown', loanType: 'Car Loan', details: 'Additional details about Car Loan from Axis Bank.', rating: 5 },
  
  ];

  const toggleExpand = (loanId) => {
    setExpandedLoanId(expandedLoanId === loanId ? null : loanId);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <MdStar key={index} color={index < rating ? '#ffd700' : '#e4e5e9'} />
    ));
  };

  const handleReadMore = (loanId) => {
    navigate(`/dsa/detail/view`);
  };
  const { isSidebarExpanded } = useSidebar();

  return (
    <Container fluid className={`grid-view-page-container  ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <PathnameUrlPath location={location} homepage={homepage} />
      <h2 className="mt-4 mb-4">Loan Providers :-</h2>
      <Row>
        {loans.map((loan) => (
          <Col key={loan.id} md={4} className="mb-4">
            <Card className="loan-card">
              <Card.Body>
                <Card.Title>{loan.companyName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{loan.dsaName}</Card.Subtitle>
                <Card.Text>
                  <b>Type of Loan:</b> {loan.loanType}
                </Card.Text>
                <Card.Text>
                  <b>Rating:</b> {renderStars(loan.rating)}
                </Card.Text>
                {expandedLoanId === loan.id && (
                  <>
                    <Card.Text className="loan-extra-details">
                      {loan.details}
                    </Card.Text>
                  </>
                )}
                <Button variant="link" className="readmore-link" onClick={() => handleReadMore(loan.id)}>
                  Read more
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LoanGridView;
