import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Customer Loan Levels',
    },
  },
};

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

const ChartComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanProcessingDetails, setLoanProcessingDetails] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/');
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
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-loan-processing', {
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

  // Data for the bar chart
  const chartData = {
    labels: Object.keys(loanLevelCounts),
    datasets: [
      {
        label: 'Customer Count',
        data: Object.values(loanLevelCounts),
        backgroundColor: [
          'rgba(255,99,132,0.5)',
          'rgba(53,162,235,0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Container>
      <h1>Customer Loan Levels</h1>
      <Bar options={chartOptions} data={chartData} />
    </Container>
  );
};

export default ChartComponent;
