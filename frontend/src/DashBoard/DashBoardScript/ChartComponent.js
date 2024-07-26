import React, { useState, useEffect } from 'react';
import { Table, Container, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { SiBitcoinsv } from "react-icons/si";

const ChartComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanProcessingDetails, setLoanProcessingDetails] = useState({});
  const [filteredLoanLevel, setFilteredLoanLevel] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://148.251.230.14:8000/');
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchLoanProcessingDetails = async () => {
      for (let customer of customers) {
        if (customer && customer.customermailid) {
          try {
            const response = await axios.get('http://148.251.230.14:8000/get-loan-processing', {
              params: { email: customer.customermailid }
            });
            if (response.status === 200 && response.data !== null) {
              setLoanProcessingDetails((prevState) => ({
                ...prevState,
                [customer._id]: response.data,
              }));
            }
          } catch (error) {
            console.error('Error fetching loan processing details:', error);
          }
        } else {
          console.log('Customer or customermailid is null or undefined:', customer);
        }
      }
    };

    if (customers.length > 0) {
      fetchLoanProcessingDetails();
    }
  }, [customers]);

  const determineLoanLevel = (loanAmount) => {
    if (loanAmount < 10000) {
      return 'Basic';
    } else if (loanAmount >= 10000 && loanAmount < 100000) {
      return 'Bronze';
    } else if (loanAmount >= 100000 && loanAmount < 1000000) {
      return 'Silver';
    } else if (loanAmount >= 1000000 && loanAmount < 10000000) {
      return 'Gold';
    } else {
      return 'Platinum';
    }
  };

  const handleFilterChange = (loanLevel) => {
    setFilteredLoanLevel(loanLevel);
  };

  const filteredCustomers = filteredLoanLevel
    ? customers.filter((customer) => determineLoanLevel(customer.loanRequired) === filteredLoanLevel)
    : customers;

  const countCustomersByLoanLevel = () => {
    const counts = {
      Basic: 0,
      Bronze: 0,
      Silver: 0,
      Gold: 0,
      Platinum: 0,
    };

    customers.forEach((customer) => {
      const loanLevel = determineLoanLevel(customer.loanRequired);
      counts[loanLevel]++;
    });

    return counts;
  };

  const loanLevelCounts = countCustomersByLoanLevel();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Container>
      <h1>Customer Loan Levels</h1>
      <DropdownButton id="dropdown-basic-button" title="Filter by Loan Level">
        <Dropdown.Item onClick={() => handleFilterChange(null)}>All</Dropdown.Item>
        <Dropdown.Item onClick={() => handleFilterChange('Basic')}>Basic</Dropdown.Item>
        <Dropdown.Item onClick={() => handleFilterChange('Bronze')}>Bronze</Dropdown.Item>
        <Dropdown.Item onClick={() => handleFilterChange('Silver')}>Silver</Dropdown.Item>
        <Dropdown.Item onClick={() => handleFilterChange('Gold')}>Gold</Dropdown.Item>
        <Dropdown.Item onClick={() => handleFilterChange('Platinum')}>Platinum</Dropdown.Item>
      </DropdownButton>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Loan Level</th>
            <th>Customer Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(loanLevelCounts).map(([loanLevel, count]) => (
            <tr key={loanLevel}>
              <td>{loanLevel}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ChartComponent;
