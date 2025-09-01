import pool from '../config/db.js';

// @desc    Get all sites with region and type names
// @route   GET /api/sites
// @access  Private
const getAllSites = async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.id, s.Site_Name, s.Site_Code, 
                r.nom_region, 
                st.type_name 
            FROM sites AS s
            JOIN regions AS r ON s.region_id = r.id
            JOIN site_types AS st ON s.site_type_id = st.id
            ORDER BY s.Site_Name ASC;
        `;
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Get a single site by its ID
// @route   GET /api/sites/:id
// @access  Private
const getSiteById = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `SELECT * FROM sites WHERE id = ?`;
        const [results] = await pool.query(sql, [id]);
        if (results.length === 0) {
            return res.status(404).json({ msg: "Site not found." });
        }
        res.json(results[0]);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};


// @desc    Create a new site
// @route   POST /api/sites
// @access  Private
const createSite = async (req, res) => {
    const { Site_Name, Site_Code, region_id, site_type_id } = req.body;

    if (!Site_Name || !Site_Code || !region_id || !site_type_id) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }

    try {
        const sql = "INSERT INTO sites (Site_Name, Site_Code, region_id, site_type_id) VALUES (?, ?, ?, ?)";
        const [result] = await pool.query(sql, [Site_Name, Site_Code, region_id, site_type_id]);
        res.status(201).json({ msg: "Site created successfully.", siteId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "This Site Code already exists." });
        }
        console.error("SQL Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Update an existing site
// @route   PUT /api/sites/:id
// @access  Private
const updateSite = async (req, res) => {
    const { id } = req.params;
    const { Site_Name, Site_Code, region_id, site_type_id } = req.body;

    if (!Site_Name || !Site_Code || !region_id || !site_type_id) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }

    try {
        const sql = "UPDATE sites SET Site_Name = ?, Site_Code = ?, region_id = ?, site_type_id = ? WHERE id = ?";
        const [result] = await pool.query(sql, [Site_Name, Site_Code, region_id, site_type_id, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Site not found." });
        }

        res.json({ msg: "Site updated successfully." });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "This Site Code is already used by another site." });
        }
        console.error("SQL Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

// @desc    Delete a site
// @route   DELETE /api/sites/:id
// @access  Private
const deleteSite = async (req, res) => {
    const { id } = req.params;
    try {
        // Note: You might need to handle related IPs and VLANs before deleting a site
        // For now, this is a simple delete.
        const sql = "DELETE FROM sites WHERE id = ?";
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Site not found." });
        }
        res.json({ msg: "Site deleted successfully." });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};

export {
    getAllSites,
    getSiteById,
    createSite,
    updateSite,
    deleteSite
};