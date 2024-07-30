import React, { useEffect, useState } from 'react';
import './Vertical_Box.css'; // Assuming you create a CSS file for styling
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerticalBoxes = () => {
    const [dsaData, setDsaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};
    
    useEffect(() => {
        fetchDSADetails();
    }, []);

    const fetchDSADetails = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/list');
            const dsas = response.data.dsa;

            const dsaWithAddressPromises = dsas.map(async (dsa) => {
                try {
                    const addressResponse = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsa._id}`);
                    if (addressResponse.data && addressResponse.data.permanentAddress) {
                        return {
                            ...dsa,
                            permanentAddress: addressResponse.data.permanentAddress
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching address for DSA ${dsa._id}:`, error);
                }
                return null;
            });

            const dsaWithAddress = await Promise.all(dsaWithAddressPromises);
            const filteredDSAs = dsaWithAddress.filter(dsa => dsa && dsa.permanentAddress && dsa.permanentAddress.area);

            setDsaData(filteredDSAs);
            setLoading(false);
        } catch (error) {
            // console.error('Error fetching DSA details:', error);
            setLoading(false);
        }
    };

    const handleClick = (area) => {
        navigate(`/dsa/grid/view`, { state: { area, customerId } });
    };

    const groupByArea = (data) => {
        return data.reduce((acc, dsa) => {
            const area = dsa.permanentAddress.area;
            if (!acc[area]) {
                acc[area] = [];
            }
            acc[area].push(dsa);
            return acc;
        }, {});
    };

    const groupedDSAs = groupByArea(dsaData);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="left-sidebar">
            <div className='Customer-dash-second' style={{ height: '800px' }}>
                <h6>Your District DSA By Area</h6>
                <div className="vertical-box">
                    {Object.keys(groupedDSAs).map(area => (
                        <div key={area} onClick={() => handleClick(area)}>
                            {area} ({groupedDSAs[area].length})
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className='Customer-dash-second'>
                <h6>Top 5 DSA In Your Area</h6>
                <div className="vertical-box">
                    {dsaData.slice(0, 5).map((dsa, index) => (
                        <div className='vertical-small-font' key={index} onClick={() => handleClick(dsa.permanentAddress.area)}>
                            {dsa.name} ({dsa.rating} Star)
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default VerticalBoxes;
