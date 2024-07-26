import { Container } from "react-bootstrap";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import DSA_Package_List from "./DSA_Package_List";

function UKS_Dashboard() {
    const { isSidebarExpanded } = useSidebar();

    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <DSA_Package_List/>
            </Container>
        </>
    );
}

export default UKS_Dashboard