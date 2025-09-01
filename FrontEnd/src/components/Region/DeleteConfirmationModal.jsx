import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex={-1}
            aria-labelledby="deleteModalLabel"
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content radius-16 bg-base">
                    <div className="modal-body p-24 text-center">
                        <div className="w-64-px h-64-px bg-danger-50 text-danger-600 rounded-circle d-inline-flex align-items-center justify-content-center mb-24">
                            <Icon icon="mingcute:delete-2-line" className="text-4xl" />
                        </div>

                        <h4 className="mb-8">Confirmer la Suppression</h4>
                        <p className="text-secondary-light mb-24">
                            Êtes-vous sûr de vouloir supprimer  ? Cette action est irréversible.
                        </p>
                        
                        <div className="d-flex justify-content-center gap-3">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger" 
                                onClick={onConfirm}
                            >
                                Oui, Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;