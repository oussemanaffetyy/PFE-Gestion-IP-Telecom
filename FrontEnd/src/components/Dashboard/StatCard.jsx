import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const StatCard = ({ title, value, icon, colorClass }) => {
    return (
        <div className='col-md-3 col-sm-6'>
            <div className={`radius-8 h-100 text-center p-20 bg-${colorClass}-light`}>
                <span className={`w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-xl mb-12 bg-${colorClass}-200 border border-${colorClass}-400 text-${colorClass}-600`}>
                    <Icon icon={icon} />
                </span>
                <span className='text-neutral-700 d-block'>{title}</span>
                <h4 className='mb-0 mt-4'>{value}</h4>
            </div>
        </div>
    );
};
export default StatCard;