import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; 

function CreateAppointment({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        Date: '',
        Time: '',
        Scheduled_On: '',
    });
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [staff, setStaff] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
        fetchStaff();
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

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/doctors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

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

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/appointment', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddAppointment = async () => {
        try {
            await axios.post('http://localhost:9004/api/appointment/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/appointments');
            window.location.reload();
        } catch (error) {
            console.error('Error adding appointment:', error);
            showAlert('Error adding appointment. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, Date, Time, Scheduled_On } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || Date === '' || Time === '' || Scheduled_On === '') {
            showAlert('All fields are required.');
            return;
        }

        if (!Date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showAlert('Please enter a valid date (YYYY-MM-DD).');
            return;
        }

        if (!Time.match(/^\d{2}:\d{2}$/)) {
            showAlert('Please enter a valid time (HH:MM).');
            return;
        }

        try {
            // Proceed with form submission
            await handleAddAppointment();
        } catch (error) {
            console.error('Error adding appointment:', error);
            showAlert('Error adding appointment. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setShowErrorModal(false);
        }, 3000);
    };

        return (
            <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                    <Typography variant="h6" component="h1" gutterBottom>Add Appointment</Typography>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="patient-select-label">Patient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            id="visitPatientID"
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
                    </FormControl>
                    <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="doctor-select-label">Doctor</InputLabel>
                    <Select
                        labelId="doctor-select-label"
                        id="visitDoctorID"
                        name="Doctor_ID"
                        value={formData.Doctor_ID}
                        onChange={handleChange}
                        label="Doctor"
                    >
                        <MenuItem value=""><em>Select Doctor</em></MenuItem>
                        {doctors.map(doctor => (
                            <MenuItem key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                {`${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
        
                {/* Date */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date"
                    variant="outlined"
                    type="date"
                    id="Date"
                    name="Date"
                    value={formData.Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                {/* Time */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Time"
                    variant="outlined"
                    type="time"
                    id="Time"
                    name="Time"
                    value={formData.Time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                 <TextField
                    fullWidth
                    margin="normal"
                    label="Scheduled_On"
                    variant="outlined"
                    type="datetime-local"
                    id="Scheduled_On"
                    name="Scheduled_On"
                    value={formData.Scheduled_On}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />


                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateAppointment;

