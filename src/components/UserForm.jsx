import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
  
  const UserForm = ({ open, handleClose, handleSave, editData }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [ownership, setOwnership] = useState('');
    const [govtIdType, setGovtIdType] = useState('');
    const [govtId, setGovtId] = useState('');
    const [category, setCategory] = useState('');
    const [load, setLoad] = useState('');
    const [applicationDate, setApplicationDate] = useState('');
    const [approvalDate, setApprovalDate] = useState('');
    const [modifiedDate, setModifiedDate] = useState('');
    const [status, setStatus] = useState('');
    const [reviewerId, setReviewerId] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerComments, setReviewerComments] = useState('');
  
    useEffect(() => {
      if (editData) {
        setName(editData.Applicant_Name);
        setGender(editData.Gender);
        setDistrict(editData.District);
        setState(editData.State);
        setPincode(editData.Pincode);
        setOwnership(editData.Ownership);
        setGovtIdType(editData.GovtID_Type);
        setGovtId(editData.ID_Number);
        setCategory(editData.Category);
        setLoad(editData.Load_Applied);
        setApplicationDate(editData.Date_of_Application);
        setApprovalDate(editData.Date_of_Approval);
        setModifiedDate(editData.Modified_Date);
        setStatus(editData.Status);
        setReviewerId(editData.Reviewer_ID);
        setReviewerName(editData.Reviewer_Name);
        setReviewerComments(editData.Reviewer_Comments);
      }
    }, [editData]);
  
    const handleSubmit = () => {
      const newUser = {
        ID: editData ? editData.ID : Date.now().toString(), // Unique ID if adding
        Applicant_Name: name,
        Gender: gender,
        District: district,
        State: state,
        Pincode: pincode,
        Ownership: ownership,
        GovtID_Type: govtIdType,
        ID_Number: govtId,
        Category: category,
        Load_Applied: load,
        Date_of_Application: editData ? applicationDate : new Date().toLocaleDateString(),
        Date_of_Approval: approvalDate,
        Modified_Date: modifiedDate,
        Status: status,
        Reviewer_ID: reviewerId,
        Reviewer_Name: reviewerName,
        Reviewer_Comments: reviewerComments,
      };
      handleSave(newUser);
      handleClose();
    };
  
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editData ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Applicant Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Gender"
            fullWidth
            select
            variant="outlined"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            margin="dense"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            label="District"
            fullWidth
            variant="outlined"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            margin="dense"
          />
          <TextField
            label="State"
            fullWidth
            variant="outlined"
            value={state}
            onChange={(e) => setState(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Pincode"
            fullWidth
            variant="outlined"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Ownership"
            fullWidth
            select
            variant="outlined"
            value={ownership}
            onChange={(e) => setOwnership(e.target.value)}
            margin="dense"
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Joint">Joint</MenuItem>
          </TextField>
          <TextField
            label="Govt ID Type"
            fullWidth
            select
            variant="outlined"
            value={govtIdType}
            onChange={(e) => setGovtIdType(e.target.value)}
            margin="dense"
          >
            <MenuItem value="AADHAR">AADHAR</MenuItem>
            <MenuItem value="PAN">PAN</MenuItem>
          </TextField>
          <TextField
            label="Government ID"
            fullWidth
            variant="outlined"
            value={govtId}
            onChange={(e) => setGovtId(e.target.value)}
            margin="dense"
            disabled={!!editData} // Disable when editing
          />
          <TextField
            label="Category"
            fullWidth
            select
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="dense"
          >
            <MenuItem value="Residential">Residential</MenuItem>
            <MenuItem value="Commercial">Commercial</MenuItem>
          </TextField>
          <TextField
            label="Load Applied (KV)"
            fullWidth
            variant="outlined"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Date of Application"
            fullWidth
            variant="outlined"
            value={applicationDate}
            margin="dense"
            disabled
          />
          <TextField
            label="Date of Approval"
            fullWidth
            variant="outlined"
            value={approvalDate}
            onChange={(e) => setApprovalDate(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Modified Date"
            fullWidth
            variant="outlined"
            value={modifiedDate}
            onChange={(e) => setModifiedDate(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Status"
            fullWidth
            select
            variant="outlined"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="dense"
          >
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
          <TextField
            label="Reviewer ID"
            fullWidth
            variant="outlined"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Reviewer Name"
            fullWidth
            variant="outlined"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            margin="dense"
          />
          <TextField
            label="Reviewer Comments"
            fullWidth
            variant="outlined"
            value={reviewerComments}
            onChange={(e) => setReviewerComments(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editData ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default UserForm;
  