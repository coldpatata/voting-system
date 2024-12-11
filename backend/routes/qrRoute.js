const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

// Route to generate QR code
router.post('/generate-qr', async (req, res) => {
    const { name, openingDate, closingDate } = req.body;

    try {
        // Data to encode in the QR code
        const qrData = {
            name,
            openingDate,
            closingDate,
        };
        console.log(qrData)

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

module.exports = router;
