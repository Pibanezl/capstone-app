import React from 'react';
import DropdownProfile from './dropdownProfile';
import DropdownMenu from './dropdownMenu';
import { Link } from 'react-router-dom';
const Header = ({ user }) => {
    return (
        <div className="App-header">
            <DropdownMenu user={user} />
            <h1 className="Title-header">
                <Link to="/">Safety Community</Link>
            </h1>
            <DropdownProfile user={user} />
        </div>
    );
};

export default Header;
