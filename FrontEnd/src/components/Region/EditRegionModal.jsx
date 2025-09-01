import React, { useState, useEffect } from 'react';
import { updateRegion } from '../../services/authService'; // We'll use the update service

const EditRegionModal = ({ region, onSuccess, onClose }) => {
    // State to hold the name being edited
    const [nomRegion, setNomRegion] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // This effect runs when the modal opens, filling the input with the current region's name
    useEffect(() => {
        if (region) {
            setNomRegion(region.nom_region);
        }
    }, [region]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!nomRegion.trim()) {
            setError('Region name cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            // Call the API to update the region with the specific ID
            await updateRegion(region.id, { nom_region: nomRegion });
            onSuccess(); // This will refresh the list and show a success message
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while updating the region.');
            console.error("Error updating region:", err);
        } finally {
            setLoading(false);
        }
    };

    // If no region is passed, don't render anything
    if (!region) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} // Manually show the modal
            id="editRegionModal"
            tabIndex={-1}
            aria-labelledby="editRegionModalLabel"
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24">
                        <h5 className="modal-title" id="editRegionModalLabel">
                            Modifier la Région
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose} // Use the onClose prop to close
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body p-24">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-20">
                                <label htmlFor="editNomRegion" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                    Nouveau Nom
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="editNomRegion"
                                    value={nomRegion}
                                    onChange={(e) => setNomRegion(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-danger text-sm mt-8">{error}</p>}
                            
                            <div className="d-flex justify-content-end gap-3 mt-24">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
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

export default EditRegionModal;