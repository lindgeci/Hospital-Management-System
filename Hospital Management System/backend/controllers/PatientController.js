const Patient = require('../models/Patient');
const { Op } = require('sequelize');
const Visit = require('../models/Visits');
const FindAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching all patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const Room = require('../models/Room');

const FindRoomCostByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch the room associated with the patient
        const room = await Room.findOne({
            where: { Patient_ID: patientId }
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found for this patient' });
        }

        // Return the room cost
        res.json({ Room_Cost: room.Room_cost });
    } catch (error) {
        console.error('Error fetching room cost:', error);
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
const Medicine = require('../models/Medicine');
const FindMedicineCostByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch medicines associated with the patient
        const medicines = await Medicine.findAll({
            where: { Patient_ID: patientId }
        });

        if (!medicines.length) {
            return res.status(404).json({ error: 'No medicines found for this patient' });
        }

        // Extract the costs
        const costs = medicines.map(medicine => medicine.M_Cost);

        res.json({ costs });
    } catch (error) {
        console.error('Error fetching medicine cost:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const FindEmailByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Fetch the patient by ID
        const patient = await Patient.findByPk(patientId, {
            attributes: ['Email'] // Only fetch the Email field
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Return the email
        res.json({ Email: patient.Email });
    } catch (error) {
        console.error('Error fetching patient email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const CheckPatientVisit = async (req, res) => {
    try {
        const { id } = req.params; // Get the patient ID from the request parameters

        // Check if the patient has any visits
        const visits = await Visit.findAll({
            where: { Patient_ID: id } // Query visits for the specific patient ID
        });

        if (visits.length > 0) {
            res.json({ hasVisit: true,  }); // Return true if visits are found
        } else {
            res.json({ hasVisit: false }); // Return false if no visits are found
        }
    } catch (error) {
        console.error('Error checking patient visits:', error);
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
    FindPatientByPersonalNumber,
    FindRoomCostByPatientId,
    FindMedicineCostByPatientId,
    FindEmailByPatientId,
    CheckPatientVisit
};
