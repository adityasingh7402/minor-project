import NgoDashboard from "./components/ngoDashboard";
import DashboardDefault from "./components/DashboardDefault";
import VolunteerHire from "./components/VolunteerHire";
import VolunteerUpdate from "./components/VolunteerUpdate";
import VolunteerTask from "./components/VolunteerTask";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [component, setComponent] = useState("DashboardDefault");
    const [activeLink, setActiveLink] = useState("Dashboard");
    const [profilePhotos, setProfilePhotos] = useState([]); // For profile photos, if any

    // Function to handle component change
    const handleComponent = (item, linkName) => {
        setComponent(item);
        setActiveLink(linkName);
    };

    // Fetch NGO Profile details
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('ngoToken');
                if (!token) {
                    router.push('/Login');
                    return;
                }

                const response = await fetch('/api/ngoProfile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setFormData(data);
                setProfilePhotos(data.profilePhotos || []); // Assuming profile data contains photos
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.message === 'Failed to fetch profile') {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    // Render selected component
    const renderComponent = () => {
        switch (component) {
            case "NgoDashboard":
                return <NgoDashboard />;
            case "VolunteerHire":
                return <VolunteerHire />;
            case "VolunteerUpdate":
                return <VolunteerUpdate />;
            case "VolunteerTask":
                return <VolunteerTask />;
            case "DashboardDefault":
            default:
                return <DashboardDefault />;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="bg-green-800 text-white w-64 min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-6">TailAdmin</h1>
                <nav>
                    <ul>
                        {/* Dashboard link */}
                        <li
                            className={`mb-2 flex items-center p-2 rounded cursor-pointer ${activeLink === "Dashboard" ? "bg-green-900" : ""}`}
                            onClick={() => handleComponent("DashboardDefault", "Dashboard")}
                        >
                            Dashboard
                        </li>

                        {/* Profile Section */}
                        <li className="mt-4 text-lg font-semibold text-gray-200">Profile</li>
                        <li
                            className={`mb-2 flex items-center p-2 rounded cursor-pointer ${activeLink === "ProfileUpdate" ? "bg-green-900" : ""}`}
                            onClick={() => handleComponent("NgoDashboard", "ProfileUpdate")}
                        >
                            Profile Update
                        </li>

                        {/* Volunteer Section */}
                        <li className="mt-6 font-semibold text-gray-200">Volunteer</li>
                        {["Volunteer Hire", "Volunteer Update", "Volunteer Task"].map((item) => (
                            <li
                                key={item}
                                className={`mb-2 p-2 rounded cursor-pointer ${activeLink === item ? "bg-green-900" : ""}`}
                                onClick={() => {
                                    const componentName = item.replace(" ", "");
                                    handleComponent(componentName, item);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-4 shadow-md">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="bg-gray-100 rounded-full px-4 py-2 w-64"
                    />

                    {/* Profile Section */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-700 font-semibold">{formData.ngoName}</span>
                            <div className="relative">
                                {profilePhotos.length > 0 && (
                                    <img
                                        src={profilePhotos[0]} // Assuming profilePhotos is an array with URLs
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        renderComponent()
                    )}
                </div>
            </main>
        </div>
    );
}
