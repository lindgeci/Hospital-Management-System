const Patient = require('../models/Patient');
const { Op } = require('sequelize');
const FindAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching all patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSinglepatientPatient = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json(patient);
    } catch (error) {
        console.error('Error fetching single patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddPatient = async (req, res) => {
    try {
        const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Phone } = req.body;
        
        // Validation logic
        const personalNumberRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

        if (
            !Personal_Number.match(personalNumberRegex) ||
            !Patient_Fname ||
            !Patient_Lname ||
            !Birth_Date ||
            !Blood_type.match(bloodTypeRegex) ||
            !Email.match(emailRegex) ||
            !Gender ||
            !Phone.match(phoneRegex)
        ) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        // Check if email, phone, or personal number are already in use
        const existingPatient = await Patient.findOne({
            where: {
                [Op.or]: [
                    { Email: Email },
                    { Phone: Phone },
                    { Personal_Number: Personal_Number }
                ]
            }
        });

        if (existingPatient) {
            return res.status(400).json({ error: 'Email, phone number, or personal number already exists.' });
        }

        // Create new patient
        const newPatient = await Patient.create({
            Personal_Number,
            Patient_Fname,
            Patient_Lname,
            Birth_Date,
            Blood_type,
            Email,
            Gender,
            Phone
        });

        res.json({ success: true, message: 'Patient added successfully', data: newPatient });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const UpdatePatient = async (req, res) => {
    try {
        const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Phone } = req.body;

        // Check if the updated email, phone, or personal number already exists for another patient
        const existingPatient = await Patient.findOne({
            where: {
                [Op.or]: [
                    { Email: Email },
                    { Phone: Phone },
                    { Personal_Number: Personal_Number }
                ],
                Patient_ID: { [Op.ne]: req.params.id } // Exclude the current patient from the check
            }
        });

        if (existingPatient) {
            return res.status(400).json({ error: 'Email, phone number, or personal number already exists for another patient.' });
        }

        // Update patient details
        const updated = await Patient.update(
            { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Phone },
            { where: { Patient_ID: req.params.id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Patient not found or not updated' });
        }

        res.json({ success: true, message: 'Patient updated successfully' });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const DeletePatient = async (req, res) => {
    try {
        const deleted = await Patient.destroy({
            where: { Patient_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const CheckPatientExistence = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByPk(id);
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error checking patient existence:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindPatientByPersonalNumber = async (req, res) => {
    try {
        const { personalNumber } = req.params;
        const patient = await Patient.findOne({ where: { Personal_Number: personalNumber } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient by personal number:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    FindAllPatients,
    FindSinglepatientPatient,
    AddPatient,
    UpdatePatient,
    DeletePatient,
    CheckPatientExistence,
    FindPatientByPersonalNumber
};
