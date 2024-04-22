import React, { useState } from 'react';
import MyPlaning from './MyPlaning';
import CretePlaning from './CretePlaning';



const SrepPlaningTab = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const user_details = JSON.parse(sessionStorage.getItem('user_details'));

    const [selected, setSelected] = useState(0);
    const handleSelect = (i) => {
        setSelected(i);
    };
    return (
        <div className="tab">
            <div className="tab_contaner">
                <div
                    className={`item ${selected === 0 ? 'selected' : ''}`}
                    onClick={() => handleSelect(0)}
                >
                    My Planing
                </div>
                <div
                    className={`item ${selected === 1 ? 'selected' : ''}`}
                    onClick={() => handleSelect(1)}
                >
                    Create Planing
                </div>
            </div>

            <div className="tab_page">
                {selected === 0 ? <MyPlaning user={user} /> : ''}
                {selected === 1 ? <CretePlaning user={user} user_details={user_details} /> : ''}


            </div>
        </div>
    );
};

export default SrepPlaningTab;