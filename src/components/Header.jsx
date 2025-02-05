import React from 'react';
import { Link } from 'react-router-dom'; 

export default function Header() {
    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/heroes">Heroes</Link>
                <Link to="/maps">Maps</Link>
            </nav>
        </header>
    );
}