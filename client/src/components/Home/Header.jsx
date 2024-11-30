import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import About from '../Home/About';
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const[log,setLog]=useState("Login");
    return (
        <>
            {/* Header Section */}
            <header className="bg-gray-900 py-4 shadow-lg">
                <nav className="container mx-auto flex justify-between items-center px-4">
                    {/* Logo */}
                    <a href="#" className="text-orange-500 text-3xl font-extrabold tracking-wide">
                        LMS
                    </a>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-8 text-gray-300">
                        <li>
                            <a
                                href="/"
                                className="text-lg font-medium hover:text-orange-400 transition-transform transform hover:scale-105"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <Link
                              to="/about_us"
                                className="text-lg font-medium hover:text-orange-400 transition-transform transform hover:scale-105"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                               to="/contact"
                                className="text-lg font-medium hover:text-orange-400 transition-transform transform hover:scale-105"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                               to="/book-search"
                                className="text-lg font-medium hover:text-orange-400 transition-transform transform hover:scale-105"
                            >
                              Library
                            </Link>
                        </li>
                    </ul>

                    {/* Login and Register Buttons */}
                    <div className="hidden md:flex space-x-4">
                        <a
                            href="/register"
                            className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
                        >
                            Register
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-300 text-2xl focus:outline-none"
                    >
                        ☰
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <ul className="md:hidden bg-gray-800 text-gray-300 space-y-2 p-4 absolute w-full left-0 shadow-md z-10">
                        <li>
                            <a
                                href="/"
                                className="block text-lg font-medium hover:text-orange-400 transition"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/about_us"
                                className="block text-lg font-medium hover:text-orange-400 transition"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="block text-lg font-medium hover:text-orange-400 transition"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/book-search"
                                className="block text-lg font-medium hover:text-orange-400 transition"
                            >
                               Library
                            </Link>
                        </li>
                        <li>
                            <a
                                href="/register"
                                className="block text-lg font-medium bg-orange-400 text-white px-4 py-2 rounded mt-2 hover:bg-orange-500 transition"
                            >
                                Register
                            </a>
                        </li>
                    </ul>
                )}
            </header>
        </>
    );
}

export default Header;
