import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, Select, FormHelperText, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CreateInsurance({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Ins_Code: '',
        End_Date: '',
        Provider: '',
        Dental: '',

    });
    const [patients, setPatients] = useState([]);
    const [insurance, setInsurance] = useState([]);
    const [patientPhone, setPatientPhone] = useState(''); // New state for the patient's phone
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // If the selected patient changes, fetch the new patient's phone
        if (name === 'Patient_ID') {
            fetchPatientPhone(value);
        }
    };

    useEffect(() => {
        fetchPatients();
        fetchInsurance();
        const patientId = location.state?.patientId;
        if (patientId) {
            setFormData((prevState) => ({ ...prevState, Patient_ID: patientId }));
            fetchPatientPhone(patientId); // Fetch phone number for the selected patient
        }
    }, [location.state]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatients(response.data);
            if (response.data.length === 1) {
                setFormData(prev => ({ ...prev, Patient_ID: response.data[0].Patient_ID })); // Auto-select if only one patient
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const fetchInsurance = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/insurance', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setInsurance(response.data);
        } catch (error) {
            console.error('Error fetching insurance:', error);
        }
    };

    const fetchPatientPhone = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:9004/api/patient/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatientPhone(response.data.Phone); // Assuming the response contains the Phone field
        } catch (error) {
            console.error('Error fetching patient phone:', error);
        }
    };
    const handleAddInsurance = async () => {
        try {
            await axios.post("http://localhost:9004/api/insurance/create", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/insurance');
            window.location.reload();
        } catch (error) {
            console.error('Error adding insurance:', error);
            showAlert('Error adding insurance. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleValidation = async () => {
        const { Patient_ID, Ins_Code, End_Date, Provider, Dental } = formData;
    
        // Check for required fields
        if (!Patient_ID || !Ins_Code || !End_Date || !Provider || !Dental) {
            showAlert('All fields are required!');
            return;
        }
    
        // Validate Ins_Code length
        if (Ins_Code.length !== 7) {
            showAlert("Ins_Code must be 7 characters long");
            return;
        }
    
        // Validate Ins_Code should not start with 0
        if (Ins_Code.startsWith('0')) {
            showAlert("Please remove the leading 0 from the Ins_Code.");
            return;
        }
    
        // Check if the insurance code already exists across all patients
        const existingInsuranceWithCode = insurance.find(ins => ins.Ins_Code === Ins_Code);
        if (existingInsuranceWithCode) {
            showAlert('This insurance code is already in use.');
            return;
        }
    
        // Check if insurance already exists for this patient
        const existingInsuranceForPatient = insurance.find(ins => ins.Patient_ID === Patient_ID);
        if (existingInsuranceForPatient) {
            showAlert('This patient already has insurance records. Please choose a different patient.');
            return;
        }
    
        // Validate End_Date (cannot be in the past)
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const selectedEndDate = new Date(End_Date).setHours(0, 0, 0, 0);
        if (selectedEndDate < currentDate) {
            showAlert('End date cannot be in the past.');
            return;
        }
    
        // Check if Patient_ID exists
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddInsurance();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };
    
    

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
    <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
        {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
        <Typography variant="h6" component="h1" gutterBottom>Add Insurance</Typography>
        <FormControl fullWidth margin="dense">
            <InputLabel id="patient-select-label">Patient</InputLabel>
            <Select
                labelId="patient-select-label"
                id="Patient_ID"
                name="Patient_ID"
                value={formData.Patient_ID}
                label="Patient"
                onChange={handleChange}
            >
                <MenuItem value=""><em>Select Patient</em></MenuItem>
                {patients.map((patient) => (
                    <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                        {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>Select the patient for this insurance</FormHelperText>
        </FormControl>
        <TextField
            fullWidth
            label="Insurance Code"
            variant="outlined"
            margin="dense"
            name="Ins_Code"
            value={formData.Ins_Code}
            onChange={handleChange}
            type="number"
            helperText="Enter the insurance code (7 characters long)"
        />
        <TextField
            fullWidth
            type="date"
            label="End Date"
            variant="outlined"
            margin="dense"
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }} // Prevent dates before today
            helperText="Select the end date for the insurance"
        />
        <TextField
            margin="dense"
            fullWidth
            select
            label="Provider"
            variant="outlined"
            id="Provider"
            name="Provider"
            value={formData.Provider}
            onChange={handleChange}
            helperText="Select if a provider is assigned"
        >
            <MenuItem value=''>Select Yes/No</MenuItem>
            <MenuItem value='No'>No</MenuItem>
            <MenuItem value='Yes'>Yes</MenuItem>
        </TextField>
        <TextField
            margin="dense"
            fullWidth
            select
            label="Dental"
            variant="outlined"
            id="Dental"
            name="Dental"
            value={formData.Dental}
            onChange={handleChange}
            helperText="Select if dental coverage is included"
        >
            <MenuItem value=''>Select Yes/No</MenuItem>
            <MenuItem value='No'>No</MenuItem>
            <MenuItem value='Yes'>Yes</MenuItem>
        </TextField>
        <TextField
            fullWidth
            label="Patient Phone"
            variant="outlined"
            margin="dense"
            value={patientPhone}
            readOnly
            helperText="This is the phone number of the selected patient"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
    </Box>
</Modal>

    );
}

export default CreateInsurance;
