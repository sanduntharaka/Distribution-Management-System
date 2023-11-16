import React, { useState } from 'react';
import CreteTarget from './CreteTarget';
import Summary from './Summary';
import ViewTargets from './ViewTargets';

const TargetTab = () => {
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
                    View
                </div>
                <div
                    className={`item ${selected === 2 ? 'selected' : ''}`}
                    onClick={() => handleSelect(2)}
                >
                    Summary
                </div>
            </div>

            <div className="tab_page">
                {selected === 0 ? <CreteTarget user={user} /> : ''}
                {selected === 1 ? <ViewTargets user={user} /> : ''}

                {selected === 2 ? <Summary user={user} /> : ''}

            </div>
        </div>
    );
};

export default TargetTab;