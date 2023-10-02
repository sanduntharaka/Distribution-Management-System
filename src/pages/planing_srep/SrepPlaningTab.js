import React, { useState } from 'react';
import MyPlaning from './MyPlaning';


const SrepPlaningTab = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
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
            </div>

            <div className="tab_page">
                {selected === 0 ? <MyPlaning user={user} /> : ''}


            </div>
        </div>
    );
};

export default SrepPlaningTab;