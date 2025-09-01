import pool from '../config/db.js';

// @desc    Get all VLANs with their site names
export const getAllVlans = async (req, res) => {
    try {
        const sql = `
            SELECT 
                v.id, v.vlan_value, v.vlan_category,
                s.Site_Name, s.Site_Code
            FROM vlans AS v
            JOIN sites AS s ON v.site_id = s.id
            ORDER BY v.id DESC;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Get a single VLAN by ID
export const getVlanById = async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM vlans WHERE id = ?", [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ msg: "VLAN not found." });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Create a new VLAN
export const createVlan = async (req, res) => {
    const { site_id, vlan_value, vlan_category } = req.body;
    if (!site_id || !vlan_value || !vlan_category) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }
    try {
        const sql = "INSERT INTO vlans (site_id, vlan_value, vlan_category) VALUES (?, ?, ?)";
        const [result] = await pool.query(sql, [site_id, vlan_value, vlan_category]);
        res.status(201).json({ msg: "VLAN created successfully.", id: result.insertId });
    } catch (err) {
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Update a VLAN
export const updateVlan = async (req, res) => {
    const { id } = req.params;
    const { site_id, vlan_value, vlan_category } = req.body;
    if (!site_id || !vlan_value || !vlan_category) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }
    try {
        const sql = "UPDATE vlans SET site_id = ?, vlan_value = ?, vlan_category = ? WHERE id = ?";
        const [result] = await pool.query(sql, [site_id, vlan_value, vlan_category, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "VLAN not found." });
        }
        res.json({ msg: "VLAN updated successfully." });
    } catch (err) {
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Delete a VLAN
export const deleteVlan = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM vlans WHERE id = ?";
        const [result] = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "VLAN not found." });
        }
        res.json({ msg: "VLAN deleted successfully." });
    } catch (err) {
        res.status(500).json({ msg: "Server Error." });
    }
};