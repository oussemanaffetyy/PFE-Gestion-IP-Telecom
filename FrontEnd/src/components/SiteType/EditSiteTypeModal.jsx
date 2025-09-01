import React, { useState, useEffect } from 'react';
import { updateSiteType } from '../../services/authService';

const EditSiteTypeModal = ({ siteType, onSuccess, onClose }) => {
    const [typeName, setTypeName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (siteType) {
            setTypeName(siteType.type_name);
        }
    }, [siteType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateSiteType(siteType.id, { type_name: typeName });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (!siteType) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title">Edit Site Type</h5><button type="button" className="btn-close" onClick={onClose}></button></div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3"><label className="form-label">Type Name</label><input type="text" className="form-control" value={typeName} onChange={(e) => setTypeName(e.target.value)} required /></div>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditSiteTypeModal;