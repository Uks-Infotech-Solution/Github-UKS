import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EnquiryList.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const EnquiryList = () => {
  const [contacts, setContacts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState(''); // Added state for filter
  const [statusCounts, setStatusCounts] = useState({}); // State for status counts
  const location = useLocation();
  const { uksId } = location.state || {};
  const { isSidebarExpanded } = useSidebar();

  const navigate = useNavigate();
  const [currentContact, setCurrentContact] = useState({
    _id: null,
    name: '',
    contactNumber: '',
    email: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchStatusCounts(); // Fetch counts on component mount and filter change
  }, [filterStatus]); // Add filterStatus as a dependency

  const fetchContacts = () => {
    const statusQuery = filterStatus ? `?status=${filterStatus}` : '';
    axios.get(`https://uksinfotechsolution.in:8000/api/enquiries${statusQuery}`)
      .then(response => setContacts(response.data))
      .catch(error => console.error('There was an error fetching contacts!', error));
  };

  const fetchStatusCounts = () => {
    axios.get('https://uksinfotechsolution.in:8000/api/enquiries/counts')
      .then(response => setStatusCounts(response.data))
      .catch(error => console.error('There was an error fetching status counts!', error));
  };

  const handleEdit = (contact) => {
    setEditing(true);
    setCurrentContact(contact);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      axios.delete(`https://uksinfotechsolution.in:8000/api/enquiries/${id}`, {
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
    navigate('/customer/reg', { state: { uksId, contactNumber: contact.contactNumber, contactId: contact._id } });
};


  const handleChange = (e) => {
    setCurrentContact({ ...currentContact, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://uksinfotechsolution.in:8000/api/enquiries/${currentContact._id}`, currentContact)
      .then(response => {
        setContacts(contacts.map(contact =>
          contact._id === currentContact._id ? response.data : contact
        ));
        setEditing(false);
        setCurrentContact({ _id: null, name: '', contactNumber: '', email: '' });
        alert('Contact Updated Successfully');
      })
      .catch(error => {
        console.error('There was an error updating the contact!', error);
        alert('Error updating contact');
      });
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
            <th>Contact Number</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{index + 1}</td>
              <td>{new Date(contact.createdAt).toLocaleDateString('en-GB')}</td>
              <td>{contact.name}</td>
              <td>{contact.contactNumber}</td>
              <td>{contact.email}</td>
              <td>{contact.enquiry_convert_status}</td>
              <td className="enquiry-actions">
                <button onClick={() => handleEdit(contact)} className="enquiry-button enquiry-button-edit">Edit</button>
                <button onClick={() => handleDelete(contact._id)} className="enquiry-button enquiry-button-delete">Delete</button>
                <button onClick={() => handleConvert(contact)} className="enquiry-button enquiry-button-convert">Convert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <form onSubmit={handleUpdate} className="enquiry-edit-form">
          <h3>Edit Contact</h3>
          <input
            type="text"
            name="name"
            value={currentContact.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="enquiry-input"
          />
          <input
            type="text"
            name="contactNumber"
            value={currentContact.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="enquiry-input"
          />
          <input
            type="email"
            name="email"
            value={currentContact.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="enquiry-input"
          />
          <div className="enquiry-form-buttons">
            <button type="submit" className="enquiry-button enquiry-button-update">Update</button>
            <button type="button" onClick={() => setEditing(false)} className="enquiry-button enquiry-button-cancel">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EnquiryList;
