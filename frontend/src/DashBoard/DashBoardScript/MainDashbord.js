import React from 'react'
import HeaderDashbord from './HeaderDashbord'
import CutomerDasboarChart from './CutomerDasboarChart'
import Header_SectionThird from './Header_SectionThird'
import LoanLevelChart from './LoanLevelChart'
import ChartComponent from './ChartComponent'
const MainDashbord = () => {
  return (
    <div>
    <HeaderDashbord />
    <CutomerDasboarChart />
     <Header_SectionThird /> 
    <ChartComponent  /> 
   <LoanLevelChart />

    </div>
  )
}

export default MainDashbord