// pages/index.js
import NgoDashboard from "./components/ngoDashboard";
import DashboardDefault from "./components/DashboardDefault";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [component, setComponent] = useState("DashboardDefault");
    const [activeLink, setActiveLink] = useState("Dashboard");

    const handleComponent = (item, linkName) => {
        setComponent(item);
        setActiveLink(linkName);
    };

    useEffect(() => {
        const fetchProfile = async () => {
          setLoading(true);
          try {
            const token = localStorage.getItem('ngoToken');
            if (!token) {
              router.push('/login');
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
            setProfilePhotos(data.profilePhotos || []); // Assuming your data has an array of profile photos
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

    const renderComponent = () => {
        switch (component) {
            case "NgoDashboard":
                return <NgoDashboard />;
            case "DashboardDefault":
            default:
                return <DashboardDefault />;
        }
    };

    return (
        <div className="flex">
            <aside className="bg-green-800 text-white w-64 min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-6">TailAdmin</h1>
                <nav>
                    <ul>
                        <li
                            className={`mb-2 flex items-center p-2 rounded cursor-pointer ${activeLink === "Dashboard" ? "bg-green-900" : ""}`}
                            onClick={() => handleComponent("DashboardDefault", "Dashboard")}
                        >
                            Dashboard
                        </li>
                        <li className="mt-4 text-lg font-semibold text-gray-200">Profile</li>
                        <li
                            className={`mb-2 flex items-center p-2 rounded cursor-pointer ${activeLink === "ProfileUpdate" ? "bg-green-900" : ""}`}
                            onClick={() => handleComponent("NgoDashboard", "ProfileUpdate")}
                        >
                            Profile Update
                        </li>
                        <li className="mt-6 font-semibold text-gray-200">Volunteer</li>
                        {["Volunteer Hire", "Volunteer Update", "Volunteer Task"].map((item) => (
                            <li
                                key={item}
                                className={`mb-2 p-2 rounded cursor-pointer ${activeLink === item ? "bg-green-900" : ""}`}
                                onClick={() => setActiveLink(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 bg-gray-100">
                <header className="flex justify-between items-center bg-white p-4 shadow-md">
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="bg-gray-100 rounded-full px-4 py-2 w-64"
                    />
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-700 font-semibold">{formData.ngoName}</span>
                        </div>
                    </div>
                </header>
                <div className="p-6 space-y-4">
                    {renderComponent()}
                </div>
            </main>
        </div>
    );
}
