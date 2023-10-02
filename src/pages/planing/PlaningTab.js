import React, { useState } from 'react';
import CretePlaning from './CretePlaning';
import Summary from './Summary';

const PlaningTab = () => {
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
                    Create
                </div>
                <div
                    className={`item ${selected === 1 ? 'selected' : ''}`}
                    onClick={() => handleSelect(1)}
                >
                    Summary
                </div>
            </div>

            <div className="tab_page">
                {selected === 0 ? <CretePlaning user={user} /> : ''}
                {selected === 1 ? <Summary user={user} /> : ''}

            </div>
        </div>
    );
};

export default PlaningTab;