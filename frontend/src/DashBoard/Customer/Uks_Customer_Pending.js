import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [missingData, setMissingData] = useState({});

  useEffect(() => {
    const fetchCustomerDetails = async (customerId) => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/customer-pending-details', {
          params: { customerId }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        throw error;
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/');
        const customersData = response.data;
        setCustomers(customersData);
        console.log(response.data);
        setLoading(false);

        const initialCheckedItems = {};
        const missingDataTemp = {};

        for (const customer of customersData) {
          initialCheckedItems[customer._id] = false;

          const { missingTables } = await fetchCustomerDetails(customer._id);
          if (missingTables.length > 0) {
            missingDataTemp[customer._id] = missingTables;
          } else {
            missingDataTemp[customer._id] = [];
          }
        }

        setCheckedItems(initialCheckedItems);
        setMissingData(missingDataTemp);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Customer Details</h1>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Missing Data</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer._id}</td>
              <td>{customer.customerName}</td>
              <td>
                {missingData[customer._id] && missingData[customer._id].length > 0
                  ? missingData[customer._id].join(', ')
                  : 'All data present'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetails;
