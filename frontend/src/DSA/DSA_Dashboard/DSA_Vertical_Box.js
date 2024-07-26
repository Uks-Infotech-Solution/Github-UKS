import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

const DSA_VerticalBoxes = () => {
    const [dsaData, setDsaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const {  dsaId } = location.state || {};
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://148.251.230.14:8000/'); // Adjust the URL as needed
            setCustomers(response.data);
            await fetchAddresses(response.data);
        } 
        catch (err) {
            console.error('Error fetching customers:', err);
            setLoading(false);
        }
    };

    const fetchAddresses = async (customers) => {
        const newAddresses = {};
        for (let customer of customers) {
            try {
                const response = await axios.get('http://148.251.230.14:8000/view-address', {
                    params: { customerId: customer._id },
                });
                if (response.status === 200) {
                    newAddresses[customer._id] = response.data;
                }
                console.log(response.data);
            } catch (error) {
                console.error(`Failed to fetch address for ${customer._id}:`, error);
            }
        }
        setAddresses(newAddresses);
        setLoading(false);
    };

    const handleClick = (area) => {
        navigate(`/customer/grid/view`, { state: { area,dsaId } });
    };

    const groupByArea = (data) => {
        return data.reduce((acc, customer) => {
            const area = customer.permanentAddress.permanentCity; // Using permanentCity to group customers
            console.log(customer.permanentAddress.permanentCity); 
            if (area) {
                if (!acc[area]) {
                    acc[area] = [];
                }
                acc[area].push(customer);
            }
            return acc;
        }, {});
    };

    useEffect(() => {
        if (Object.keys(addresses).length > 0) {
            const combinedData = customers.map(customer => ({
                ...customer,
                permanentAddress: addresses[customer._id]
            }));
            setDsaData(combinedData);
        }
    }, [addresses, customers]);

    const groupedDSAs = groupByArea(dsaData);

    if (loading) {
        return <div></div>;
    }

    return (
        <div className="left-sidebar">
            <div className='Customer-dash-second' style={{ height: '800px' }}>
                <h6>Your District Customers By Area</h6>
                <div className="vertical-box">
                    {Object.keys(groupedDSAs).map(area => (
                        <div key={area} onClick={() => handleClick(area)}>
                            {area} ({groupedDSAs[area].length})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DSA_VerticalBoxes;
