import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [
            [[regionResult]],      
            [[siteResult]],        
            [[ipResult]],
            [[vlanResult]],
            [[anomalyResult]],
            sitesPerRegionRows,    
            recentSitesRows       
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) as count FROM regions"),
            pool.query("SELECT COUNT(*) as count FROM sites"),
            pool.query("SELECT COUNT(*) as count FROM ip_addresses"),
            pool.query("SELECT COUNT(*) as count FROM vlans"),
            pool.query("SELECT COUNT(*) as count FROM anomalies WHERE status = 'NEW'"),
            pool.query(`
                SELECT r.nom_region, COUNT(s.id) as site_count 
                FROM sites s JOIN regions r ON s.region_id = r.id 
                GROUP BY r.nom_region ORDER BY site_count DESC LIMIT 5;
            `),
            pool.query(`
                SELECT s.Site_Name, s.Site_Code, r.nom_region, s.id 
                FROM sites s JOIN regions r ON s.region_id = r.id
                ORDER BY s.id DESC LIMIT 5;
            `)
        ]);

        res.json({
            totalRegions: regionResult.count,
            totalSites: siteResult.count,
            totalIpAddresses: ipResult.count,
            totalVlans: vlanResult.count,
            newAnomalies: anomalyResult.count,
            sitesPerRegion: sitesPerRegionRows,
            recentSites: recentSitesRows
        });

    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ msg: "Server Error." });
    }
};