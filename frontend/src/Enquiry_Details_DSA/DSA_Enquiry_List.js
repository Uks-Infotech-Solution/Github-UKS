import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EnquiryList.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import { Modal, Button, Form, DropdownButton, Dropdown } from 'react-bootstrap'; // Import React Bootstrap components
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'; // Import icons

const DSA_EnquiryList = () => {
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [statusCounts, setStatusCounts] = useState({});
  const [currentContact, setCurrentContact] = useState({
    _id: null,
    name: '',
    contactNumber: '',
    email: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page state

  const location = useLocation();
  const { uksId } = location.state || {};
  const { isSidebarExpanded } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
    fetchStatusCounts();
  }, [filterStatus, currentPage, rowsPerPage]); // Add pagination states as dependencies

  const fetchContacts = () => {
    const statusQuery = filterStatus ? `?status=${filterStatus}` : '';
    axios.get(`https://uksinfotechsolution.in:8000/api/dsa/enquiries${statusQuery}`)
      .then(response => setContacts(response.data))
      .catch(error => console.error('There was an error fetching contacts!', error));
  };

  const fetchStatusCounts = () => {
    axios.get('https://uksinfotechsolution.in:8000/api/dsa/enquiries/counts')
      .then(response => setStatusCounts(response.data))
      .catch(error => console.error('There was an error fetching status counts!', error));
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      axios.delete(`https://uksinfotechsolution.in:8000/api/dsa/enquiries/${id}`, {
        data: { uksId }
      })
        .then(() => {
          setContacts(contacts.filter(contact => contact._id !== id));
          alert('Contact marked as deleted successfully');
        })
        .catch(error => {
          console.error('There was an error marking the contact as deleted!', error);
          alert('Error marking contact as deleted');
        });
    }
  };

  const handleConvert = (contact) => {
    navigate('/dsa/reg', { state: { uksId, contactNumber: contact.contactNumber, contactId: contact._id } });
  };

  const handleChange = (e) => {
    setCurrentContact({ ...currentContact, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://uksinfotechsolution.in:8000/api/dsa/enquiry/${currentContact._id}`, currentContact)
      .then(response => {
        setContacts(contacts.map(contact =>
          contact._id === currentContact._id ? response.data : contact
        ));
        setEditing(false);
        setCurrentContact({ _id: null, name: '', contactNumber: '', email: '' });
        setShowModal(false);
        alert('Contact Updated Successfully');
      })
      .catch(error => {
        console.error('There was an error updating the contact!', error);
        alert('Error updating contact');
      });
  };

  // Pagination logic
  const indexOfLastContact = currentPage * rowsPerPage;
  const indexOfFirstContact = indexOfLastContact - rowsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (eventKey) => {
    setRowsPerPage(parseInt(eventKey));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <div className={`enquiry-container Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div className="enquiry-filter">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="enquiry-filter-select"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Converted">Converted</option>
          <option value="Deleted">Deleted</option>
        </select>
      </div>

      <div className="status-counts">
        <div className="status-box">Pending: {statusCounts.Pending || 0}</div>
        <div className="status-box">Converted: {statusCounts.Converted || 0}</div>
        <div className="status-box">Deleted: {statusCounts.Deleted || 0}</div>
      </div>

      <table className="enquiry-table">
        <thead>
          <tr>
            <th>SI No.</th>
            <th>Created Date</th>
            <th>Name</th>
            <th>Company Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{indexOfFirstContact + index + 1}</td>
              <td>{new Date(contact.createdAt).toLocaleDateString('en-GB')}</td>
              <td>{contact.dsaname}</td>
              <td>{contact.companyname}</td>
              <td>{contact.contactNumber}</td>
              <td>{contact.email}</td>
              <td>{contact.enquiry_convert_status}</td>
              <td>{contact.Remarks }</td>
              <td className="enquiry-actions">
                <button onClick={() => handleEdit(contact)} className="enquiry-button enquiry-button-edit">Edit</button>
                <button onClick={() => handleDelete(contact._id)} className="enquiry-button enquiry-button-delete">Delete</button>
                <button onClick={() => handleConvert(contact)} className="enquiry-button enquiry-button-convert">Convert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <div className="pagination">
          <span style={{ marginRight: '10px' }}>Rows per page:</span>
          <DropdownButton
            id="rowsPerPageDropdown"
            title={`${rowsPerPage}`}
            onSelect={handleRowsPerPageChange}
            className='table-row-per-button'
          >
            <Dropdown.Item eventKey="5">5</Dropdown.Item>
            <Dropdown.Item eventKey="10">10</Dropdown.Item>
            <Dropdown.Item eventKey="15">15</Dropdown.Item>
            <Dropdown.Item eventKey="20">20</Dropdown.Item>
          </DropdownButton>
          <MdKeyboardArrowLeft size={25} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          <span>Page {currentPage} of {Math.ceil(contacts.length / rowsPerPage)}</span>
          <MdKeyboardArrowRight size={25} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastContact >= contacts.length} />
        </div>
      </div>

      {/* Modal for Editing Contact */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="dsaname"
                value={currentContact.dsaname}
                onChange={handleChange}
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyname"
                value={currentContact.companyname}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </Form.Group>
            <Form.Group controlId="formContactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={currentContact.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentContact.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                name="Remarks"
                value={currentContact.Remarks}
                onChange={handleChange}
                placeholder="Remarks"
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary">Update</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)} className="ms-2">Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DSA_EnquiryList;
