const Visit = require('../models/Visits');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const { Op, Sequelize } = require('sequelize'); 

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
const getDoctorByEmail = async (email) => {
    try {
        // Fetch the staff member with the given email
        const staff = await Staff.findOne({
            where: { Email: email } // Check the email in the Staff table
        });

        if (!staff) {
            throw new Error('Staff member not found');
        }

        // Fetch the doctor associated with the staff member
        const doctor = await Doctor.findOne({
            where: { Emp_ID: staff.Emp_ID } // Use Emp_ID to find the associated doctor
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor;
    } catch (error) {
        console.error('Error fetching doctor by email:', error);
        throw error;
    }
};


const FindAllVisits = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let visits;
        if (userRole === 'admin') {
            // Fetch all visits for admin
            visits = await Visit.findAll({
                include: [
                    {
                        model: Patient, // Include Patient details
                    },
                    {
                        model: Doctor,  // Include Doctor details
                        include: [
                            {
                                model: Staff, // Include Staff details for Doctor (to get name)
                                attributes: ['Emp_Fname', 'Emp_Lname']
                            }
                        ]
                    }
                ],
            });
        } else if (userRole === 'patient') {
            // Fetch visits for the logged-in patient
            const patient = await getPatientByEmail(userEmail);
            visits = await Visit.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: [
                    {
                        model: Patient, // Include Patient details
                    },
                    {
                        model: Doctor,  // Include Doctor details
                        include: [
                            {
                                model: Staff, // Include Staff details for Doctor (to get name)
                                attributes: ['Emp_Fname', 'Emp_Lname']
                            }
                        ]
                    }
                ],
            });
        } else if (userRole === 'doctor') {
            // Fetch visits for the logged-in doctor
            const doctor = await getDoctorByEmail(userEmail); // Fetch doctor based on email
            visits = await Visit.findAll({
                where: { Doctor_ID: doctor.Doctor_ID },
                include: [
                    {
                        model: Patient, // Include Patient details
                    },
                    {
                        model: Doctor,  // Include Doctor details for doctor-specific visits
                        include: [
                            {
                                model: Staff, // Include Staff details for Doctor (to get name)
                                attributes: ['Emp_Fname', 'Emp_Lname']
                            }
                        ]
                    }
                ],
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const visitsDataWithNames = visits.map(visit => ({
            ...visit.toJSON(),
            Patient_Name: visit.Patient ? `${visit.Patient.Patient_Fname} ${visit.Patient.Patient_Lname}` : 'Unknown Patient',
            Doctor_Name: visit.Doctor && visit.Doctor.Staff ? `${visit.Doctor.Staff.Emp_Fname} ${visit.Doctor.Staff.Emp_Lname}` : 'Unknown Doctor'
        }));

        res.json(visitsDataWithNames);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const FindSingleVisit = async (req, res) => {
    const { id } = req.params;
    try {
        const visit = await Visit.findByPk(id, {
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Doctor, attributes: ['Doctor_ID'], include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        res.json(visit);
    } catch (error) {
        console.error('Error fetching visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const createVisit = async (req, res) => {
    const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy, visit_id } = req.body;

    try {
        // Optional: Validate if the patient and doctor exist
        const patient = await Patient.findByPk(Patient_ID);
        const doctor = await Doctor.findByPk(Doctor_ID);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Validation: Ensure the date of visit is not in the past
        const currentDate = new Date();
        const visitDate = new Date(date_of_visit);

        if (visitDate < currentDate.setHours(0, 0, 0, 0)) {  // Sets current date to midnight (to compare only date)
            return res.status(400).json({ error: 'Cannot schedule a visit in the past' });
        }

        // Check if the patient already has a visit with the specified visit ID only if visit_id is provided
        const existingInsuranceWithCode = await Visit.findOne({ where: { Patient_ID } });
        if (existingInsuranceWithCode) {
            return res.status(400).json({ error: 'This patient already has an visit record.' });
        }

        const visit = await Visit.create({
            Patient_ID,
            Doctor_ID,
            date_of_visit,
            condition,
            diagnosis,
            therapy
        });

        res.status(201).json(visit);
    } catch (error) {
        console.error('Error creating visit:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const UpdateVisit = async (req, res) => {
    try {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = req.body;

        // Validation: Ensure the date of visit is not in the past
        const currentDate = new Date();
        const visitDate = new Date(date_of_visit);

        if (visitDate < currentDate.setHours(0, 0, 0, 0)) { // Sets current date to midnight (to compare only date)
            return res.status(400).json({ error: 'Cannot update to a date in the past' });
        }

        const updated = await Visit.update(
            { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy },
            { where: { Visit_ID: req.params.id } }
        );

        if (updated[0] === 0) {
            res.status(404).json({ error: 'Visit not found or not updated' });
            return;
        }

        const existingInsuranceForPatient = await Visit.findOne({
            where: {
                Patient_ID,
                Visit_ID: { [Op.ne]: req.params.id } // Exclude the current insurance being updated
            }
        });

        // If the patient already has insurance, prevent update
        if (existingInsuranceForPatient) {
            return res.status(400).json({ error: 'This patient already has an visit record.' });
        }

        res.json({ success: true, message: 'Visit updated successfully' });
    } catch (error) {
        console.error('Error updating visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteVisit = async (req, res) => {
    try {
        const deleted = await Visit.destroy({
            where: { Visit_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Visit not found' });
            return;
        }
        res.json({ success: true, message: 'Visit deleted successfully' });
    } catch (error) {
        console.error('Error deleting visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindVisitsByPatientId = async (req, res) => {
    const { patientId } = req.params;
    try {
        const visits = await Visit.findAll({
            where: { Patient_ID: patientId },
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname', 'Personal_Number', 'Birth_Date', 'Blood_type', 'Email', 'Gender', 'Phone'] },
                { model: Doctor, attributes: ['Doctor_ID'], include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });

        if (!visits.length) {
            return res.status(404).json({ error: 'Visits not found' });
        }

        res.json(visits);
    } catch (error) {
        console.error('Error fetching visits by patient ID:', error.message);
        console.error(error.stack); // Log the stack trace for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    FindAllVisits,
    FindSingleVisit,
    createVisit,
    UpdateVisit,
    DeleteVisit,
    FindVisitsByPatientId
};
