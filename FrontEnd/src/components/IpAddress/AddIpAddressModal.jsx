import React, { useState, useEffect } from 'react';
import { createIpAddress, getSites } from '../../services/authService';

const AddIpAddressModal = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ site_id: '', ip_address: '', ip_category: '' });
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
            await createIpAddress(formData);
            onSuccess();
            document.getElementById('closeAddIpModalBtn')?.click();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addIpAddressModal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content"><div className="modal-header"><h5 className="modal-title">Add New IP Address</h5><button id="closeAddIpModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3"><label className="form-label">Site</label><select name="site_id" className="form-select" value={formData.site_id} onChange={handleChange} required><option value="" disabled>Select a site</option>{sites.map(s => (<option key={s.id} value={s.id}>{s.Site_Name} ({s.Site_Code})</option>))}</select></div>
                            <div className="mb-3"><label className="form-label">IP Address</label><input type="text" name="ip_address" className="form-control" value={formData.ip_address} onChange={handleChange} required /></div>
                            <div className="mb-3"><label className="form-label">IP Category</label><input type="text" name="ip_category" className="form-control" value={formData.ip_category} onChange={handleChange} required /></div>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddIpAddressModal;