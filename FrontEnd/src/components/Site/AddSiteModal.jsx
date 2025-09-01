import React, { useState, useEffect } from 'react';
import { createSite, getRegions, getSiteTypes } from '../../services/authService';

const AddSiteModal = ({ onSuccess }) => {
    // We will use one state object to hold all form data
    const [formData, setFormData] = useState({
        Site_Name: '',
        Site_Code: '',
        region_id: '',
        site_type_id: ''
    });
    
    // Separate states for the dropdown options
    const [regions, setRegions] = useState([]);
    const [siteTypes, setSiteTypes] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch data for the dropdowns when the modal is first rendered
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const regionsRes = await getRegions();
                setRegions(regionsRes.data);

                const siteTypesRes = await getSiteTypes();
                setSiteTypes(siteTypesRes.data);
            } catch (err) {
                setError("Could not load required form data.");
            }
        };
        fetchDropdownData();
    }, []);

    // A single handler for all form inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate all fields in the state object
        if (!formData.Site_Name || !formData.Site_Code || !formData.region_id || !formData.site_type_id) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            await createSite(formData);
            onSuccess(); // This refreshes the list in the parent
            document.getElementById('closeAddSiteModalBtn')?.click(); // Closes the modal
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addSiteModal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content radius-16 bg-base">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Site</h5>
                        <button id="closeAddSiteModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body p-24">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Site Name</label>
                                <input type="text" name="Site_Name" className="form-control" value={formData.Site_Name} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Site Code</label>
                                <input type="text" name="Site_Code" className="form-control" value={formData.Site_Code} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Region</label>
                                <select name="region_id" className="form-select" value={formData.region_id} onChange={handleChange} required>
                                    <option value="" disabled>Select a region</option>
                                    {regions.map(region => (
                                        <option key={region.id} value={region.id}>{region.nom_region}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Site Type</label>
                                <select name="site_type_id" className="form-select" value={formData.site_type_id} onChange={handleChange} required>
                                    <option value="" disabled>Select a site type</option>
                                    {siteTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.type_name}</option>
                                    ))}
                                </select>
                            </div>
                            {error && <p className="text-danger mt-2">{error}</p>}
                            <div className="d-flex justify-content-end gap-3 mt-4">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSiteModal;