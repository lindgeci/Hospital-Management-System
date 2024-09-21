const Insurance = require('../models/Insurance');

const FindAllInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findAll();
        res.json(insurance);
    } catch (error) {
        console.error('Error fetching all insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findByPk(req.params.id);
        if (!insurance) {
            res.status(404).json({ error: 'Insurance not found' });
            return;
        }
        res.json(insurance);
    } catch (error) {
        console.error('Error fetching single insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddInsurance = async (req, res) => {
    try {
        const { Patient_ID, Ins_Code, End_Date, Provider, Dental } = req.body;

        // Validate input fields
        if (!Ins_Code) {
            return res.status(400).json({ error: 'Ins_Code cannot be empty' });
        }
        const insCodeStr = Ins_Code.toString();
        if (insCodeStr.length !== 7) {
            return res.status(400).json({ error: 'Ins_Code must be 7 characters long' });
        }
        if (!End_Date) {
            return res.status(400).json({ error: 'End_Date cannot be empty' });
        }
        if (insCodeStr.startsWith('0')) {
            return res.status(400).json({ error: 'Please remove the leading 0 from the Ins_Code.' });
        }
        if (new Date(End_Date) < new Date(new Date().setHours(0, 0, 0, 0))) {
            return res.status(400).json({ error: 'End_Date cannot be in the past' });
        }
        if (!Provider) {
            return res.status(400).json({ error: 'Provider cannot be empty' });
        }

        // Check if the insurance code is already used by any patient
        const existingInsuranceWithCode = await Insurance.findOne({ where: { Ins_Code } });
        if (existingInsuranceWithCode) {
            return res.status(400).json({ error: 'This insurance code is already in use.' });
        }

        // Check if this patient already has an insurance record
        const existingInsuranceForPatient = await Insurance.findOne({ where: { Patient_ID } });
        if (existingInsuranceForPatient) {
            return res.status(400).json({ error: 'This patient already has an insurance record.' });
        }

        // Create new insurance record
        const newInsurance = await Insurance.create({
            Patient_ID,
            Ins_Code,
            End_Date,
            Provider,
            Dental,
        });

        res.json({ success: true, message: 'Insurance added successfully', data: newInsurance });
    } catch (error) {
        console.error('Error adding insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const UpdateInsurance = async (req, res) => {
    try {
        const { Patient_ID, Ins_Code, End_Date, Provider, Dental } = req.body;

        // Validation
        if (!Ins_Code) {
            return res.status(400).json({ error: 'Ins_Code cannot be empty' });
        }
        const insCodeStr = Ins_Code.toString();
        if (insCodeStr.length !=7) {
            return res.status(400).json({ error: 'Ins_Code must be 7 characters long' });
        }
        if (!End_Date) {
            return res.status(400).json({ error: 'End_Date cannot be empty' });
        }
        if (insCodeStr.startsWith('0')) {
            return res.status(400).json({ error: 'Please remove the leading 0 from the Ins_Code.' });
        }
        if (new Date(End_Date) < new Date(new Date().setHours(0, 0, 0, 0))) {
            return res.status(400).json({ error: 'End_Date cannot be in the past' });
        }
        if (!Provider) {
            return res.status(400).json({ error: 'Provider cannot be empty' });
        }

        const updated = await Insurance.update(
            { Patient_ID, Ins_Code, End_Date, Provider, Dental },
            { where: { Policy_Number: req.params.id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Insurance not found or not updated' });
        }
        res.json({ success: true, message: 'Insurance updated successfully' });
    } catch (error) {
        console.error('Error updating insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteInsurance = async (req, res) => {
    try {
        const deleted = await Insurance.destroy({
            where: { Policy_Number: req.params.id },
        });
        if (deleted === 0) {
            return res.status(404).json({ error: 'Insurance not found' });
        }
        res.json({ success: true, message: 'Insurance deleted successfully' });
    } catch (error) {
        console.error('Error deleting insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllInsurance,
    FindSingleInsurance,
    AddInsurance,
    UpdateInsurance,
    DeleteInsurance,
};
