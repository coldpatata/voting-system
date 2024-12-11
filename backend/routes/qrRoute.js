const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Route to generate QR code (existing)
router.post('/generate-qr', async (req, res) => {
    const { name, openingDate, closingDate } = req.body;

    try {
        // Data to encode in the QR code
        const qrData = {
            name,
            openingDate,
            closingDate,
        };

        // Convert data to a string
        const qrString = JSON.stringify(qrData);

        // Generate QR code as a data URL
        const qrCode = await QRCode.toDataURL(qrString);
        res.status(200).json({ qrCode });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Failed to generate QR code' });
    }
});

// Route to download QR code as a PNG file
router.get('/download-qr', async (req, res) => {
    const { name, openingDate, closingDate } = req.query;

    try {
        // Data to encode in the QR code
        const qrData = {
            name,
            openingDate,
            closingDate,
        };

        // Convert data to a string
        const qrString = JSON.stringify(qrData);

        // Create the QR code image file path
        const filePath = path.join(__dirname, '../temp', 'qr-code.png');

        // Generate QR code and save to file
        await QRCode.toFile(filePath, qrString);

        // Send the file for download
        res.download(filePath, 'qr-code.png', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Failed to download QR code' });
            }

            // Optionally, delete the file after sending it
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting temporary file:', err);
                }
            });
        });
    } catch (error) {
        console.error('Error generating QR code for download:', error);
        res.status(500).json({ message: 'Failed to generate QR code for download' });
    }
});

module.exports = router;
