// import { Button, Col, Container, Row } from "react-bootstrap";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import React, { useState } from "react";
// import { useSidebar } from '../../Customer/Navbar/SidebarContext';
// import './Customer_reg.css';

// function Location() {
//     const navigate = useNavigate();
//     const homepage = () => {
//         navigate('/customer');
//     };
//     const { isSidebarExpanded } = useSidebar();
//     const [location, setLocation] = useState("");
//     const [address, setAddress] = useState("");

//     const detectLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 async (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation(`Lat: ${latitude}, Lon: ${longitude}`);

//                     try {
//                         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
//                         if (response.status === 200) {
//                             const formattedAddress = response.data.display_name;
//                             setAddress(formattedAddress);
//                         } else {
//                             console.error("Error getting address: ", response.status);
//                         }
//                     } catch (error) {
//                         console.error("Error getting address: ", error);
//                     }
//                 },
//                 (error) => {
//                     console.error("Error getting location: ", error);
//                 }
//             );
//         } else {
//             console.error("Geolocation is not supported by this browser.");
//         }
//     };

//     return (
//         <>
//             <Container fluid >
//                 <Row className="mt-3">
//                     <Col xl={3}>
//                         <input 
//                             type="text" 
//                             placeholder="Location" 
//                             value={location}
//                             readOnly
//                         />
//                     </Col>
//                     <Col xl={2}>
//                         <Button onClick={detectLocation}>Detect Location</Button>
//                     </Col>
//                 </Row>
//                 <Row className="mt-3">
//                     <Col>
//                         <input 
//                             type="text" 
//                             placeholder="Address" 
//                             value={address}
//                             readOnly
//                         />
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     );
// }

// export default Location;
