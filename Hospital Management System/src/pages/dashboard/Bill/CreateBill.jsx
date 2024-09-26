import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Select, MenuItem, InputLabel, FormHelperText, FormControl, Modal, TextField } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateBill({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Date_Issued: new Date().toISOString().split('T')[0],
        Description: '',
        Amount: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
        Payment_Status: 'Pending',
        Payment_Type: '' // Add Payment_Type to the state
    });
    const [patients, setPatients] = useState([]);
    const [patientPersonalNumber, setPatientPersonalNumber] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
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

    const fetchPatientPersonalNumber = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatientPersonalNumber(response.data.Personal_Number);
        } catch (error) {
            console.error('Error fetching patient personal number:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'Patient_ID') {
            fetchPatientPersonalNumber(value);
        }
    };

    const handleAddBill = async () => {
        try {
            await axios.post('http://localhost:9004/api/bills/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/bills');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Bill:', error);
            showAlert(error.response?.data?.message || 'Error adding bill. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Date_Issued, Description, Amount, Payment_Status } = formData;

        if (Patient_ID === '' || Date_Issued === '' || Description === '' || Amount === '' || Payment_Status === '') {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddBill();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
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
                <Typography variant="h6" component="h1" gutterBottom>Add Bill</Typography>

                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                        label="Patient"
                    >
                        <MenuItem value=""><em>Select Patient</em></MenuItem>
                        {patients.map(patient => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the patient for this bill</FormHelperText>
                </FormControl>

                {/* Patient Personal Number Field */}
                <TextField
                    fullWidth
                    label="Patient Personal Number"
                    variant="outlined"
                    margin="dense"
                    value={patientPersonalNumber}
                    readOnly
                    helperText="This is the personal number of the selected patient"
                />

                {/* Date Issued */}
                {/* <TextField
                    fullWidth
                    margin="dense"
                    label="Date Issued"
                    variant="outlined"
                    type="date"
                    id="Date_Issued"
                    name="Date_Issued"
                    value={formData.Date_Issued}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled
                    helperText="The date the bill was issued"
                /> */}

                {/* Description with Payment Type Dropdown */}
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="description-select-label">Description</InputLabel>
                    <Select
                        labelId="description-select-label"
                        id="Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        label="Description"
                    >
                        <MenuItem value=""><em>Select Description</em></MenuItem>
                        <MenuItem value="pagesa per kontrolle">Pagesa per Kontroll</MenuItem>
                        <MenuItem value="pagesa per terapi">Pagesa per Terapi</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                    </Select>
                    <FormHelperText>Select the type of payment for this bill</FormHelperText>
                </FormControl>

                {/* Amount */}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Amount"
                    variant="outlined"
                    type="number"
                    id="Amount"
                    name="Amount"
                    placeholder="Amount"
                    value={formData.Amount}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: 10, max: 50 }}
                    helperText="Amount should be between 10 and 50"
                />

                {/* Payment Status */}
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="payment-status-select-label">Payment Status</InputLabel>
                    <Select
                        labelId="payment-status-select-label"
                        id="Payment_Status"
                        name="Payment_Status"
                        value={formData.Payment_Status}
                        onChange={handleChange}
                        label="Payment Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                    <FormHelperText>Select the payment status of the bill (default is Pending)</FormHelperText>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateBill;
