
const styles = StyleSheet.create({
    page: {
      padding: 10,
      flexDirection: 'column',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    fullcontainer: {
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      borderWidth: 2,
      padding: 30,
    },
    container: {
      marginBottom: 20,
    },
    headingmain: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 20
    },
    heading: {
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 10
    },
    row: {
      flexDirection: 'row',
      display: 'flex',
      marginBottom: 5,
    },
    label: {
      width: '30%',
      marginRight: 12,
      fontWeight: 'bold',
      fontSize: 11,
      flexShrink: 0,
      // maxWidth: '30%',
    },
    value: {
      fontSize: 10,
      marginLeft: 10,
      flexGrow: 1,
      maxWidth: '40%',

    },
    addressContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    addressSection: {
      marginRight: 10,
      boxSizing: 'border-box',
    },
    label2: {
      width: '40%',
      marginRight: 15,
      fontWeight: 'bold',
      fontSize: 11,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: '#bdbdbd',
      borderCollapse: 'collapse',
    },
    tableRow: {
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: '#bdbdbd',
    },
    tableHeader: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: '#bdbdbd',
      backgroundColor: '#f0f0f0',
      padding: 5,
      fontWeight: 'bold',
      fontSize: 12,
      wordWrap: true,
    },
    tableCell: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 0.5,
      borderColor: '#bdbdbd',
      padding: 5,
      fontSize: 10,
      wordWrap: true,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 10,
      position: 'absolute',
      marginLeft: '400px',
    },
    cibil: {
      position: 'absolute',
      marginLeft: '400px',
      marginTop: '110px',
      width: '30%',
      marginRight: 12,
      fontWeight: 'bold',
      fontSize: 11,
    },
    cibil2: {
      position: 'absolute',
      marginLeft: '455px',
      marginTop: '110px',
      fontSize: 10,
      wordWrap: true,
    },
    itvalue: {
      fontSize: 10,
      marginLeft: 10,
      flexGrow: 1,
      maxWidth: '80%',
    },
  });
const genrepdf = async (customer) => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.fullcontainer}>
            <View style={styles.container}>

              {profilePictures && (
                <Image style={styles.image} src={profilePictures}
                />
              )}
              <Text style={styles.cibil}>Cibil Score</Text>
              <Text style={styles.cibil2}>: {loanProcessingDetails?.cibilRecord}</Text>
              <Text style={styles.headingmain} className='Main-head'>Customer Profile Report</Text>
              <Text style={styles.heading} className='Main-head'>Customer Details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Customer Type     </Text>
                <Text style={styles.value}>:    UKS-CU-{customer.customerNo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Customer Type     </Text>
                <Text style={styles.value}>:    {customer.customerType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>:    {customer.title}.{customer.customerFname} {customer.customerLname}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>:    {customer.gender}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Mobile Number</Text>
                <Text style={styles.value}>:    {customer.customercontact}, {customer.customeralterno}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Whatsapp Number</Text>
                <Text style={styles.value}>:    {customer.customerwhatsapp}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>E-Mail</Text>
                <Text style={styles.value}>:    {customer.customermailid}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Type Of Loan</Text>
                <Text style={styles.value}>:    {customer.typeofloan}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Loan Required</Text>
                <Text style={styles.value}>:    (customer.loanRequired)</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Loan Level</Text>
                <Text style={styles.value}>:    (customer.level)</Text>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.addressSection}>
                <Text style={styles.heading}>Aadhar Address</Text>
                <View style={styles.row}>
                  <Text style={styles.label2}>State</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharState}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>District</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharDistrict}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>City</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharCity}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Area</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharStreet}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Door No</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharDoorNo}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Postal Code</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.aadharZip}</Text>
                </View>
              </View>
              <View style={styles.addressSection}>
                <Text style={styles.heading}>Permanent Address</Text>
                <View style={styles.row}>
                  <Text style={styles.label2}>State</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentState}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>District</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentDistrict}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>City</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentCity}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Area</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentStreet}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Door No</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentDoorNo}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label2}>Postal Code</Text>
                  <Text style={styles.value}>:    {addresses[customer.customermailid]?.permanentZip}</Text>
                </View>
              </View>
            </View>
            {/* {previousLoanDetails[0]?.financeName !== 'No previous loan' && (
              <View style={styles.container}>
                <Text style={styles.heading}>Previous Loan Details</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeader}>Finance Name</Text>
                    <Text style={styles.tableHeader}>Year of Loan</Text>
                    <Text style={styles.tableHeader}>Loan Amount</Text>
                    <Text style={styles.tableHeader}>Outstanding Amount</Text>
                  </View>
                  {previousLoanDetails.map((loan, index) => (
                    <View style={styles.tableRow} key={index}>
                      <Text style={styles.tableCell}>{loan.financeName}</Text>
                      <Text style={styles.tableCell}>{loan.yearOfLoan}</Text>
                      <Text style={styles.tableCell}>{loan.loanAmount}</Text>
                      <Text style={styles.tableCell}>{loan.outstandingAmount}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {customer.customerType === 'Salaried Person' && (
              <>
                <View style={styles.container}>
                  <Text style={styles.heading}>Salaried Persons Details</Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableHeader}>Applicant Type</Text>
                      <Text style={styles.tableHeader}>Applicant Name</Text>
                      <Text style={styles.tableHeader}>Designation</Text>
                      <Text style={styles.tableHeader}>Total Experience</Text>
                    </View>
                    {salariedPersons.map((salariedPerson, index) => (
                      <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{salariedPerson.companyName}</Text>
                        <Text style={styles.tableCell}>{salariedPerson.role}</Text>
                        <Text style={styles.tableCell}>{salariedPerson.monthlySalary}</Text>
                        <Text style={styles.tableCell}>{salariedPerson.workExperience}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )} */}
            <View style={styles.container}>
              <Text style={styles.heading}>Loan Processing Details</Text>
              <View style={styles.row}>
                <Text style={styles.label}>IT Returns</Text>
                <Text style={styles.itvalue}>
                  :    {loanProcessingDetails?.itReturns && loanProcessingDetails.itReturns.length > 0
                    ? loanProcessingDetails.itReturns.join(' / ')
                    : ''}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Check Bounds Status</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.checkBounds}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Customer Block Status</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.blockStatus}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Customer File Status</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.fileStatus}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Loan</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.loanType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cibil Score</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.cibilRecord}</Text>
              </View>
              {customer.customerType === 'Business' && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Monthly Income</Text>
                    <Text style={styles.value}>:    {loanProcessingDetails?.monthlyIncome}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>MSNE Reg.No</Text>
                    <Text style={styles.value}>:    {loanProcessingDetails?.msneNo}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>GST No</Text>
                    <Text style={styles.value}>:    {loanProcessingDetails?.gstNo}</Text>
                  </View>
                </>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Document</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.documentStatus}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Document Type</Text>
                <Text style={styles.value}>:    {loanProcessingDetails?.documentType}</Text>
              </View>
            </View>

          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, 'customer_profile_report.pdf');
};


  {/* <td>
                      <FaFileDownload
                        style={{ color: '#0d447d', cursor: 'pointer' }}
                        onClick={() => genrepdf(customer)}
                      />
                    </td> */}
