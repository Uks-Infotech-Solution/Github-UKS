import React, { useEffect, useState } from 'react';
import './Vertical_Box.css'; // Assuming you create a CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerticalBoxes = () => {
    const [dsaData, setDsaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDSADetails();
    }, []);

    const fetchDSADetails = async () => {
        try {
<<<<<<< HEAD
            const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/list');
            const dsas = response.data.dsa;

            const dsaWithAddressPromises = dsas.map(async (dsa) => {
                const addressResponse = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsa._id}`);
=======
            const response = await axios.get('https://localhost:8000/api/dsa/list');
            const dsas = response.data.dsa;

            const dsaWithAddressPromises = dsas.map(async (dsa) => {
                const addressResponse = await axios.get(`https://localhost:8000/api/dsa/address?dsaId=${dsa._id}`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                return {
                    ...dsa,
                    permanentAddress: addressResponse.data.permanentAddress
                };
            });

            const dsaWithAddress = await Promise.all(dsaWithAddressPromises);
            setDsaData(dsaWithAddress);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching DSA details:', error);
            setLoading(false);
        }
    };

    const handleClick = (area) => {
        navigate(`/dsa/grid/view`, { state: { area } });
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
