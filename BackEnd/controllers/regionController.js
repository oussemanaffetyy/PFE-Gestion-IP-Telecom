import pool from '../config/db.js';

// @desc    Get all regions
// @route   GET /api/regions
// @access  Private
export const getAllRegions = async (req, res) => {
  try {
    const sql = "SELECT * FROM regions ORDER BY nom_region ASC";
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ msg: "Server Error." });
  }
};

// @desc    Create a new region
// @route   POST /api/regions
// @access  Private
export const createRegion = async (req, res) => {
  const { nom_region } = req.body;

  if (!nom_region) {
    return res.status(400).json({ msg: "Please provide a region name." });
  }

  try {
    const sql = "INSERT INTO regions (nom_region) VALUES (?)";
    const [result] = await pool.query(sql, [nom_region]);
    
    res.status(201).json({
      msg: "Region added successfully.",
      region: { id: result.insertId, nom_region: nom_region }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: "This region already exists." });
    }
    console.error("SQL Error:", err);
    res.status(500).json({ msg: "Server Error." });
  }
};

// @desc    Update an existing region
// @route   PUT /api/regions/:id
// @access  Private
export const updateRegion = async (req, res) => {
  const { id } = req.params;
  const { nom_region } = req.body;

  if (!nom_region) {
    return res.status(400).json({ msg: "Please provide the new region name." });
  }

  try {
    const sql = "UPDATE regions SET nom_region = ? WHERE id = ?";
    const [result] = await pool.query(sql, [nom_region, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Region not found." });
    }

    res.json({ msg: "Region updated successfully." });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ msg: "This name is already used by another region." });
    }
    console.error("SQL Error:", err);
    res.status(500).json({ msg: "Server Error." });
  }
};

// @desc    Delete a region
// @route   DELETE /api/regions/:id
// @access  Private
export const deleteRegion = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM regions WHERE id = ?";
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Region not found." });
    }

    res.json({ msg: "Region deleted successfully." });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ msg: "Server Error." });
  }
};