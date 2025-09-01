import React, { useState, useEffect } from 'react';
import { getIpAddressById, updateIpAddress, getSites } from '../../services/authService';

const EditIpAddressModal = ({ ipAddressId, onSuccess, onClose }) => {
    const [formData, setFormData] = useState(null);
    const [sites, setSites] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataForEdit = async () => {
            if (!ipAddressId) return;
            try {
                setLoading(true);
                const [ipRes, sitesRes] = await Promise.all([ getIpAddressById(ipAddressId), getSites() ]);
                setFormData(ipRes.data);
                setSites(sitesRes.data);
            } catch (err) {
                setError("Could not load data for editing.");
            } finally {
                setLoading(false);
            }
        };
        fetchDataForEdit();
    }, [ipAddressId]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateIpAddress(ipAddressId, formData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title">Edit IP Address</h5><button type="button" className="btn-close" onClick={onClose}></button></div>
                    <div className="modal-body">
                        {loading ? (<p className="text-center">Loading data...</p>) : error ? (<div className="alert alert-danger">{error}</div>) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3"><label className="form-label">Site</label><select name="site_id" className="form-select" value={formData.site_id} onChange={handleChange} required><option value="" disabled>Select a site</option>{sites.map(s => (<option key={s.id} value={s.id}>{s.Site_Name} ({s.Site_Code})</option>))}</select></div>
                                <div className="mb-3"><label className="form-label">IP Address</label><input type="text" name="ip_address" className="form-control" value={formData.ip_address} onChange={handleChange} required /></div>
                                <div className="mb-3"><label className="form-label">IP Category</label><input type="text" name="ip_category" className="form-control" value={formData.ip_category} onChange={handleChange} required /></div>
                                <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditIpAddressModal;