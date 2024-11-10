import React from 'react'

function Header() {
  return (
    <>
       {/* Header Section */}
       <header className="my-5 py-4">
                <nav className="container mx-auto flex justify-between items-center px-4">
                    <a href="#" className="text-white text-3xl font-bold">LMS</a>
                    <ul className="hidden md:flex space-x-8 text-white">
                        <li>
                            <a href="/" className="text-xl transition-transform transform hover:scale-105 hover:text-[#FF6F3C] ">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-xl transition-transform transform hover:scale-105 hover:text-[#FF6F3C]">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-xl transition-transform transform hover:scale-105 hover:text-[#FF6F3C]">
                                Features
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-xl transition-transform transform hover:scale-105 hover:text-[#FF6F3C]">
                                Contact
                            </a>
                        </li>
                    </ul>
                    <div className="flex space-x-4">
                        <a href="/login" className="text-white border border-white px-4 py-2 rounded hover:bg-[#FF6F3C] hover:text-[#2D2A59] transition">Login</a>
                        <a href="/register" className="bg-white text-[#2D2A59] px-4 py-2 rounded hover:bg-[#FF6F3C] hover:text-white transition">Register</a>
                    </div>
                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white">☰</button>
                </nav>
            </header>
    </>
  )
}

export default Header
