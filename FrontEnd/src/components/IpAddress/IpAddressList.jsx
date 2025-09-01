import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getAllIpAddresses, deleteIpAddress, getSites } from '../../services/authService';
import AddIpAddressModal from './AddIpAddressModal';
import EditIpAddressModal from './EditIpAddressModal';
import DeleteConfirmationModal from '../Region/DeleteConfirmationModal';

const IpAddressList = () => {
    // --- State Management ---
    const [ipAddresses, setIpAddresses] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- UI and Modal State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [siteFilter, setSiteFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [editingIpAddressId, setEditingIpAddressId] = useState(null);
    const [deletingIpAddressId, setDeletingIpAddressId] = useState(null);

    // --- Data Fetching & Handlers ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const [ipRes, sitesRes] = await Promise.all([getAllIpAddresses(), getSites()]);
            setIpAddresses(Array.isArray(ipRes.data) ? ipRes.data : []);
            setSites(Array.isArray(sitesRes.data) ? sitesRes.data : []);
        } catch (error) {
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleDelete = async () => {
        if (!deletingIpAddressId) return;
        try {
            await deleteIpAddress(deletingIpAddressId);
            setSuccessMessage("IP Address deleted successfully!");
            fetchData();
        } catch (err) {
            setError("Failed to delete IP Address.");
        } finally {
            setDeletingIpAddressId(null);
        }
    };
    
    const handleAddSuccess = () => { setSuccessMessage("IP Address added successfully!"); fetchData(); };
    const handleUpdateSuccess = () => { setEditingIpAddressId(null); setSuccessMessage("IP Address updated successfully!"); fetchData(); };
    const handleResetFilters = () => { setSearchTerm(''); setSiteFilter(''); setPage(1); };

    // --- Filtering & Pagination Logic ---
    const filteredData = useMemo(() => {
        let data = [...ipAddresses];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(term)));
        }
        if (siteFilter) {
            data = data.filter(item => item.Site_Code === siteFilter);
        }
        return data;
    }, [ipAddresses, searchTerm, siteFilter]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const currentData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    const startIndex = (page - 1) * pageSize;

    return (
        <>
            <div className="card h-100 p-0">
                <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span>Show</span>
                            <select className="form-select form-select-sm w-auto" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                                <option value="10">10</option><option value="25">25</option><option value="50">50</option>
                            </select>
                        </div>
                        <div className="icon-field">
                            <input type="text" className="form-control form-control-sm w-auto" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <span className="icon"><Icon icon="ion:search-outline" /></span>
                        </div>
                        <select className="form-select form-select-sm w-auto" value={siteFilter} onChange={e => setSiteFilter(e.target.value)}><option value="">All Sites</option>{sites.map(s => <option key={s.Site_Code} value={s.Site_Code}>{s.Site_Name}</option>)}</select>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleResetFilters}>Reset</button>
                    </div>
                    <button type="button" className="btn btn-sm btn-primary-600" data-bs-toggle="modal" data-bs-target="#addIpAddressModal">
                        <i className="ri-add-line" /> Add New IP Address
                    </button>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="table-responsive">
                        <table className="table bordered-table mb-0">
                            <thead><tr><th>#</th><th>IP Address</th><th>Category</th><th>Site Name</th><th>Site Code</th><th className="text-center">Actions</th></tr></thead>
                            <tbody>
                                {loading ? (<tr><td colSpan="6" className="text-center">Loading...</td></tr>)
                                : currentData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td><td>{item.ip_address}</td><td>{item.ip_category}</td><td>{item.Site_Name}</td><td>{item.Site_Code}</td>
                                        <td className="text-center">
                                            <button onClick={() => setEditingIpAddressId(item.id)} className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                                <Icon icon="lucide:edit" />
                                            </button>
                                            <button onClick={() => setDeletingIpAddressId(item.id)} className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                                <Icon icon="mingcute:delete-2-line" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries</span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <li className="page-item"><button className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base" onClick={() => setPage(p => p - 1)} disabled={page === 1}><Icon icon="ep:d-arrow-left" className="text-xl" /></button></li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className="page-item"><button className={`page-link fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px ${page === i + 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                            ))}
                            <li className="page-item"><button className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px w-32-px bg-base" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><Icon icon="ep:d-arrow-right" className="text-xl" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* All Modals */}
            <AddIpAddressModal onSuccess={handleAddSuccess} />
            {editingIpAddressId && <EditIpAddressModal ipAddressId={editingIpAddressId} onSuccess={handleUpdateSuccess} onClose={() => setEditingIpAddressId(null)} />}
            {deletingIpAddressId && <DeleteConfirmationModal onClose={() => setDeletingIpAddressId(null)} onConfirm={handleDelete} />}
        </>
    );
};
export default IpAddressList;