import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './First_Div.css';

function First_Div() {
  const [downloadTableCount, setDownloadTableCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { dsaId } = location.state || {};
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [loanApplications, setLoanApplications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('This Month');

  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa/customer/applied/loan/${dsaId}`);
        const loanApplicationsData = response.data;
        // console.log(response.data);
        setLoanApplications(loanApplicationsData);
      } catch (error) {
        console.error('Error fetching loan applications:', error);
      }
    };

    if (dsaId) {
      fetchLoanApplications();
    }
  }, [dsaId]);

  useEffect(() => {
    const fetchDownloadTableCount = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/applications/count/${dsaId}`);
        // setDownloadTableCount(response.data.count);
      } catch (error) {
        console.error('Error fetching loan application count:', error);
      }
    };

    if (dsaId) {
      fetchDownloadTableCount();
    }
  }, [dsaId]);

  useEffect(() => {
    const fetchTableCount = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa/customer/apply/view/count/${dsaId}`);
        setTableCount(response.data.count);
        // console.log(response.data.count);
      } catch (error) {
        console.error('Error fetching apply view count:', error);
      }
    };

    if (dsaId) {
      fetchTableCount();
    }
  }, [dsaId]);

  useEffect(() => {
    const fetchLoanStatusCounts = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/loan/status/count/${dsaId}`);
        // setApprovedCount(response.data.approvedCount);
        // setRejectedCount(response.data.rejectedCount);
      } catch (error) {
        console.error('Error fetching loan status counts:', error);
      }
    };

    if (dsaId) {
      fetchLoanStatusCounts();
    }
  }, [dsaId]);

  useEffect(() => {
    if (loanApplications.length > 0) {
      const filteredApplications = filterLoanApplications(selectedFilter);
      const totalAmount = filteredApplications.reduce((acc, curr) => acc + curr.loanAmount, 0);
      setTotalLoanAmount(totalAmount);

      const approved = filteredApplications.filter(app => app.applyLoanStatus === 'Approved').length;
      setApprovedCount(approved);

      const rejected = filteredApplications.filter(app => app.applyLoanStatus === 'Rejected').length;
      setRejectedCount(rejected);

      setDownloadTableCount(filteredApplications.length);
    }
  }, [selectedFilter, loanApplications]);

  const filterLoanApplications = (filter) => {
    const currentDate = new Date();
    return loanApplications.filter(app => {
      const appDate = new Date(app.timestamp);
      switch (filter) {
        case 'Today':
          return (
            appDate.getDate() === currentDate.getDate() &&
            appDate.getMonth() === currentDate.getMonth() &&
            appDate.getFullYear() === currentDate.getFullYear()
          );
          case 'Yesterday':
            const yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);
            return (
              appDate.getDate() === yesterday.getDate() &&
              appDate.getMonth() === yesterday.getMonth() &&
              appDate.getFullYear() === yesterday.getFullYear()
            );
        case 'This Month':
          return (
            appDate.getMonth() === currentDate.getMonth() &&
            appDate.getFullYear() === currentDate.getFullYear()
          );
        case 'Previous Month':
          const previousMonth = new Date(currentDate);
          previousMonth.setMonth(previousMonth.getMonth() - 1);
          return (
            appDate.getMonth() === previousMonth.getMonth() &&
            appDate.getFullYear() === previousMonth.getFullYear()
          );
        default:
          return true;
      }
    });
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  const formatLoanAmount = (amount) => {
    if (amount >= 10000000) { // 1 Crore or more
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh or more
      return `${(amount / 100000).toFixed(2)} Lakh`;
    } else if (amount >= 1000) { // 1 Thousand or more
      return `${(amount / 1000).toFixed(2)} K`;
    }
    return amount.toString();
  };

  return (
    <>
      <div className='dsa-First-div-container'>
        <Row style={{ justifyContent:'end', textAlign:'end'}}>
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedFilter}
            onSelect={handleFilterChange}
            className="custom-first-div-dropdown"
            style={{marginRight:'10px'}}
          >
            <Dropdown.Item eventKey="Today">Today</Dropdown.Item>
            <Dropdown.Item eventKey="Yesterday">Yesterday</Dropdown.Item>
            <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
            <Dropdown.Item eventKey="Previous Month">Last Month</Dropdown.Item>
          </DropdownButton>
          <span style={{textAlign:'start', paddingLeft:'25px', color:'blue'}}>
            <h3>Filter</h3>
          </span>
        </Row>
        <Row>
          <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
            <div className='count-box Customer-table-container-second' style={{height:'170px'}}>
              <div className=''>
                <p>Total Loan Applied Count
                  <span style={{fontSize:'23px',fontWeight:'600',paddingLeft:'5px'}}>  {downloadTableCount}</span></p>
                <p>Total Loan Amount Value
                  <span style={{fontSize:'23px',fontWeight:'600',paddingLeft:'5px'}}>  {formatLoanAmount(totalLoanAmount)}</span></p>
              </div>
            </div>
          </Col>
          <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
            <div className='count-box Customer-table-container-second' style={{height:'170px'}}>
              <div className=''>
                <p>Applied Loan Approved</p>
                <h3>{approvedCount}</h3>
              </div>
            </div>
          </Col>
          <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
            <div className='count-box Customer-table-container-second' style={{height:'170px'}}>
              <div className=''>
                <p>Applied Loan Reject</p>
                <h3>{rejectedCount}</h3>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default First_Div;
