const Room = require('../models/Room');
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
const FindAllRooms = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let rooms;
        if (userRole === 'admin') {
            rooms = await Room.findAll({
                include: {
                    model: Patient // Include Patient details if needed
                },
            });
        } else if (userRole === 'patient') {
            const patient = await getPatientByEmail(userEmail);
            rooms = await Room.findAll({
                where: { Patient_ID: patient.Patient_ID }, // Assuming rooms are associated with patients
                include: {
                    model: Patient
                },
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const roomsDataWithNames = rooms.map(room => ({
            ...room.toJSON(),
            Patient_Name: room.Patient ? `${room.Patient.Patient_Fname} ${room.Patient.Patient_Lname}` : 'Unknown Patient'
        }));

        res.json(roomsDataWithNames);
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const FindSingleRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.json(room);
    } catch (error) {
        console.error('Error fetching single room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const AddRoom = async (req, res) => {
    try {
        const { Room_type, Patient_ID, Room_cost } = req.body;

        // Validate required fields
        if (!Room_type || !Patient_ID || Room_cost === undefined) {
            return res.status(400).json({ error: 'All fields (Room_type, Patient_ID, Room_cost) are required' });
        }

        // Check if the patient already has a room
        const existingRoom = await Room.findOne({ where: { Patient_ID } });
        if (existingRoom) {
            return res.status(400).json({ error: 'This patient already has a room assigned.' });
        }

        const newRoom = await Room.create({
            Room_type,
            Patient_ID,
            Room_cost,
        });
        res.json({ success: true, message: 'Room added successfully', data: newRoom });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateRoom = async (req, res) => {
    try {
        const { Room_type, Patient_ID, Room_cost } = req.body;

        // Validate required fields
        if (!Room_type || !Patient_ID || Room_cost === undefined) {
            return res.status(400).json({ error: 'All fields (Room_type, Patient_ID, Room_cost) are required' });
        }

        // Check if the patient already has a room assigned (for updating)
        const existingRoom = await Room.findOne({ where: { Patient_ID, Room_ID: { [Op.ne]: req.params.id } } });
        if (existingRoom) {
            return res.status(400).json({ error: 'This patient already has a room assigned. Update the existing room instead.' });
        }

        const updated = await Room.update(
            { Room_type, Patient_ID, Room_cost },
            { where: { Room_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Room not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const DeleteRoom = async (req, res) => {
    try {
        const deleted = await Room.destroy({
            where: { Room_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllRooms,
    FindSingleRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
};
