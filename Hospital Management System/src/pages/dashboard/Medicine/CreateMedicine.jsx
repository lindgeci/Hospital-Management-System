import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, TextField, Button, FormHelperText, Typography, MenuItem, InputAdornment } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateMedicine({ onClose }) {
    const [formData, setFormData] = useState({
        M_name: '',
        M_Quantity: '',
        M_Cost: '',
    });

    const [medicines, setMedicines] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const medicineCosts = {
        Aspirin: 5,
        Ibuprofen: 7,
        Acetaminophen: 4,
        Amoxicillin: 10,
        Metformin: 8,
        Lisinopril: 6,
        Simvastatin: 9,
        Omeprazole: 12,
        Levothyroxine: 15,
        Sertraline: 11,
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/medicine', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Calculate cost whenever medicine name or quantity changes
        if (name === 'M_name' || name === 'M_Quantity') {
            calculateCost(name === 'M_name' ? value : formData.M_name, name === 'M_Quantity' ? value : formData.M_Quantity);
        }
    };

    const calculateCost = (selectedName, selectedQuantity) => {
        if (selectedName && selectedQuantity) {
            const costPerUnit = medicineCosts[selectedName];
            const totalCost = parseFloat(selectedQuantity) * costPerUnit;
            setFormData((prevState) => ({
                ...prevState,
                M_Cost: totalCost.toFixed(2),
            }));
        }
    };

    const handleAddMedicine = async () => {
        try {
            await axios.post('http://localhost:9004/api/medicine/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/dashboard/medicines');
            window.location.reload();
        } catch (error) {
            console.error('Error adding medicine:', error);
            showAlert('Error adding medicine. Please try again.');
        }
    };

    const handleValidation = () => {
        const { M_name, M_Quantity, M_Cost } = formData;

        if (!M_name.trim() || M_Quantity === '' || M_Cost === '') {
            showAlert('All fields are required');
            return;
        }
        if (M_name.length < 2) {
            showAlert('Name cannot be less than 2 characters');
            return;
        }
        if (M_Quantity < 1) {
            showAlert('Quantity cannot be less than 1');
            return;
        }
        if (M_Cost < 1) {
            showAlert('Cost cannot be less than 1');
            return;
        }

        const existingMedicine = medicines.find(medicine => medicine.M_name === M_name);
        if (existingMedicine) {
            showAlert('Medicine with the same name already exists');
            return;
        }

        handleAddMedicine();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
    <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
        {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
        <Typography variant="h6" component="h1" gutterBottom>Add Medicine</Typography>
        <Box mb={2}>
            <TextField
                fullWidth
                select
                label="Medicine Name"
                variant="outlined"
                id="M_name"
                name="M_name"
                value={formData.M_name}
                onChange={handleChange}
            >
                <MenuItem value='' disabled>Select Medicine</MenuItem>
                {Object.keys(medicineCosts).map(medicine => (
                    <MenuItem key={medicine} value={medicine}>{medicine}</MenuItem>
                ))}
            </TextField>
            <FormHelperText>Select the medicine you want to add</FormHelperText>
        </Box>
        <Box mb={2}>
            <TextField
                fullWidth
                select
                label="Quantity"
                variant="outlined"
                id="M_Quantity"
                name="M_Quantity"
                value={formData.M_Quantity}
                onChange={handleChange}
            >
                {[...Array(10)].map((_, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                    </MenuItem>
                ))}
            </TextField>
            <FormHelperText>Select the quantity of the medicine</FormHelperText>
        </Box>
        <Box mb={2}>
            <TextField
                fullWidth
                label="Cost"
                variant="outlined"
                id="M_Cost"
                name="M_Cost"
                type="text"
                value={formData.M_Cost}
                readOnly
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
            />
            <FormHelperText>This cost is calculated based on selected medicine and quantity</FormHelperText>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
    </Box>
</Modal>
    );
}

export default CreateMedicine;
