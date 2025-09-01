import React, { useState } from 'react';
import { createSiteType } from '../../services/authService';

const AddSiteTypeModal = ({ onSuccess }) => {
    const [typeName, setTypeName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createSiteType({ type_name: typeName });
            onSuccess();
            document.getElementById('closeAddTypeModalBtn')?.click();
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="addSiteTypeModal" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content"><div className="modal-header"><h5 className="modal-title">Add New Site Type</h5><button id="closeAddTypeModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button></div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3"><label className="form-label">Type Name</label><input type="text" className="form-control" value={typeName} onChange={(e) => setTypeName(e.target.value)} required /></div>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="d-flex justify-content-end gap-3 mt-4"><button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddSiteTypeModal;