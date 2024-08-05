import React from "react";
export const Ourteam = (props) => {
    return (
        <header id="ourteam" style={{paddingBottom: '15px', backgroundImage: `url('path_to_your_background_image.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="text-center  mt-5 mb-3" style={{ fontWeight: 'bold', color:"#145693" }}>OUR TEAM</h1>
                            <p className="text-left  mb-5" style={{ fontSize: '16px',color:'#777' }}>
                                Our team is our greatest asset. Comprised of talented and experienced professionals,
                                we bring a wealth of knowledge and expertise to every project. Meet the people who make it all happen.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="text-left  mb-4" style={{ color: "#145693" }}>Why Choose Us?</h3>
                            <div className="text-left " >
                                <p className="mb-3" style={{ textAlign: 'left', color: "#145693" }}>With UKS InfoTech Solution, you get a partner who is dedicated to your success. We offer:</p>
                                <div className="col-xs-12 col-md-6">
                                    <ul className="list-unstyled" style={{ textAlign: 'left', fontSize: '15px',color:'#777' }}>
                                        <li className="mb-2"><i className="fas  text-success me-2"></i> - Customized IT solutions tailored to your business needs</li>
                                        <li className="mb-2"><i className="fas text-success me-2"></i> - A proven track record of successful projects</li>
                                        <li className="mb-2"><i className="fas  text-success me-2"></i> - 24/7 support and maintenance services</li>
                                        <li className="mb-2"><i className="fas  text-success me-2"></i> - Competitive pricing and flexible plans</li>
                                    </ul>
                                </div>

                            </div>

                        </div>
                        <div className="row">
                        <div className="col-md-11">
                            <p className=" text-left" style={{ fontSize: '16px',paddingLeft:'8px',color:'#777' }}>
                                Join us on our journey to make technology work for you. Contact us today to learn more about how we can help your business thrive.
                            </p>
                        </div>
                        </div>

                    </div>

                </div>



            </div>
        </header>
    );
};
