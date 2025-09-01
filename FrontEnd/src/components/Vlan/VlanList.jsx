import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getAllVlans, deleteVlan, getSites } from '../../services/authService';
import AddVlanModal from './AddVlanModal';
import EditVlanModal from './EditVlanModal';
import DeleteConfirmationModal from '../Region/DeleteConfirmationModal';

const VlanList = () => {
    const [vlans, setVlans] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [siteFilter, setSiteFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal State
    const [editingVlanId, setEditingVlanId] = useState(null);
    const [deletingVlanId, setDeletingVlanId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [vlanRes, sitesRes] = await Promise.all([getAllVlans(), getSites()]);
            setVlans(Array.isArray(vlanRes.data) ? vlanRes.data : []);
            setSites(Array.isArray(sitesRes.data) ? sitesRes.data : []);
        } catch (error) {
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { if (successMessage) { const timer = setTimeout(() => setSuccessMessage(""), 3000); return () => clearTimeout(timer); } }, [successMessage]);

    const handleResetFilters = () => { setSearchTerm(''); setSiteFilter(''); setPage(1); };
    const handleDelete = async () => {
        if (!deletingVlanId) return;
        try {
            await deleteVlan(deletingVlanId);
            setSuccessMessage("VLAN deleted successfully!");
            fetchData();
        } catch (err) {
            setError("Failed to delete VLAN.");
        } finally {
            setDeletingVlanId(null);
        }
    };
    const handleAddSuccess = () => { setSuccessMessage("VLAN added successfully!"); fetchData(); };
    const handleUpdateSuccess = () => { setEditingVlanId(null); setSuccessMessage("VLAN updated successfully!"); fetchData(); };

    const filteredData = useMemo(() => {
        let data = [...vlans];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(term)));
        }
        if (siteFilter) {
            data = data.filter(item => item.Site_Code === siteFilter);
        }
        return data;
    }, [vlans, searchTerm, siteFilter]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const currentData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    const startIndex = (page - 1) * pageSize;

    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                            <option value="10">10</option><option value="25">25</option><option value="50">50</option>
                        </select>
                        <form className="navbar-search"><input type="text" className="bg-base h-40-px w-auto" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /><Icon icon="ion:search-outline" className="icon" /></form>
                        <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" value={siteFilter} onChange={e => setSiteFilter(e.target.value)}><option value="">All Sites</option>{sites.map(s => <option key={s.Site_Code} value={s.Site_Code}>{s.Site_Name}</option>)}</select>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleResetFilters}><Icon icon="material-symbols:refresh" className="me-1" /> Reset</button>
                    </div>
                    <button type="button" className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#addVlanModal">
                        <Icon icon="ic:baseline-plus" /> Add New VLAN
                    </button>
                </div>
                <div className="card-body p-24">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="table-responsive">
                        <table className="table bordered-table sm-table mb-0">
                            <thead><tr><th>#</th><th>VLAN Value</th><th>Category</th><th>Site Name</th><th>Site Code</th><th className="text-center">Actions</th></tr></thead>
                            <tbody>
                                {loading ? (<tr><td colSpan="6" className="text-center">Loading...</td></tr>)
                                : currentData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{item.vlan_value}</td>
                                        <td>{item.vlan_category}</td>
                                        <td>{item.Site_Name}</td>
                                        <td>{item.Site_Code}</td>
                                        <td className="text-center">
                                            <button type="button" onClick={() => setEditingVlanId(item.id)} className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex">
                                                <Icon icon="lucide:edit" />
                                            </button>
                                            <button type="button" onClick={() => setDeletingVlanId(item.id)} className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle d-inline-flex ms-2">
                                                <Icon icon="fluent:delete-24-regular" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries</span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <li className="page-item"><button className="page-link" onClick={() => setPage(p => p - 1)} disabled={page === 1}><Icon icon="ep:d-arrow-left" /></button></li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className="page-item"><button className={`page-link ${page === i + 1 ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"}`} onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                            ))}
                            <li className="page-item"><button className="page-link" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}><Icon icon="ep:d-arrow-right" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* All Modals */}
            <AddVlanModal onSuccess={handleAddSuccess} />
            {editingVlanId && <EditVlanModal vlanId={editingVlanId} onSuccess={handleUpdateSuccess} onClose={() => setEditingVlanId(null)} />}
            {deletingVlanId && <DeleteConfirmationModal onClose={() => setDeletingVlanId(null)} onConfirm={handleDelete} />}
        </>
    );
};
export default VlanList;