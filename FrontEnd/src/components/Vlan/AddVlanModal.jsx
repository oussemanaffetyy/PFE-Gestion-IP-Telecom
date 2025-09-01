import React, { useState, useEffect } from 'react';
import { createVlan, getSites } from '../../services/authService';

const AddVlanModal = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ site_id: '', vlan_value: '', vlan_category: '' });
    const [sites, setSites] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSitesForDropdown = async () => {
            try {
                const res = await getSites();
                setSites(res.data);
            } catch (err) {
                setError("Could not load sites for dropdown.");
            }
        };
        fetchSitesForDropdown();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createVlan(formData);
            onSuccess();
            document.getElementById('closeAddVlanModalBtn')?.click();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addVlanModal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content"><div className="modal-header"><h5 className="modal-title">Add New VLAN</h5><button id="closeAddVlanModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3"><label className="form-label">Site</label><select name="site_id" className="form-select" value={formData.site_id} onChange={handleChange} required><option value="" disabled>Select a site</option>{sites.map(s => (<option key={s.id} value={s.id}>{s.Site_Name} ({s.Site_Code})</option>))}</select></div>
                            <div className="mb-3"><label className="form-label">VLAN Value</label><input type="text" name="vlan_value" className="form-control" value={formData.vlan_value} onChange={handleChange} required /></div>
                            <div className="mb-3"><label className="form-label">VLAN Category</label><input type="text" name="vlan_category" className="form-control" value={formData.vlan_category} onChange={handleChange} required /></div>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddVlanModal;