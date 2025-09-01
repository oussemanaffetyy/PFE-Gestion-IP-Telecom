import pool from '../config/db.js';

// @desc    Get all site types
// @route   GET /api/types
// @access  Private
export const getAllTypes = async (req, res) => {
    try {
        const sql = "SELECT * FROM site_types ORDER BY type_name ASC";
        const [results] = await pool.query(sql);
        res.json(results);
  } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};


// @desc    Create a new site type
// @route   POST /api/types
// @access  Private
export const createType = async (req, res) => {
    const { type_name } = req.body;

    if (!type_name) {
        return res.status(400).json({ msg: "Please provide a type name." });
    }

    try {
        const sql = "INSERT INTO site_types (type_name) VALUES (?)";
        const [result] = await pool.query(sql, [type_name]);
        res.status(201).json({ 
            msg: "Site type created successfully.",
            type: { id: result.insertId, type_name }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "This site type already exists." });
        }
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Update an existing site type
// @route   PUT /api/types/:id
// @access  Private
export const updateType = async (req, res) => {
    const { id } = req.params;
    const { type_name } = req.body;

    if (!type_name) {
        return res.status(400).json({ msg: "Please provide the new type name." });
    }

    try {
        const sql = "UPDATE site_types SET type_name = ? WHERE id = ?";
        const [result] = await pool.query(sql, [type_name, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Site type not found." });
        }
        res.json({ msg: "Site type updated successfully." });
    } catch (err) {
         if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "This name is already in use." });
        }
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Delete a site type
// @route   DELETE /api/types/:id
// @access  Private
export const deleteType = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "DELETE FROM site_types WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Site type not found." });
        }
        res.json({ msg: "Site type deleted successfully." });
    } catch (err) {
        // Handle foreign key constraint error
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ msg: "Cannot delete this site type because it is being used by one or more sites." });
        }
        console.error("Server Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};