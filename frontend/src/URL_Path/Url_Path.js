import React from 'react';
import { MdArrowForwardIos, MdHome } from 'react-icons/md';
import './Url_Path.css'
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const PathnameUrlPath = ({ location, homepage }) => (
    <div className="pathname-url-path">
        {/* <strong>Current URL Path: </strong> */}
        {location.pathname.split('/').map((part, index) => (
            <React.Fragment key={index}>
                {index > 0 && (
                    <span className="pathname-url-separator">
                        <MdArrowForwardIos className='pathname-url-arrow' />
                    </span>
                )}
                <span className="pathname-url-part">
                    {part ? capitalizeFirstLetter(part) : (
                        <MdHome size={30} className='pathname-url-home' onClick={homepage} />
                    )}
                </span>
                <hr></hr>
            </React.Fragment>
        ))}
        <hr/>
    </div>
);

export default PathnameUrlPath;
