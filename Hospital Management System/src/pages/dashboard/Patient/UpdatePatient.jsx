import axios from 'axios';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function UpdatePatient({ id, onClose }) {
    const [formData, setFormData] = useState({
        Personal_Number: '',
        Patient_Fname: '',
        Patient_Lname: '',
        Birth_Date: '',
        Blood_type: '',
        Email: '',
        Gender: '',
        Phone: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Personal_Number: data.Personal_Number,
                    Patient_Fname: data.Patient_Fname,
                    Patient_Lname: data.Patient_Lname,
                    Birth_Date: data.Birth_Date,
                    Blood_type: data.Blood_type,
                    Email: data.Email,
                    Gender: data.Gender,
                    Phone: data.Phone
                });
            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };

        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchAllPatients();
    }, [token]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdatePatient = async () => {
        try {
            const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Phone } = formData;
    
            const personalNumberStr = String(Personal_Number); // Convert Personal_Number to string for comparison
    
            if (!Patient_Fname.trim() || !Patient_Lname.trim() || !Blood_type.trim() || !Email.trim() || !Gender.trim() || !Phone.trim()) {
                showAlert('All fields are required.');
                return;
            }
    
            const validateEmail = (email) => {
                const re = /^[^\s@]+@[^\s@]+\.(com|ubt-uni\.net)$/;
                return re.test(String(email).toLowerCase());
            };
    
            if (!validateEmail(Email)) {
                showAlert('Email must end with @ubt-uni.net or .com');
                return;
            }
            
    
            const validateName = (name) => /^[A-Za-z]+$/.test(name);
    
            if (!validateName(Patient_Fname)) {
                showAlert('First Name can only contain letters');
                return;
            }
    
            if (!validateName(Patient_Lname)) {
                showAlert('Last Name can only contain letters');
                return;
            }
    
            // Check for an existing patient with the same Personal Number, excluding the current patient by ID
            const existingPatientWithPersonalNumber = patients.find(patient => String(patient.Personal_Number) === personalNumberStr && patient.Patient_ID !== id);
            if (existingPatientWithPersonalNumber) {
                showAlert('Patient with the same Personal Number already exists.');
                return;
            }
    
            // Check for an existing patient with the same Email, excluding the current patient by ID
            const existingPatientWithEmail = patients.find(patient => patient.Email === Email && patient.Patient_ID !== id);
            if (existingPatientWithEmail) {
                showAlert('Patient with the same Email already exists.');
                return;
            }
    
            // Check for an existing patient with the same Phone, excluding the current patient by ID
            const existingPatientWithPhone = patients.find(patient => patient.Phone === Phone && patient.Patient_ID !== id);
            if (existingPatientWithPhone) {
                showAlert('Patient with the same Phone number already exists.');
                return;
            }
    
            // Proceed with the update if no validation issues are found
            await axios.put(`http://localhost:9004/api/patient/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            navigate('/dashboard/patient');
            window.location.reload();
    
        } catch (error) {
            console.error('Error updating patient:', error);
            showAlert('An error occurred while updating the patient. Please try again later.');
        }
    };
    

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Update Patient</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Personal Number"
                    variant="outlined"
                    id="Personal_Number"
                    name="Personal_Number"
                    type="number"
                    placeholder="Enter Personal Number"
                    value={formData.Personal_Number}
                    onChange={handleChange}

                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="First Name"
                    variant="outlined"
                    id="Patient_Fname"
                    name="Patient_Fname"
                    placeholder="Enter Firstname"
                    value={formData.Patient_Fname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    variant="outlined"
                    id="Patient_Lname"
                    name="Patient_Lname"
                    placeholder="Enter Lastname"
                    value={formData.Patient_Lname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Birth Date"
                    variant="outlined"
                    type="date"
                    id="Birth_Date"
                    name="Birth_Date"
                    value={formData.Birth_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        id="Gender"
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        label="Gender"
                        disabled
                    >
                        <MenuItem value=""><em>Select Gender</em></MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="blood-type-select-label">Blood Type</InputLabel>
                    <Select
                        labelId="blood-type-select-label"
                        id="Blood_type"
                        name="Blood_type"
                        value={formData.Blood_type}
                        onChange={handleChange}
                        label="Blood Type"
                        disabled
                    >
                        <MenuItem value=""><em>Select Blood Type</em></MenuItem>
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    placeholder="Enter email"
                    value={formData.Email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    variant="outlined"
                    id="Phone"
                    name="Phone"
                    placeholder="Enter Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdatePatient} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdatePatient;
