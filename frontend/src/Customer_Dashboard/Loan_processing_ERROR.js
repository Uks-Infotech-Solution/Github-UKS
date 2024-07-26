


 


    const determineLevel = async (amount) => {
        try {
            const response = await axios.post('http://148.251.230.14:8000/api/determine-loan-level', { loanAmount: amount });
            setLevel(response.data.loanLevel);
        } catch (error) {
            console.error('Error determining loan level:', error);
        }
    };

    // Update level whenever loan required changes
    const [formattedLoanRequired, setFormattedLoanRequired] = useState('');
    useEffect(() => {
        if (loanRequired !== '' && !isNaN(loanRequired.replace(/,/g, ''))) {
            const amount = Number(loanRequired.replace(/,/g, ''));
            determineLevel(amount);
            setFormattedLoanRequired(loanRequired.replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // Add commas to the amount
        } else {
            setLevel('');
        }
    }, [loanRequired]);

    const formatAmountWithCommas = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the amount
    };
    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/loan-types');
                setLoanTypes(response.data);
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        fetchLoanTypes();
    }, []);


<td>{customer.typeofloan}</td>
                    <td>{customer.loanRequired}</td>
                    <td style={{ textAlign: 'left' }}>
                      <SiBitcoinsv
                        size={20}
                        style={{ marginRight: '5px' }}
                        color={
                          customer.loanRequired >= 10000 && customer.loanRequired < 100000 ? ' #cd7f32' :
                            customer.loanRequired >= 100000 && customer.loanRequired < 1000000 ? '#C0C0C0' :
                              customer.loanRequired >= 1000000 && customer.loanRequired < 10000000 ? '#FFD700' :
                                customer.loanRequired >= 10000000 && customer.loanRequired < 100000000 ? ' #1f8cb7' :
                                  'black'
                        }
                      />
                      <span style={{}}>
                        {customer.level}
                      </span>
                    </td>










<Row className="Row1">
<Col lg={4}><span className="customer-sentence">Type Of Loan</span></Col>
<Col lg={5}>
    <select value={typeofloan} onChange={handleSelectChange(setTypeOfLoan)} className="Section-1-dropdown">
        <option value="">Select</option>
        {loanTypes.map((loanType) => (
            <option key={loanType._id} value={loanType.type}>{loanType.type} </option>
        ))}
    </select>
</Col>
</Row>

<Row className="Row1">
<Col lg={4}><span className="customer-sentence">Loan Required</span></Col>
<Col lg={5}>
    <input
        type="text"
        placeholder="Type amount"
        value={formatAmountWithCommas(loanRequired)} // Format the value with commas
        onChange={handleChange(setLoanRequired)}
        list="loan-suggestions"
    />
    <datalist id="loan-suggestions">
        <option value="1000" />
        <option value="100000" />
        <option value="1000000" />
    </datalist>
    <Row>
        {errors.loanRequired && <span className="error">{errors.loanRequired}</span>}

    </Row>
</Col>
</Row>
<Row className="Row1">
<Col lg={4}><span className="customer-sentence">Loan Level</span></Col>
<Col lg={4}>
    <input
        type="text"
        placeholder="Level"
        value={level}
        readOnly
    />
</Col>
</Row>


    // FETCH LEVEL OF LOAN AMOUNT FROM MASTER

    const [level, setLevel] = useState('');
    const determineLevel = async (amount) => {
        try {
            const response = await axios.post('http://148.251.230.14:8000/api/determine-loan-level', { loanAmount: amount });
            setLevel(response.data.loanLevel);
        } catch (error) {
            console.error('Error determining loan level:', error);
        }
    };

const [formattedLoanRequired, setFormattedLoanRequired] = useState('');

useEffect(() => {
    if (customerDetails && customerDetails.loanRequired) {
        const amount = Number(customerDetails.loanRequired.replace(/,/g, ''));
        if (!isNaN(amount)) {
            determineLevel(amount);
            setFormattedLoanRequired(formatAmountWithCommas(customerDetails.loanRequired));
        }
    }
}, [customerDetails]);


