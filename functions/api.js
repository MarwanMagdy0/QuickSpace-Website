const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const moment = require('moment-timezone'); // Import moment-timezone

// Fixed JSON with MAC addresses and subscription end times
const subscriptions = {
    "AA:BB:CC:DD:EE:FF": { client_name: "Arabesque", end_time: "2025-12-31T23:59:59Z" },
    "11:22:33:44:55:66": { client_name: "Atique",end_time: "2025-06-30T23:59:59Z" },
    "88:22:33:44:55:66": { client_name: "Layla",end_time: "2025-02-17T23:59:59Z" },
    "77:88:99:AA:BB:CC": { client_name: "wow",end_time: "2026-01-15T23:59:59Z" }
};

let accessLogs = [];
const MAX_LOGS = 10;
const ADMIN_PASSWORD = "password123";

// Handle requests for specific user MAC
router.get('/is_valid_mac/:user_mac', (req, res) => {
    const userMac = req.params.user_mac;
    // Get current time in Egypt timezone
    const currentTime = moment().tz("Africa/Cairo");
    accessLogs.push({timstamp:currentTime.format('YYYY-MM-DD HH:mm:ss'), userMac});
    if (accessLogs.length > MAX_LOGS) {
        accessLogs.shift();  // Removes the first element (oldest log)
    }
    if (subscriptions[userMac]) {
        const endTime = moment(subscriptions[userMac].end_time);
        
        if (currentTime.isBefore(endTime)) {
            res.json({
                valid: true,
                mac: userMac,
                end_time: subscriptions[userMac].end_time
            });
        } else {
            res.status(403).json({
                valid: false,
                message: "Subscription expired"
            });
        }
    } else {
        res.status(404).json({
            valid: false,
            message: "Invalid"
        });
    }
});

// Admin Dashboard - View API Logs (with query param password)
router.get('/admin/logs', (req, res) => {
    const { password } = req.query;

    if (password === ADMIN_PASSWORD) {
        return res.json(accessLogs);
    } else {
        return res.status(403).json({ success: false, message: "Forbidden: Incorrect password" });
    }
});


app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
