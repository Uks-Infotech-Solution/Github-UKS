import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { SidebarProvider } from './Customer/Navbar/SidebarContext';
import CustomerLogin from './Customer/Login/Customer-login';
import DsaLogin from './DSA/DSA-login';
import Profile_View from './Customer-Dashboard/Customer-Profile/Basic_View';
import AuthenticatedLayout from './Customer/Navbar/AuthenticateLayout';
import Profile_Download from './Customer-Dashboard/Customer-Profile/Profile_Download';
import DSA_Register from './DSA/DSA_register';
import DSA_Updation from './DSA/DSA_Updation';
import Index_Navbar from '../src/Indexpage/Navbar/Index-Navbar';
import DashbordUserLogin from './DashBoard/Dashbordlogin/Employee_Login';
import DashboardUserRegister from './DashBoard/Dashbordlogin/Employee_Register';
import AllComponentFlie from './Component/AllComponentFlie';
import PricingBox from './Component/PricingBox/PricingBox';
import MainDashbord from './DashBoard/DashBoardScript/MainDashbord';
import Section_1 from './Indexpage/Section-1/Section-1';
import Customer_Dashboard from './Customer_Dashboard/Customer-Dashboard';
import Dsa_Profile_View from './DSA/Dsa_dwnload_customer';
import DsaTable from './Customer_Dashboard/DSA_Table_view';
import Customer_Login_Dashboard from './Customer_Dashboard/Customer_Login_Dashboard';
import UKS_Activate from './DashBoard/Dashbordlogin/UKS_Activate';
import DSA_Activate from './DSA/DSA_Activate';
import Customer_Activate from './Indexpage/Section-1/Customer_Activate';
import DSA_ForgotPassword from './DSA/DSA_ForgotPassword';
import DSA_ResetPassword from './DSA/DSA_ResetPassword';
import Customer_ForgotPassword from './Customer/Login/Customer_ForgotPassword';
import Customer_ResetPassword from './Customer/Login/Customer_ResetPassword';
import UKS_ForgotPassword from './DashBoard/Dashbordlogin/UKS_ForgotPassword';
import UKS_ResetPassword from './DashBoard/Dashbordlogin/UKS_ResetPassword';
import DSA_AddressForm from './DSA/DSA_Address';
import DSA_Loan_Details from './DSA/DSA_Loan_Details';
import DSA_Detail_View from './Customer_Dashboard/DSA_Detail_View';
import LoanGridView from './Customer_Dashboard/Gride_View_page';
import Applied_Loan_View from './Customer_Dashboard/Applied_Loan_view';
import Login_Authenticate from './Authenticate/Login_Authenticate';
import DSA_Login_Dashboard from './DSA/DSA_Dashboard/DSA_Dashboard';
import Applied_Customer_View from './DSA/DSA_Dashboard/Applied_Customer_View';
import DSA_LoanGridView from './DSA/DSA_Dashboard/DSA_Grid_View';
import Pricing_Details from './DashBoard/Pricing_Input';
import UKS_Dashboard from './DashBoard/UKS_Dashboard';
import Package_Activate from './Component/PricingBox/Package_Activation';
import DSA_Packager_View from './DashBoard/DSA_Packager_Activate';
import DocumentTypeForm from './Master/Document_Type';
import Unsecured_DocumentTypeForm from './Master/Unsecured_DocumentType';
import Loan_Level from './Master/Loan_Level';
import Loan_Types from './Master/Loan_Types';
import File_Status from './Master/File_Status';
import Required_Type from './Master/Required_Type';
import Applied_Customer_List from './DSA/DSA_Dashboard/Applied_Customers_List';
import CustomerTable from './DSA/DSA_Dashboard/Customer_List';
import Customer_reg from './Sales_Person/Customer_Reg/Customer_reg';
import Customer from './Sales_Person/Customer_Menu';
import DSA from './Sales_Person/DSA_Menu';

