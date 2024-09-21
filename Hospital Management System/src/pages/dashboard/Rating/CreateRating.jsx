import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, FormHelperText } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CreateRating({ onClose }) {
    const [formData, setFormData] = useState({
        Emp_ID: '',
        Rating: '',
        Comments: '',
        Date: new Date().toISOString().slice(0, 10), // Default to today's date
    });
    const [staff, setStaff] = useState([]);
    const [rating, setRatings] = useState([]);
    const [staffEmail, setStaffEmail] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 

    useEffect(() => {
        fetchStaff();
        fetchRating();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchRating = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/rating', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const fetchStaffEmail = async (empId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/staff/${empId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaffEmail(response.data.Email);
        } catch (error) {
            console.error('Error fetching staff email:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'Emp_ID') {
            fetchStaffEmail(value);
        }
    };

    const handleAddRating = async () => {
        try {
            await axios.post('http://localhost:9004/api/rating/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/rating');
            window.location.reload();
        } catch (error) {
            console.error('Error adding rating:', error);
            showAlert('Error adding rating. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Emp_ID, Rating, Comments } = formData;

        if (Emp_ID === '' || Rating === '' || !Comments.trim()) {
            showAlert('All fields are required');
            return;
        }
        if (Emp_ID < 1) {
            showAlert('Staff ID cannot be less than 1');
            return;
        }
        if (Comments.length > 30) {
            showAlert('Limit of characters reached (30)');
            return;
        }

        const existingRating = rating.find(rating => rating.Emp_ID === Emp_ID);
        if (existingRating) {
            showAlert('Employee has already been rated');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddRating();
        } catch (error) {
            console.error('Error checking employee ID:', error);
            showAlert('Employee ID does not exist');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Rating</Typography>
                
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Employee"
                    variant="outlined"
                    id="Emp_ID"
                    name="Emp_ID"
                    value={formData.Emp_ID}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select</MenuItem>
                    {staff.map((staff) => (
                        <MenuItem key={staff.Emp_ID} value={staff.Emp_ID}>
                            {`${staff.Emp_Fname} ${staff.Emp_Lname}`}
                        </MenuItem>
                    ))}
                </TextField>
                <FormHelperText>Select the staff member you want to rate</FormHelperText>

                <TextField
                    margin="normal"
                    fullWidth
                    label="Staff Email"
                    variant="outlined"
                    value={staffEmail}
                    readOnly
                    helperText="Email of the selected staff member"
                    disabled
                />
                    
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Rating"
                    variant="outlined"
                    id="Rating"
                    name="Rating"
                    value={formData.Rating}
                    onChange={handleChange}
                >
                    <MenuItem value='' disabled>Select Rating</MenuItem>
                    {[1, 2, 3, 4, 5].map(rating => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                    ))}
                </TextField>
                <FormHelperText>Select a rating between 1 and 5</FormHelperText>
                    
                <TextField
                    fullWidth
                    label='Comment'
                    variant='outlined'
                    margin='normal'
                    name='Comments'
                    value={formData.Comments}
                    onChange={handleChange}
                />
                <FormHelperText>Add any comments related to the rating (max 30 characters)</FormHelperText>

                <TextField
                    fullWidth
                    label='Date'
                    type='date'
                    variant='outlined'
                    margin='normal'
                    name='Date'
                    value={formData.Date}
                    onChange={handleChange}
                    disabled
                />
                <FormHelperText>This date is automatically set to today</FormHelperText>
                
                <div className="flex justify-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleValidation}
                        sx={{ mr: 1 }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default CreateRating;
