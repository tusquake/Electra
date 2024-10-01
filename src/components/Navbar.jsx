// src/components/Navbar.js
import { Avatar, Tooltip, Typography } from '@mui/material'; // Import Tooltip and Typography from Material UI
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/elec.avif'; // Adjust the path as needed
import user from '../assets/user.jpg'; // Adjust the path as needed

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="nav-left">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src={logo} alt="Logo" className="logo" /> {/* Adjusted logo path */}
                    <span className="website-name">Electra</span>
                </Link>
            </div>
            <div className="nav-center">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </div>
            <div className="nav-right">
                <Tooltip
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Tushar Seth</Typography>
                        </div>
                    }
                    arrow
                >
                    <Avatar alt="User" src={user} /> {/* Replace with your user icon path */}
                </Tooltip>
            </div>
        </div>
    );
};

export default Navbar;
