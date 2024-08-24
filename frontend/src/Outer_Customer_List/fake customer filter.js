// import React, { useState, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";
// import axios from "axios";
// import './CustomerFilter.css';

// function CustomerFilter({ onFilter, loanRangeCounts = {}, locations = [], locationCounts = {} }) {
//     const [location, setLocation] = useState([]);
//     const [selectedRanges, setSelectedRanges] = useState([]);
//     const [typeOfLoan, setTypeOfLoan] = useState([]); // Track selected loan types
//     const [showMore, setShowMore] = useState(false);
//     const [loanTypes, setLoanTypes] = useState([]);

//     const loanRanges = [
//         { label: "0-3 Lakhs", min: 0, max: 300000 },
//         { label: "3-6 Lakhs", min: 300000, max: 600000 },
//         { label: "6-10 Lakhs", min: 600000, max: 1000000 },
//         { label: "10-15 Lakhs", min: 1000000, max: 1500000 },
//     ];

//     const moreLoanRanges = [
//         { label: "15-25 Lakhs", min: 1500000, max: 2500000 },
//         { label: "25-50 Lakhs", min: 2500000, max: 5000000 },
//         { label: "50-75 Lakhs", min: 5000000, max: 7500000 },
//         { label: "75-100 Lakhs", min: 7500000, max: 10000000 },
//         { label: "1-5 Cr", min: 10000000, max: 50000000 },
//         { label: "5-15 Cr", min: 50000000, max: 150000000 },
//         { label: "15-50 Cr", min: 150000000, max: 5000000000 }
//     ];

//     const handleRangeChange = (range) => {
//         setSelectedRanges(prevSelected => {
//             if (prevSelected.includes(range.label)) {
//                 return prevSelected.filter(r => r !== range.label);
//             } else {
//                 return [...prevSelected, range.label];
//             }
//         });
//     };

//     const handleLocationChange = (loc) => {
//         setLocation(prevSelected => {
//             if (prevSelected.includes(loc)) {
//                 return prevSelected.filter(l => l !== loc);
//             } else {
//                 return [...prevSelected, loc];
//             }
//         });
//     };

//     const handleLoanTypeChange = (loanTypeId) => {
//         setTypeOfLoan(prevSelected => {
//             if (prevSelected.includes(loanTypeId)) {
//                 // Remove the loan type if it was already selected
//                 return prevSelected.filter(id => id !== loanTypeId);
//             } else {
//                 // Add the loan type to the selected list
//                 return [...prevSelected, loanTypeId];
//             }
//         });
//     };

//     useEffect(() => {
//         axios.get('https://uksinfotechsolution.in:8000/api/loan-types')
//             .then(response => {
//                 setLoanTypes(response.data.map(type => ({
//                     value: type.id,
//                     label: type.type
//                 })));
//             })
//             .catch(error => {
//                 console.error('Failed to fetch loan types:', error);
//             });
//     }, []);

//     const handleFilter = () => {
//         const selectedRangeObjects = selectedRanges.map(label => {
//             const range = loanRanges.concat(moreLoanRanges).find(r => r.label === label);
//             return range || { min: 0, max: Infinity };
//         });

//         onFilter({
//             selectedLocations: location,
//             selectedRanges: selectedRangeObjects,
//             typeOfLoan: typeOfLoan,
//         });
//     };

//     return (
//         <div className="filter-box">
//             <h4>All Filters</h4>
//             <hr />
//             {/* Location Filter */}
//             <Form.Group>
//                 <Form.Label className="Filter-head">Location</Form.Label>
//                 <br /><br />
//                 {locations.map(loc => (
//                     <div key={loc} className="checkbox-container">
//                         <input
//                             type="checkbox"
//                             id={loc}
//                             checked={location.includes(loc)}
//                             onChange={() => handleLocationChange(loc)}
//                         />
//                         <label htmlFor={loc}>
//                             {loc} ({locationCounts[loc] || 0})
//                         </label>
//                     </div>
//                 ))}
//             </Form.Group>

//             {/* Loan Required Filter */}
//             <br />
//             <Form.Group>
//                 <Form.Label className="Filter-head">Loan Required</Form.Label>
//                 <br /><br />
//                 {loanRanges.map(range => (
//                     <div key={range.label} className="checkbox-container">
//                         <input
//                             type="checkbox"
//                             id={range.label}
//                             checked={selectedRanges.includes(range.label)}
//                             onChange={() => handleRangeChange(range)}
//                         />
//                         <label htmlFor={range.label}>
//                             <span>{range.label}</span>
//                             <span className="filter-count">({loanRangeCounts[range.label] || 0})</span>
//                         </label>
//                     </div>
//                 ))}
//                 {showMore && moreLoanRanges.map(range => (
//                     <div key={range.label} className="checkbox-container">
//                         <input
//                             type="checkbox"
//                             id={range.label}
//                             checked={selectedRanges.includes(range.label)}
//                             onChange={() => handleRangeChange(range)}
//                         />
//                         <label htmlFor={range.label}>
//                             <span>{range.label}</span>
//                             <span className="filter-count">({loanRangeCounts[range.label] || 0})</span>
//                         </label>
//                     </div>
//                 ))}
//                 <Button
//                     variant="link"
//                     onClick={() => setShowMore(!showMore)}
//                 >
//                     {showMore ? "View Less" : "View More"}
//                 </Button>
//             </Form.Group>
//             <br />

//             {/* Type of Loan Filter */}
//             <Form.Group>
//                 <Form.Label className="Filter-head">Type of Loan</Form.Label>
//                 <br /><br />
//                 {loanTypes.map((type) => (
//                     <div key={type.value} className="checkbox-container">
//                         <input
//                             type="checkbox"
//                             id={`loanType-${type.value}`}
//                             checked={typeOfLoan.includes(type.value)}
//                             onChange={() => handleLoanTypeChange(type.value)}
//                         />
//                         <label htmlFor={`loanType-${type.value}`}>{type.label}</label>
//                     </div>
//                 ))}
//             </Form.Group>

//             {/* Apply Filter Button */}
//             <Button variant="primary" onClick={handleFilter} className="filter-button">
//                 Apply Filters
//             </Button>
//         </div>
//     );
// }

// export default CustomerFilter;
