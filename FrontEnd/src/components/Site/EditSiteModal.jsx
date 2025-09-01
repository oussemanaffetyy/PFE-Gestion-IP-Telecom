import React, { useState, useEffect } from 'react';
import { getSiteById, updateSite, getRegions, getSiteTypes } from '../../services/authService';

const EditSiteModal = ({ siteId, onSuccess, onClose }) => {
    const [formData, setFormData] = useState(null);
    const [regions, setRegions] = useState([]);
    const [siteTypes, setSiteTypes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataForEdit = async () => {
            if (!siteId) return;
            
            console.log(`Fetching data for site ID: ${siteId}`);
            setLoading(true);
            setError('');

            try {
                // Fetch all data needed for the form in parallel
                const [siteRes, regionsRes, siteTypesRes] = await Promise.all([
                    getSiteById(siteId),
                    getRegions(),
                    getSiteTypes()
                ]);

                setFormData(siteRes.data);
                setRegions(regionsRes.data);
                setSiteTypes(siteTypesRes.data);

            } catch (err) {
                console.error("Error fetching data for edit modal:", err);
                setError("Could not load site data for editing.");
            } finally {
                setLoading(false);
            }
        };

        fetchDataForEdit();
    }, [siteId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateSite(siteId, formData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while saving changes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Site</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p className="text-center">Loading data...</p>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3"><label className="form-label">Site Name</label><input type="text" name="Site_Name" className="form-control" defaultValue={formData.Site_Name} onChange={handleChange} required /></div>
                                <div className="mb-3"><label className="form-label">Site Code</label><input type="text" name="Site_Code" className="form-control" defaultValue={formData.Site_Code} onChange={handleChange} required /></div>
                                <div className="mb-3"><label className="form-label">Region</label><select name="region_id" className="form-select" defaultValue={formData.region_id} onChange={handleChange} required><option value="" disabled>Select a region</option>{regions.map(r => (<option key={r.id} value={r.id}>{r.nom_region}</option>))}</select></div>
                                <div className="mb-3"><label className="form-label">Site Type</label><select name="site_type_id" className="form-select" value={formData.site_type_id} onChange={handleChange} required><option value="" disabled>Select a site type</option>{siteTypes.map(st => (<option key={st.id} value={st.id}>{st.type_name}</option>))}</select></div>
                                <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditSiteModal;