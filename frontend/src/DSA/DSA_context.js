// CustomerContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export const DSAProvider = ({ children }) => {
    const [dsaCompanyName, setdsaCompanyName] = useState(localStorage.getItem('customerName') || '');
    const [dsaEmail, setCustomerEmail] = useState(localStorage.getItem('customerEmail') || '');
    const [customerDetails, setCustomerDetails] = useState(JSON.parse(localStorage.getItem('customerDetails')) || null);

    useEffect(() => {
        localStorage.setItem('customerName', customerName);
        localStorage.setItem('customerEmail', customerEmail);
        localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
    }, [customerName, customerEmail, customerDetails]);

    return (
        <CustomerContext.Provider value={{ customerName, setCustomerName, customerEmail, setCustomerEmail, customerDetails, setCustomerDetails }}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => useContext(CustomerContext);
