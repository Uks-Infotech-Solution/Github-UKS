import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';

const options = [
    { value: '2020-2021', label: '2020-2021' },
    { value: '2021-2022', label: '2021-2022' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' }
];

function Customer_LoanProcessing({ refetchData }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};
    const [customerDetails, setCustomerDetails] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [editingMode, setEditingMode] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId }
                });
                setCustomerDetails(response.data);
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        };

        fetchCustomerDetails();
    }, [customerId]);

    const fetchLoanProcessingDetails = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-loan-processing', {
                params: { customerId: customerId }
            });

            if (response.status === 200) {
                const data = response.data;
                if (data) {
                    setFormData({
                        blockStatus: data.blockStatus || '',
                        checkBounds: data.checkBounds || '',
                        cibilRecord: data.cibilRecord || '',
                        gstNo: data.gstNo || '',
                        monthlyIncome: data.monthlyIncome || '',
                        msneNo: data.msneNo || '',
                        fileStatus: data.fileStatus || ''
                    });
                    setSelectedOptions(data.itReturns ? data.itReturns.map(item => ({ value: item, label: item })) : []);
                } else {
                    setEditingMode(true);
                }
            }
        } catch (error) {
            console.error('Error fetching loan processing details:', error);
            setError('Failed to fetch loan processing details');
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchLoanProcessingDetails();
        }
    }, [customerId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    const validateLoanProcessingDetails = () => {
        // Add your validation logic here
        return true;
    };

    const handleSaveOrUpdate = async () => {
        if (!validateLoanProcessingDetails()) {
            alert('Please fill out all required fields of Loan Processing.');
            return;
        }
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/save-loan-processing', {
                selectedOptions: selectedOptions.map(option => option.value),
                ...formData,
                customerId
            });
            alert('Loan processing details saved/updated successfully');
            fetchLoanProcessingDetails();
            setEditingMode(false);
            if (refetchData) {
                refetchData();
            }
            window.location.reload();

        } catch (error) {
            console.error('Error saving/updating loan processing details:', error);
            alert('Failed to save/update loan processing details');
        }
    };

    // CIBIL PDF FILE UPLOADING 
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const [pdfName, setPdfName] = useState('');
    const [showDownloadLink, setShowDownloadLink] = useState(false);

    useEffect(() => {
        const checkForPdf = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/check-pdf', {
                    params: { customerId: customerId }
                });
                if (response.status === 200) {
                    setShowDownloadLink(true);
                }
            } catch (error) {
                // console.log('No existing PDF found for this customer');
            }
        };

        if (customerId) {
            checkForPdf();
        }
    }, [customerId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(file);
            setPdfName(file.name);
            setShowDownloadLink(false); // Hide the download link when a new file is selected
        }
    };

    const handleUpload = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file first.');
            return;
        }

        if (pdfFile.size > 25 * 1024 * 1024) {
            alert('File size exceeds the maximum limit of 25MB.');
            return;
        }

        const formData = new FormData();
        formData.append('pdfFile', pdfFile);
        formData.append('customerId', customerDetails._id);

        try {
            await axios.post('https://uksinfotechsolution.in:8000/api/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('PDF uploaded successfully');
            setShowDownloadLink(true); // Show the download link after successful upload
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF');
        }
    };


    const handleEdit = () => {
        setEditingMode(true);
    };

    return (
        <Container fluid>
            <Row className="dsa-detail-view-header-row" style={{ padding: '10px' }}>
                <Row style={{ alignItems: 'center', paddingBottom: '10px' }}>
                    <Col>
                        <div>Loan Processing Details</div>
                    </Col>
                    {!editingMode && (
                        <Col className="d-flex justify-content-end">
                            <Button style={{ width: "80px" }} onClick={handleEdit}>Edit</Button>
                        </Col>
                    )}
                </Row>
                {/* <Row >
                    <div className='Upload-profile-div'>
                        <h6 >Upload Pdf</h6>

                        <div>
                            <input type="file" onChange={handleFileChange} style={{}} />

                            <div className="file-name">{pdfName}</div>
                            <div>
                                <Button onClick={handleUpload}>Upload</Button>

                            </div>
                        </div>

                    </div>

                </Row> */}
                <Col className="">
                    <Row className="Row1 view-row-size">
                        <Col className='basic-col-width' lg={3}>
                            <span className="">IT Returns</span>
                        </Col>
                        <Col lg={2}>
                            <Select
                                options={options}
                                isMulti
                                value={selectedOptions || ''}
                                onChange={handleSelectChange}
                                className='it-returns'
                                isDisabled={!editingMode}
                            />
                        </Col>
                    </Row>
                    <Row className="Row1 view-row-size">
                        <Col className='basic-col-width' lg={3}>
                            <span className="">Check Bounds Status</span>
                        </Col>
                        <Col lg={6}>
                            <select
                                name="checkBounds"
                                className="dropdown box"
                                style={{ minWidth: '200px' }}
                                value={formData.checkBounds || ''}
                                onChange={handleChange}
                                disabled={!editingMode || editingMode}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </Col>
                    </Row>
                    <Row className="Row1 view-row-size">
                        <Col className='basic-col-width' lg={3}>
                            <span className="">Customer Block Status</span>
                        </Col>
                        <Col>
                            <select
                                name="blockStatus"
                                className="dropdown box"
                                value={formData.blockStatus || ''}
                                onChange={handleChange}
                                disabled={!editingMode || editingMode}
                            >
                                <option value="">Select</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </Col>
                    </Row>
                    <Row className="Row1 view-row-size">
                        <Col className='basic-col-width' lg={3}>
                            <span className="">File Status</span>
                        </Col>
                        <Col>
                            <input
                                type="text"
                                name="fileStatus"
                                className="box"
                                value={formData.fileStatus || ''}
                                onChange={handleChange}
                                readOnly={!editingMode}
                            />
                        </Col>
                    </Row>
                    {customerDetails && customerDetails.customerType === 'Business' && (
                        <>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={3}>
                                    <span className="">Monthly Income</span>
                                </Col>
                                <Col>
                                    <input
                                        type="number"
                                        name="monthlyIncome"
                                        className="box"
                                        value={formData.monthlyIncome || ''}
                                        onChange={handleChange}
                                        readOnly={!editingMode}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={3}>
                                    <span className="">MSNE Reg No.</span>
                                </Col>
                                <Col>
                                    <input
                                        type="text"
                                        name="msneNo"
                                        className="box"
                                        value={formData.msneNo || ''}
                                        onChange={handleChange}
                                        readOnly={!editingMode}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={3}>
                                    <span className="">Gst No</span>
                                </Col>
                                <Col>
                                    <input
                                        type="text"
                                        name="gstNo"
                                        className="box"
                                        value={formData.gstNo || ''}
                                        onChange={handleChange}
                                        readOnly={!editingMode}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                    <Row className="Row1 view-row-size">
                        <Col className='basic-col-width' lg={3}>
                            <span className="">Cibil Record</span>
                        </Col>
                        <Col>
                            <input
                                type="text"
                                name="cibilRecord"
                                className="box"
                                value={formData.cibilRecord || ''}
                                onChange={handleChange}
                                readOnly={!editingMode}
                            />
                        </Col>
                    </Row>
                    {editingMode && (
                        <Row className="d-flex justify-content-end" style={{ paddingTop: '10px' }}>
                            <Col>
                                <Button onClick={handleSaveOrUpdate}>Save</Button>
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Customer_LoanProcessing;
