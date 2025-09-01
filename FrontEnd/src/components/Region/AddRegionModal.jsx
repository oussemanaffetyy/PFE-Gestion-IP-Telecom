import React, { useState } from 'react';
import { createRegion } from '../../services/authService';

const AddRegionModal = ({ onSuccess }) => {
    const [nomRegion, setNomRegion] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!nomRegion.trim()) {
            setError('Region name is required.');
            setLoading(false);
            return;
        }

        try {
            await createRegion({ nom_region: nomRegion });
            
            // This calls the fetchRegions function in the parent to refresh the list
            onSuccess(); 
            
            // Manually trigger the Bootstrap close button
            const closeButton = document.getElementById('closeAddRegionModalBtn');
            if (closeButton) {
                closeButton.click();
            }

        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while adding the region.');
            console.error("Error creating region:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id="addRegionModal"
            tabIndex={-1}
            aria-labelledby="addRegionModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24">
                        <h5 className="modal-title" id="addRegionModalLabel">
                            Ajouter une Nouvelle Région
                        </h5>
                        <button
                            id="closeAddRegionModalBtn"
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body p-24">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-20">
                                <label htmlFor="nomRegion" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                    Nom de la Région
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="nomRegion"
                                    placeholder="Enter Region Name"
                                    value={nomRegion}
                                    onChange={(e) => setNomRegion(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-danger text-sm mt-8">{error}</p>}
                            
                            <div className="d-flex justify-content-end gap-3 mt-24">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRegionModal;