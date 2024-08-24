import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './CustomerFilter.css';

function CustomerFilter({ onFilter, loanRangeCounts = {}, locations = [], locationCounts = {}, loanTypes = [], loanTypeCounts }) {
    const [location, setLocation] = useState([]);
    const [selectedRanges, setSelectedRanges] = useState([]);
    const [typeOfLoan, setTypeOfLoan] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [showMoreLocations, setShowMoreLocations] = useState(false);
    // console.log(loanTypeCounts);

    const loanRanges = [
        { label: "0-3 Lakhs", min: 0, max: 300000 },
        { label: "3-6 Lakhs", min: 300000, max: 600000 },
        { label: "6-10 Lakhs", min: 600000, max: 1000000 },
        { label: "10-15 Lakhs", min: 1000000, max: 1500000 },
        { label: "15-25 Lakhs", min: 1500000, max: 2500000 }
    ];

    const moreLoanRanges = [
        { label: "25-50 Lakhs", min: 2500000, max: 5000000 },
        { label: "50-75 Lakhs", min: 5000000, max: 7500000 },
        { label: "75-100 Lakhs", min: 7500000, max: 10000000 },
        { label: "1-5 Cr", min: 10000000, max: 50000000 },
        { label: "5-15 Cr", min: 50000000, max: 150000000 },
        { label: "15-50 Cr", min: 150000000, max: 5000000000 }
    ];

    const handleRangeChange = (range) => {
        setSelectedRanges(prevSelected => {
            if (prevSelected.includes(range.label)) {
                return prevSelected.filter(r => r !== range.label);
            } else {
                return [...prevSelected, range.label];
            }
        });
    };

    const handleLocationChange = (loc) => {
        setLocation(prevSelected => {
            if (prevSelected.includes(loc)) {
                return prevSelected.filter(l => l !== loc);
            } else {
                return [...prevSelected, loc];
            }
        });
    };

    const handleFilter = () => {
        const selectedRangeObjects = selectedRanges.map(label => {
            const range = loanRanges.concat(moreLoanRanges).find(r => r.label === label);
            return range || { min: 0, max: Infinity };
        });

        onFilter({
            selectedLocations: location,
            selectedRanges: selectedRangeObjects,
            typeOfLoan
        });
    };
    const handleTypeOfLoanChange = (loanType) => {
        setTypeOfLoan(prevSelected => {
            if (prevSelected.includes(loanType)) {
                return prevSelected.filter(l => l !== loanType);
            } else {
                return [...prevSelected, loanType];
            }
        });
    };
    console.log(locations);

    return (
        <div className="filter-box">
            <h4 >All Filters</h4>
            <hr />
            {/* Location Filter */}
            {/* Location Filter */}
            <Form.Group>
                <Form.Label className="Filter-head">Location</Form.Label>
                <br />
                <br />

                {locations.slice(0, 6).map(loc => (
                    <div key={loc} className="checkbox-container">
                        <input
                            type="checkbox"
                            id={loc}
                            checked={location.includes(loc)}
                            onChange={() => handleLocationChange(loc)}
                        />
                        <label htmlFor={loc}>
                            {loc} ({locationCounts[loc] || 0})
                        </label>
                    </div>
                ))}

                {locations.length > 6 && (
                    <div>
                        <Button
                            variant="link"
                            onClick={() => setShowMoreLocations(!showMoreLocations)}
                        >
                            {showMoreLocations ? "View Less" : "View More"}
                        </Button>
                        {showMoreLocations && locations.slice(6).map(loc => (
                            <div key={loc} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id={loc}
                                    checked={location.includes(loc)}
                                    onChange={() => handleLocationChange(loc)}
                                />
                                <label htmlFor={loc}>
                                    {loc} ({locationCounts[loc] || 0})
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </Form.Group>

            {/* Loan Required Filter */}
            <br />

            <Form.Group>
                <Form.Label className="Filter-head">Loan Required</Form.Label>
                <br />
                <br />
                {loanRanges.map(range => (
                    <div key={range.label} className="checkbox-container">
                        <input
                            type="checkbox"
                            id={range.label}
                            checked={selectedRanges.includes(range.label)}
                            onChange={() => handleRangeChange(range)}
                        />
                        <label htmlFor={range.label}>
                            <span>{range.label}</span>
                            <span className="filter-count">({loanRangeCounts[range.label] || 0})</span>
                        </label>
                    </div>
                ))}
                {showMore && moreLoanRanges.map(range => (
                    <div key={range.label} className="checkbox-container">
                        <input
                            type="checkbox"
                            id={range.label}
                            checked={selectedRanges.includes(range.label)}
                            onChange={() => handleRangeChange(range)}
                        />
                        <label htmlFor={range.label}>
                            <span>{range.label}</span>
                            <span className="filter-count">({loanRangeCounts[range.label] || 0})</span>
                        </label>
                    </div>
                ))}
                <Button
                    variant="link"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? "View Less" : "View More"}
                </Button>
            </Form.Group>
            <br />

            {/* Type of Loan Filter */}
            <Form.Group>
                <Form.Label className="Filter-head">Type of Loan</Form.Label>
                <br />
                <br />

                {loanTypes.map((loanType, index) => (
                    <div key={index} className="checkbox-container">
                        <input
                            type="checkbox"
                            id={loanType}
                            checked={typeOfLoan.includes(loanType)}
                            onChange={() => handleTypeOfLoanChange(loanType)}
                        />
                        <label htmlFor={loanType}>
                            {loanType} ({loanTypeCounts[loanType] || 0})
                        </label>
                    </div>
                ))}
            </Form.Group>

            {/* Apply Filter Button */}
            <Button variant="primary" onClick={handleFilter} className="filter-button">
                Apply Filters
            </Button>
        </div>
    );
}

export default CustomerFilter;
