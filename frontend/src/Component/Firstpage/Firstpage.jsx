import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import thimg from '../Firstpage/loan-5.webp'
import './Firstpage.css';
import Button from 'react-bootstrap/Button';

function Firstpage() {
  return (
    < >
      <Container fluid style={{ padding: '0px' }}>


        <Row className='firstpage'  >

          <Col lg={6} sm={6} md={6} >
            <div className='firstpageh1'>
              <h1 >Get A Loan To Cover Your All Bills </h1>
              <p >A loan is when money is given to another party in exchange for repayment of the loan principal amount plus interest.
                Lenders will consider a prospective borrower's income, credit score, and debt levels before deciding to offer them a loan.
                A loan may be secured by collateral, such as a mortgage, or it may be unsecured, such as a credit card.
                Revolving loans or lines can be spent, repaid, and spent again, while term loans are fixed-rate, fixed-payment loans.
                Lenders may charge higher interest rates to risky borrowers.</p>

              <Button className=''>Get Started</Button>

            </div>
          </Col>
          <Col lg={6} sm={6} md={6} >
            <div className='firstpage2'>
              <Image className='firsthimg' src={thimg} rounded />
            </div>
          </Col  >
        </Row>
      </Container>
    </>
  );
}

export default Firstpage;