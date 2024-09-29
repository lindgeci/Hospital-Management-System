const Medicine = require('../models/Medicine');
const { Op } = require('sequelize');
const Patient = require('../models/Patient');
const getPatientByEmail = async (email) => {
    try {
        const patient = await Patient.findOne({
            where: { Email: email }
        });

        if (!patient) {
            throw new Error('Patient not found');
        }

        return patient;
    } catch (error) {
        console.error('Error fetching patient by email:', error);
        throw error;
    }
};
const FindAllMedicine = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let medicines;
        if (userRole === 'admin') {
            medicines = await Medicine.findAll({
                include: {
                    model: Patient
                },
            });
        } else if (userRole === 'patient') {
            const patient = await getPatientByEmail(userEmail);
            medicines = await Medicine.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: {
                    model: Patient
                },
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const medicinesDataWithNames = medicines.map(medicine => ({
            ...medicine.toJSON(),
            Patient_Name: medicine.Patient ? `${medicine.Patient.Patient_Fname} ${medicine.Patient.Patient_Lname}` : 'Unknown Patient'
        }));

        res.json(medicinesDataWithNames);
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        if (!medicine) {
            res.status(404).json({ error: 'Medicine not found' });
            return;
        }
        res.json(medicine);
    } catch (error) {
        console.error('Error fetching single medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddMedicine = async (req, res) => {
    try {
        const { M_name, M_Quantity, M_Cost, Patient_ID } = req.body;
        
        // Validate input fields
        if (!M_name || !M_Quantity || !M_Cost || !Patient_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (M_name.length < 2) {
            return res.status(400).json({ error: 'Medicine name must be at least 2 characters long' });
        }

        if (parseInt(M_Quantity) < 1 || isNaN(parseInt(M_Quantity))) {
            return res.status(400).json({ error: 'Medicine quantity must be at least 1' });
        }

        if (parseFloat(M_Cost) < 1 || isNaN(parseFloat(M_Cost))) {
            return res.status(400).json({ error: 'Medicine cost must be at least 1' });
        }

        // Check if the medicine already exists
        const existingMedicine = await Medicine.findOne({ where: { M_name } });
        if (existingMedicine) {
            return res.status(400).json({ error: 'Medicine with the same name already exists' });
        }

        // Check if the patient already has an existing medicine
        const patientMedicines = await Medicine.findAll({ where: { Patient_ID } });
        if (patientMedicines.length > 0) {
            return res.status(400).json({ error: 'This patient already has a medicine assigned' });
        }

        const newMedicine = await Medicine.create({
            M_name,
            M_Quantity,
            M_Cost,
            Patient_ID, // Add Patient_ID to the creation
        });
        
        res.json({ success: true, message: 'Medicine added successfully', data: newMedicine });
    } catch (error) {
        console.error('Error adding medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateMedicine = async (req, res) => {
    try {
        const { M_name, M_Quantity, M_Cost, Patient_ID } = req.body;

        // Validate input fields
        if (!M_name || !M_Quantity || !M_Cost || !Patient_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (M_name.length < 2) {
            return res.status(400).json({ error: 'Medicine name must be at least 2 characters long' });
        }

        if (parseInt(M_Quantity) < 1 || isNaN(parseInt(M_Quantity))) {
            return res.status(400).json({ error: 'Medicine quantity must be at least 1' });
        }

        if (parseFloat(M_Cost) < 1 || isNaN(parseFloat(M_Cost))) {
            return res.status(400).json({ error: 'Medicine cost must be at least 1' });
        }

        // Check if the patient already has a different medicine
        const existingMedicines = await Medicine.findAll({
            where: {
                Patient_ID,
                Medicine_ID: { [Op.ne]: req.params.id } // Exclude the current medicine being updated
            }
        });

        if (existingMedicines.length > 0) {
            return res.status(400).json({ error: 'This patient already has a medicine' });
        }

        // Check if another medicine with the same name exists, excluding the current one
        const existingMedicine = await Medicine.findOne({
            where: { M_name, Medicine_ID: { [Op.ne]: req.params.id } }
        });
        if (existingMedicine) {
            return res.status(400).json({ error: 'Medicine with the same name already exists' });
        }

        const updated = await Medicine.update(
            { M_name, M_Quantity, M_Cost, Patient_ID }, // Add Patient_ID to the update
            { where: { Medicine_ID: req.params.id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Medicine not found or not updated' });
        }

        res.json({ success: true, message: 'Medicine updated successfully' });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteMedicine = async (req, res) => {
    try {
        const deleted = await Medicine.destroy({
            where: { Medicine_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Medicine not found' });
            return;
        }
        res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllMedicine,
    FindSingleMedicine,
    AddMedicine,
    UpdateMedicine,
    DeleteMedicine,
};
