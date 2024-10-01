import { Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default CSS for react-datepicker
import UserForm from '../components/UserForm'; // Assuming UserForm is in the same folder

// Styled component for top-right container
const TopRightContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
});

const StyledDatePicker = styled(DatePicker)({
  margin: '0 10px', // Adjust margin for proper spacing
  width: '250px', // Set a fixed width
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '10px',
  fontSize: '16px',
});

const SearchDateContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px', // Space between the DatePicker and the TextField
});

const ConnectionDashboard = ({ updateCharts }) => {
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users.json');
        const jsonData = await response.json();
        const storedData = localStorage.getItem('connections');
        const storedConnections = storedData ? JSON.parse(storedData) : [];
        const combinedData = [...jsonData, ...storedConnections];

        // Remove duplicates based on unique IDs
        const uniqueData = Array.from(new Set(combinedData.map(conn => conn.ID)))
          .map(id => combinedData.find(conn => conn.ID === id));

        setConnections(uniqueData);
        setFilteredConnections(uniqueData);
        updateCharts(uniqueData); // Pass data to update charts
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (connections.length > 0) {
      localStorage.setItem('connections', JSON.stringify(connections));
    }
    updateCharts(connections); // Update the charts on connection changes
  }, [connections]);

  useEffect(() => {
    const filtered = connections.filter((conn) => {
      const connApplicationDate = new Date(conn.Date_of_Application.split('/').reverse().join('-'));
      const isWithinDateRange = (startDate ? connApplicationDate >= startDate : true) &&
        (endDate ? connApplicationDate <= endDate : true);
      return (
        conn.ID.toString().includes(searchTerm.trim()) && isWithinDateRange
      );
    });
    setFilteredConnections(filtered);
  }, [searchTerm, startDate, endDate, connections]);

  const handleAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleSave = (user) => {
    const newId = connections.length ? Math.max(...connections.map(conn => conn.ID)) + 1 : 1;
    const updatedUser = editData ? user : { ...user, ID: newId };

    if (editData) {
      const updatedConnections = connections.map((conn) =>
        conn.ID === user.ID ? updatedUser : conn
      );
      setConnections(updatedConnections);
    } else {
      setConnections((prev) => [...prev, updatedUser]);
    }
    setOpenDialog(false);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    const updatedConnections = connections.filter((conn) => conn.ID !== id);
    setConnections(updatedConnections);
  };

  const columns = [
    { field: 'ID', headerName: 'ID', width: 90 },
    { field: 'Applicant_Name', headerName: 'Applicant Name', width: 150 },
    { field: 'Gender', headerName: 'Gender', width: 100 },
    { field: 'District', headerName: 'District', width: 130 },
    { field: 'State', headerName: 'State', width: 130 },
    { field: 'Pincode', headerName: 'Pincode', width: 120 },
    { field: 'Ownership', headerName: 'Ownership', width: 130 },
    { field: 'GovtID_Type', headerName: 'Govt ID Type', width: 130 },
    { field: 'ID_Number', headerName: 'ID Number', width: 150 },
    { field: 'Category', headerName: 'Category', width: 150 },
    { field: 'Load_Applied', headerName: 'Load Applied (KV)', width: 160 },
    { field: 'Date_of_Application', headerName: 'Date of Application', width: 160 },
    { field: 'Date_of_Approval', headerName: 'Date of Approval', width: 160 },
    { field: 'Modified_Date', headerName: 'Modified Date', width: 160 },
    { field: 'Status', headerName: 'Status', width: 130 },
    { field: 'Reviewer_ID', headerName: 'Reviewer ID', width: 130 },
    { field: 'Reviewer_Name', headerName: 'Reviewer Name', width: 160 },
    { field: 'Reviewer_Comments', headerName: 'Reviewer Comments', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleEdit(params.row)}
            style={{ marginRight: '10px' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.ID)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Electricity Connection Dashboard</h2>

      <TopRightContainer>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add User
        </Button>
        <SearchDateContainer>
          <StyledDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select Start Date"
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
          />
          <StyledDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Select End Date"
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
          />
          <TextField
            label="Search by Application ID"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
        </SearchDateContainer>
      </TopRightContainer>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredConnections}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.ID}
        />
      </div>

      <UserForm
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleSave={handleSave}
        editData={editData}
      />
    </div>
  );
};

export default ConnectionDashboard;
