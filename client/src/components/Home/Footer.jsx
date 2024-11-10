import React from 'react'

function Footer() {
  return (
    <>
        {/* Footer Section */}
        <footer className="bg-transparent text-white py-10 mt-12" id="footer" >
                <div className="container mx-auto text-center space-y-4">
                    <p>Contact us: support@lms.com</p>
                    <ul className="flex justify-center space-x-6">
                        <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    </ul>
                    <div className="space-x-4">
                        <a href="#" className="hover:underline">Twitter</a>
                        <a href="#" className="hover:underline">LinkedIn</a>
                    </div>
                </div>
            </footer>
    </>
  )
}

export default Footer
