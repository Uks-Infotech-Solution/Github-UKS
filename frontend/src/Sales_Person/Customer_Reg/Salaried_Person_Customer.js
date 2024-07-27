import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import './Customer_reg.css'
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Salaried_Person({ onSuccess,customerId }) {
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [salariedPersons, setSalariedPersons] = useState([]);

 // Function to handle saving salaried person details
 const handleSaveSalariedPerson = async () => {
    try {
        const response = await axios.post('https://uksinfotechsolution.in:8000/salariedperson', {
            customerId: customerId,
            salariedperson: salariedPersons
        });
        alert('Salaried Details Saved Successfully')
        onSuccess(); // Call onSuccess to switch to the next tab

    } catch (error) {
        console.error('Error saving Salaried Person details:', error);
    }
};

    const addSalariedPerson = () => {
        setSalariedPersons([
            ...salariedPersons,
            { _id: null, companyName: '', role: '', monthlySalary: '', workExperience: '' }
        ]);
    };

    const handleSalaryInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSalariedPersons = [...salariedPersons];
        updatedSalariedPersons[index][name] = value;
        setSalariedPersons(updatedSalariedPersons);
    };
    return (
        <>
            <Container fluid >

            <Row>
                    <Col>
                        <>
                            <Row className='profile-address-single-row'>
                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Company Name</span></Col>
                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Designation</span></Col>
                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Monthly Salary</span></Col>
                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>How Many Years of Work</span></Col>
                            </Row>
                            {salariedPersons.map((salaried, index) => (
                                <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                    <Col>
                                        <input
                                            className="input-box-address"
                                            placeholder='Company Name'
                                            name="companyName"
                                            type="text"
                                            value={salaried.companyName}
                                            onChange={(e) => handleSalaryInputChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            className="input-box-address"
                                            name="role"
                                            placeholder='Role'
                                            type="text"
                                            value={salaried.role}
                                            onChange={(e) => handleSalaryInputChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            className="input-box-address"
                                            name="monthlySalary"
                                            placeholder='Monthly Salary'
                                            type="text"
                                            value={salaried.monthlySalary}
                                            onChange={(e) => handleSalaryInputChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            className="input-box-address"
                                            name="workExperience"
                                            placeholder='How Many Years of Work'
                                            type="text"
                                            value={salaried.workExperience}
                                            onChange={(e) => handleSalaryInputChange(index, e)}
                                        />
                                    </Col>
                                </Row>
                            ))}
                        </>
                    </Col>

                    <Row>
                        <Row>
                            <Col>
                                <Button onClick={addSalariedPerson} style={{ marginBottom: '10px', marginLeft: "10px" }}>+ Add Company</Button>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={handleSaveSalariedPerson}>Save Salary Details</Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    );
}

export default Salaried_Person;
