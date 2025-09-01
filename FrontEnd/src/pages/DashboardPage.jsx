import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import DashboardLayer from '../components/Dashboard/DashboardLayer';

const DashboardPage = () => {
    return (
        <>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
                <h6 className='fw-semibold mb-0'>Dashboard</h6>
                <ul className='d-flex align-items-center gap-2'>
                    <li className='fw-medium'>
                        <Link to='/dashboard' className='d-flex align-items-center gap-1 hover-text-primary'>
                            <Icon icon='solar:home-smile-angle-outline' className='icon text-lg' />
                            Dashboard
                        </Link>
                    </li>
                    <li>-</li>
                    <li className='fw-medium'>Tableau de Bord</li>
                </ul>
            </div>
            
            <DashboardLayer />
        </>
    );
};

export default DashboardPage;