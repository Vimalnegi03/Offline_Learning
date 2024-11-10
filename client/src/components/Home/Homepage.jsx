import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faComments, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
    return (
        <>
           

            {/* Hero Section */}
            <section className=" text-white h-screen flex items-center justify-center   " id="hero">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-4 -mt-11">
                    {/* Left Side Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlock your potential, learn from the best around you!</h1>
                        <p className="text-lg md:text-xl mb-8">Connect with tutors and students within 10 km. Enhance your skills with local experts.</p>
                        <a href="Register" className="bg-[#FF6F3C] text-white px-8 py-3 rounded text-lg hover:bg-[#FF5722] transition">Join Now</a>
                    </div>
                    {/* Right Side Image */}
                    <div className="flex justify-center md:justify-end">
                        <img src="hero-section.png" alt="Learning Illustration" className="w-full h-auto max-w-sm" />
                    </div>
                </div>
            </section>
            {/* Mission/about us Section */}


            <section className="py-12 mb-12  text-slate-100 " id="aboutUs">
                <div className="container mx-auto text-center mb-8 -mt-14">
                    <h2 className="text-5xl font-extrabold mb-6 text-orange-500 ">Our Mission</h2>
                    <p className="text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        "We believe in making quality learning accessible to everyone. Our mission is to connect students with local experts who can help them achieve their goals."
                    </p>
                </div>
            </section>
{/* Features Section */}
            <section className="py-11 px-8 bg-[#313649] scroll-smooth" id="features">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-orange-500">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">

                        <div className="p-6 bg-[#383C4D] rounded-lg shadow-md">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                            <h3 className="text-xl font-semibold mb-2 text-orange-400">Connect Locally</h3>
                            <p className="text-slate-300">Find tutors and students within 10 km and build stronger learning relationships.</p>
                        </div>

                        <div className="p-6 bg-[#383C4D] rounded-lg shadow-md">
                            <FontAwesomeIcon icon={faClock} className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                            <h3 className="text-xl font-semibold mb-2 text-orange-400">Flexible Learning</h3>
                            <p className="text-slate-300">Learn at your own pace and on your schedule with personalized lessons.</p>
                        </div>

                        <div className="p-6 bg-[#383C4D] rounded-lg shadow-md">
                            <FontAwesomeIcon icon={faComments} className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                            <h3 className="text-xl font-semibold mb-2 text-orange-400">Seamless Communication</h3>
                            <p className="text-slate-300">Chat with tutors and students to enhance collaboration and learning.</p>
                        </div>

                        <div className="p-6 bg-[#383C4D] rounded-lg shadow-md">
                            <FontAwesomeIcon icon={faLightbulb} className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                            <h3 className="text-xl font-semibold mb-2 text-orange-400">Skill Discovery</h3>
                            <p className="text-slate-300">Explore a variety of skills and topics to enhance your knowledge and abilities.</p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Homepage;