import Uks_Loan_Applications from './DashBoard/Customer/Uks_Loan_Applications';
import UKS_DSA_List from './DashBoard/DSA/Uks_DSA_List';
import DSA_Package_List from './DashBoard/DSA_Package_List';
import Homeapp from './Website/Homeapp';
import Employee_Type from './Master/Employee_Type';
import Sales_Cus_List from './Sales_Person/Customer_Reg/Sales_Cus_List';
import Sales_Dsa_list from './Sales_Person/DSA_Reg/Sales_Dsa_List';
import Sales_Person_dashboard from './Sales_Person/Sales_Person_Dashboard';
import Sales_Packagers from './Sales_Person/Sales_Packagers';
import Applied_Loan from './Customer_Dashboard/Applied_Loan';
import Purchased_Package from './DSA/DSA_Dashboard/Purchase_Package';
import Customer_Missing_Details from './DashBoard/Customer/Uks_Customer_Pending';
import Customer_Updation from './Customer-Dashboard/Customer-Profile/Customer_Updation';
import Uks_Customer_Updation from './DashBoard/Customer/Uks_Customer_Updation';
import Dsa_Total_Customers from './DSA/DSA_Dashboard/Total_Customers';
import Dsa_pending_List from './DashBoard/DSA/Uks_DSA_Pendin_Total_List';
import Enquiry from './Enquiry_Details_Customer/Enquiry_Form';
import EnquiryList from './Enquiry_Details_Customer/Enquiry_List';
import DSA_Enquiry from './Enquiry_Details_DSA/DSA_Enquiry_Form';
import DSA_EnquiryList from './Enquiry_Details_DSA/DSA_Enquiry_List';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<IndexWithNavbar element={<Homeapp />} />} />
          <Route path="/ldp/finserv" element={<IndexWithNavbar element={<AllComponentFlie />} />} />
          <Route path="/uks/register" element={<IndexWithNavbar element={<DashboardUserRegister />} />} />
          <Route path="/uks/login" element={<IndexWithNavbar element={<DashbordUserLogin />} />} />
          <Route path="/uks/forget/password" element={<UKS_ForgotPassword />} />
          <Route path="/uks/reset/password/:token" element={<UKS_ResetPassword />} />
          <Route path="/uks/pricing/input" element={<IndexWithNavbar element={<Pricing_Details />} />} />


          <Route path="/customer/login" element={<IndexWithNavbar element={<CustomerLogin />} />} />
          <Route path="/customer/register" element={<IndexWithNavbar element={<Section_1 />} />} />
          <Route path="/customer/activate/:token" element={<IndexWithNavbar element={<Customer_Activate />} />} />
          <Route path="/customer/forget/password" element={<Customer_ForgotPassword />} />
          <Route path="/customer/reset/password/:token" element={<Customer_ResetPassword />} />

          <Route path="/dsa/login" element={<IndexWithNavbar element={<DsaLogin />} />} />
          <Route path="/dsa/register" element={<IndexWithNavbar element={<DSA_Register />} />} />
          <Route path="/dsa/activate/:token" element={<DSA_Activate />} />
          <Route path="/dsa/forget/password" element={<DSA_ForgotPassword />} />
          <Route path="/dsa/reset/password/:token" element={<DSA_ResetPassword />} />


          <Route path="/package/activate/:token" element={<Package_Activate />} />

          <Route path="/*" element={<OtherPages />} />
          {/* <Route path="/customer/updatecustomer" element={<UpdateCustomer />} /> */}

        </Routes>
      </SidebarProvider>
    </Router>
  );

  function OtherPages() {
    return (
      <>
        <AuthenticatedLayout>
          <Routes>
            {/* CUSTOMER */}
            <Route path="/customer/profile/download" element={<Profile_Download />} />
            <Route path="/customer/profile/view" element={<Customer_Updation />} />

            {/* Customer DashBoard */}
            <Route path="/customer-dashboard" element={<Customer_Login_Dashboard />} />
            <Route path="/dsa/detail/view" element={<DSA_Detail_View />} />
            <Route path="/dsa/grid/view" element={<LoanGridView />} />
            <Route path="/Customer/Applied/dsalist" element={<Applied_Loan_View />} />
            <Route path="/Dsa/List" element={<DsaTable />} />
            <Route path="/Applied/Loan/List" element={<Applied_Loan />} />


            <Route path="/:loginType/login" element={<Login_Authenticate />} />



            <Route path="/customer/dashboard" element={<Customer_Dashboard />} />
            <Route path="/dashboard" element={<MainDashbord />} />


            {/* DSA Dashboard */}
            <Route path="/dsa/dashboard" element={<DSA_Login_Dashboard />} />
            <Route path="/applied/customer/view" element={<Applied_Customer_View />} />
            <Route path="/customer/grid/view" element={<DSA_LoanGridView />} />
            <Route path="/customer/list" element={<CustomerTable />} />
            <Route path="/dsa/total/customers" element={<Dsa_Total_Customers />} />
            <Route path="/applied/customer/list" element={<Applied_Customer_List />} />

            <Route path="/dsa/updation" element={<DSA_Updation />} />
            <Route path="/dsa/address" element={<DSA_AddressForm />} />
            <Route path="/dsa/loan/details" element={<DSA_Loan_Details />} />
            <Route path="/pricing" element={<PricingBox />} />
            <Route path="/purchased/package" element={<Purchased_Package />} />


            <Route path="/dsa/customer/download" element={<Dsa_Profile_View />} />

            <Route path="/uks/activate/:token" element={<UKS_Activate />} />
            <Route path="/uks/customer/list" element={<Customer_Missing_Details />} />
            <Route path="/uks/customer/detail/view" element={<Uks_Customer_Updation />} />
            <Route path="/uks/loan/appliation" element={<Uks_Loan_Applications />} />
            <Route path="/uks/dsa/pending/list" element={<Dsa_pending_List />} />
            <Route path="/uks/dsa/list" element={<UKS_DSA_List />} />
            <Route path="/uks/dashboard" element={<UKS_Dashboard />} />
            <Route path="/dsa/package/activate" element={<DSA_Packager_View />} />
            <Route path="/dsa/package/list" element={<DSA_Package_List />} />

            {/* SALES PERSON */}
            <Route path="/sales/person/dashboard" element={<Sales_Person_dashboard />} />
            <Route path="/customer/reg" element={<Customer />} />
            <Route path="/dsa/reg" element={<DSA />} />
            <Route path="/sales/customer/list" element={<Sales_Cus_List />} />
            <Route path="/sales/dsa/list" element={<Sales_Dsa_list />} />
            <Route path="/sales/packagers" element={<Sales_Packagers />} />


            {/* MASTERS */}
            <Route path="/add/pricing" element={<Pricing_Details />} />
            <Route path="/documentType" element={<DocumentTypeForm />} />
            <Route path="/unsecured/documentType" element={<Unsecured_DocumentTypeForm />} />
            <Route path="/loanlevel" element={<Loan_Level />} />
            <Route path="/loantype" element={<Loan_Types />} />
            <Route path="/filestatus" element={<File_Status />} />
            <Route path="/dsa/requiredtype" element={<Required_Type />} />
            <Route path="/employee/type" element={<Employee_Type />} />


            {/* ENQUIRY_DETAILS */}
            <Route path="/enquiry/form" element={<Enquiry />} />
            <Route path="/dsa/enquiry/form" element={<DSA_Enquiry />} />
            <Route path="/dsa/enquiry/list" element={<DSA_EnquiryList />}/>
            <Route path="/enquiry/list" element={<EnquiryList />} />

          </Routes>
        </AuthenticatedLayout>
        <Routes>
          <Route path="/uks/login" element={<DashbordUserLogin />} />


        </Routes>
      </>
    );
  }

  function IndexWithNavbar({ element }) {
    const location = useLocation();
    const showNavbar = ['/ldp/finserv', '/dsa/login', '/package/activate/:token', '/customer/login', '/uks/register', '/uks/login', '/dsa/register', '/customer/register'].includes(location.pathname);
    return (
      <>
        {showNavbar && <Index_Navbar />}
        {element}
      </>
    );
  }
}

export default App;
