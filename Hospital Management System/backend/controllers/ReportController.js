const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const nodemailer = require('nodemailer');
const pdfTemplate = require('../documents');
const PdfReport = require('../models/PdfReport');
require('dotenv').config();
const Report = require('../models/PdfReport');

const outputFilePath = path.join(__dirname, '../result.pdf');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const createPdf = async (req, res) => {
    console.log('Request Body:', req.body); // Add this line
    try {
        const {
            personalNumber, patientName, age, patientGender, bloodType, diagnosis,
            doctorName, email, phone, condition, therapy, dateOfVisit, roomCost // Include roomCost
        } = req.body;

        // Print the entire roomCost value
        console.log('Room Cost:', roomCost); // Print roomCost here

        const htmlContent = pdfTemplate({
            personalNumber, patientName, age, patientGender, bloodType, diagnosis,
            doctorName, email, phone, condition, therapy, dateOfVisit, roomCost // Pass roomCost to template
        });

        const document = {
            html: htmlContent,
            data: {},
            path: outputFilePath,
        };

        const options = {
            format: 'A4',
            orientation: 'portrait',
            border: '10mm',
        };

        await pdf.create(document, options);

        if (!fs.existsSync(outputFilePath)) {
            throw new Error('PDF file was not created');
        }

        res.status(200).sendFile(outputFilePath);
    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).send(`Error creating PDF: ${error.message}`);
    }
};

const sendEmailWithPdf = async (req, res) => {
    try {
        const { email, patientName, roomCost } = req.body; // Include roomCost

        // Print the entire roomCost value
        console.log('Room Cost (Email):', roomCost); // Print roomCost here

        if (!fs.existsSync(outputFilePath)) {
            throw new Error('PDF file not found');
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Patient Report',
            text: `Dear ${patientName},

            Please find the attached patient report for your recent hospital visit.

            Room Cost: ${roomCost} // Include roomCost in the email body

            If you have any questions or need further assistance, please do not hesitate to contact us.

            Best regards,
            LIFELINE Hospital

            Contact Information:
            - Phone: +38349111222
            - Email: ${process.env.GMAIL_USER}`,
            attachments: [
                {
                    filename: 'patient_report.pdf',
                    path: outputFilePath,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent');
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(`Error sending email: ${error.message}`);
    }
};

const fetchPdf = (req, res) => {
    if (fs.existsSync(outputFilePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(outputFilePath);
    } else {
        res.status(404).send('PDF not found');
    }
};
const saveReportToDB = async (req, res) => {
    console.log('Received roomCost:', req.body.roomCost);
    try {
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);

        let personalNumber = req.body.personalNumber;
        let patientId = req.body.Patient_ID;
        let roomCost = req.body.roomCost; // Include roomCost

        console.log('Received personalNumber:', personalNumber);
        console.log('Received Patient_ID:', patientId);
        console.log('Received roomCost:', roomCost); // Log roomCost

        // Ensure personalNumber is a string
        if (typeof personalNumber === 'number') {
            personalNumber = personalNumber.toString();
        }
        
        if (typeof personalNumber !== 'string') {
            throw new Error('personalNumber must be a string');
        }

        // Ensure file is present
        if (!req.files || !req.files.report) {
            throw new Error('PDF report file is missing');
        }

        // Ensure Patient_ID is present
        if (!patientId) {
            throw new Error('Patient_ID is required');
        }

        const pdfReportData = req.files.report.data;

        // Log the data size for debugging
        console.log('PDF report data size:', pdfReportData.length);

        // Create report in the database
        const pdfReport = await PdfReport.create({
            personal_number: personalNumber,
            report: pdfReportData,
            Patient_ID: patientId,
            room_cost: roomCost // Save roomCost in the database
        });

        res.status(200).json({ message: 'Report saved to database successfully', pdfReport });
    } catch (error) {
        console.error('Error saving report to database:', error);
        res.status(500).json({ error: 'Error saving report to database', message: error.message });
    }
};

const fetchReportsFromDB = async (req, res) => {
    try {
        const reports = await PdfReport.findAll();
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports from database:', error);
        res.status(500).json({ error: 'Error fetching reports from database' });
    }
};

const deleteReport = async (req, res) => {
    try {
        const deleted = await Report.destroy({
            where: { Report_ID: req.params.id },
        });
        if (deleted === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createPdf,
    sendEmailWithPdf,
    fetchPdf,
    saveReportToDB,
    fetchReportsFromDB,
    deleteReport
};