const [documentType, setDocumentType] = useState('');
const [loanType, setLoanType] = useState('');
const [documentStatus, setDocumentStatus] = useState('');
const [cibilRecord, setCibilRecord] = useState('');

    // FETCH LOAN TYPES IN MASTER  

    const [loanTypes, setLoanTypes] = useState([]);

    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/loan-types');
                setLoanTypes(response.data);
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        fetchLoanTypes();
    }, []);

    // FETCH DOCUMENT TYPE FROM MASTER 

    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState('');

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/document-type');
                setDocumentTypes(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error('Error fetching document types:', error);
            }
        };

        fetchDocumentTypes();
    }, []);

    const handleDocumentTypeChange = (event) => {
        setSelectedDocumentType(event.target.value);
    };






<Row className="Row1 view-row-size">
<Col lg={2}><span className="customer-sentence">Document</span></Col>
<Col>
    <div className="d-flex align-items-center">
        <Form.Check
            type="radio"
            label="In Hand"
            name="documentStatus"
            className='me-3'

            value="In Hand"
            checked={documentStatus === 'In Hand'}
            onChange={(e) => setDocumentStatus(e.target.value)}
        />
        <Form.Check
            type="radio"
            label="Not In Hand"
            name="documentStatus"
            value="Not In Hand"
            checked={documentStatus === 'Not In Hand'}
            onChange={(e) => setDocumentStatus(e.target.value)}
        />
    </div>
</Col>
</Row>
<Row className="Row1 view-row-size">
<Col lg={2}><span className="customer-sentence">Document Type</span></Col>
<Col>
    <select value={selectedDocumentType} onChange={handleDocumentTypeChange} className='it-returns box'>
        <option value={documentType} className='box'>Select Document Type</option>
        {documentTypes.map((docType) => (
            <option key={docType._id} value={docType.type} >
                {docType.type}
            </option>
        ))}
    </select>
</Col>
</Row>
<Row className="Row1 view-row-size">
<Col lg={2}><span className="customer-sentence">Cibil Record</span></Col>
<Col>
    <input
        type='number'
        className="box"
        value={cibilRecord}
        onChange={(e) => setCibilRecord(e.target.value)}
    />
</Col>
</Row>
<Row className='Row1 view-row-size'>
<Col lg={2} ><span className="customer-sentence" >Loan</span></Col>
<Col>
    <div className="d-flex align-items-center">
        <Form.Check
            type="radio"
            label="Secured"
            name="loanType"
            className='me-3'
            value="Secured"
            checked={loanType === 'Secured'}
            onChange={(e) => setLoanType(e.target.value)}
        />
        <Form.Check
            type="radio"
            label="Unsecured"
            name="loanType"
            value="Unsecured"
            checked={loanType === 'Unsecured'}
            onChange={(e) => setLoanType(e.target.value)}
        />
    </div>
</Col>
</Row>




<Row className="Row1 view-row-size">
<Col lg={2}><span className="customer-sentence">Loan</span></Col>
<Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.loanType}</div></Col>
</Row>

<Row className="Row1 view-row-size">
<Col lg={2}><span className="customer-sentence">Cibil Score</span></Col>
<Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.cibilRecord}</div></Col>
</Row>

<Row className="Row1 view-row-size">
                                                    <Col lg={2}><span className="customer-sentence">Document</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.documentStatus}</div></Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={2}><span className="customer-sentence">Document Type</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.documentType}</div></Col>
                                                </Row>





<div>
                                    <select value={selectedDocumentType} onChange={handleDocumentTypeChange} className='it-returns box'>
                                        <option value={documentTypes} className='box'>Select Document Type</option>
                                        {Unsecured_documentTypes.map((docType) => (
                                            <option key={docType._id} value={docType.type} >
                                                {docType.type}
                                            </option>
                                        ))}
                                    </select>
                                </div>