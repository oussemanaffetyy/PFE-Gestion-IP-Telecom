import pool from '../config/db.js';

// @desc    Get all IP addresses with their site names
// @route   GET /api/ip-addresses
// @access  Private
export const getAllIpAddresses = async (req, res) => {
    try {
        const sql = `
            SELECT 
                ip.id, 
                ip.ip_address, 
                ip.ip_category,
                s.Site_Name, 
                s.Site_Code
            FROM ip_addresses AS ip
            JOIN sites AS s ON ip.site_id = s.id
            ORDER BY ip.id DESC;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Get a single IP address by ID
// @route   GET /api/ip-addresses/:id
// @access  Private
export const getIpAddressById = async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM ip_addresses WHERE id = ?", [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ msg: "IP Address not found." });
        }
        res.json(results[0]);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Create a new IP address
// @route   POST /api/ip-addresses
// @access  Private
export const createIpAddress = async (req, res) => {
    const { site_id, ip_address, ip_category } = req.body;
    if (!site_id || !ip_address || !ip_category) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }
    try {
        const sql = "INSERT INTO ip_addresses (site_id, ip_address, ip_category) VALUES (?, ?, ?)";
        const [result] = await pool.query(sql, [site_id, ip_address, ip_category]);
        res.status(201).json({ msg: "IP Address created successfully.", id: result.insertId });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Update an IP address
// @route   PUT /api/ip-addresses/:id
// @access  Private
export const updateIpAddress = async (req, res) => {
    const { id } = req.params;
    const { site_id, ip_address, ip_category } = req.body;
    if (!site_id || !ip_address || !ip_category) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }
    try {
        const sql = "UPDATE ip_addresses SET site_id = ?, ip_address = ?, ip_category = ? WHERE id = ?";
        const [result] = await pool.query(sql, [site_id, ip_address, ip_category, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "IP Address not found." });
        }
        res.json({ msg: "IP Address updated successfully." });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Delete an IP address
// @route   DELETE /api/ip-addresses/:id
// @access  Private
export const deleteIpAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM ip_addresses WHERE id = ?";
        const [result] = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "IP Address not found." });
        }
        res.json({ msg: "IP Address deleted successfully." });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};