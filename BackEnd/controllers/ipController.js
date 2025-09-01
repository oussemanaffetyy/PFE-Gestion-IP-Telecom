import pool from '../config/db.js';
import geoip from 'geoip-lite';

export const checkIpController = async (req, res) => {
    const { ip_address } = req.body;

    if (!ip_address) {
        return res.status(400).json({ msg: "IP address is required." });
    }

    let logData = {
        ip: ip_address,
        status: 'Rejeté',
        site_id: null,
        country: geoip.lookup(ip_address)?.country || 'Unknown',
        user_agent: req.headers['user-agent']
    };

    try {
        const sql_check = "SELECT id, site_id FROM ip_addresses WHERE ip_address = ?";
        const [results] = await pool.query(sql_check, [ip_address]);

        // This function will save the log to the database
        const saveLog = async (data) => {
            const sql_log = "INSERT INTO ip_check_logs (ip_address, status, site_id, country_name, user_agent) VALUES (?, ?, ?, ?, ?)";
            try {
                await pool.query(sql_log, [data.ip, data.status, data.site_id, data.country, data.user_agent]);
            } catch (logErr) {
                console.error("Failed to save log:", logErr); // Log the error but don't stop the user's request
            }
        };

        if (results.length > 0) {
            // IP is authorized, update log data and send success response
            logData.status = 'Autorisé';
            logData.site_id = results[0].site_id;
            saveLog(logData); // Save the log in the background
            return res.json({ status: "Autorisé", message: "This IP address is authorized." });
        } else {
            // IP is rejected, send not found response
            saveLog(logData); // Save the log in the background
            return res.status(404).json({ status: "Rejeté", message: "This IP address is not authorized." });
        }
    } catch (err) {
        console.error("Server Error:", err);
        // We can also log failures at the server error level if we want
        // saveLog(logData);
        return res.status(500).json({ msg: "Server Error." });
    }
};