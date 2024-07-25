// Layout.js
import React from 'react';
import Index_Navbar from './Index-Navbar';
 // Adjust the path as necessary

const IndexLayout = ({ children }) => {
    return (
        <div>
            <Index_Navbar/>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default IndexLayout;
