import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/adminProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setAdmin(data);
        setFormData({ email: data.email, password: '' }); // Keep password empty for security
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');

    router.push('/Login').then(() => {
      window.location.reload();
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/updateAdmin', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Set Content-Type for JSON data
        },
        body: JSON.stringify(formData), // Send the email and password as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setAdmin(data);
      setEditMode(false);
      alert('Profile updated successfully');
      router.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="container-reload flex justify-center items-center">
        <img src="reload.gif" alt="Loading..." />
      </div>
    </div>
  );

  if (!admin) return <p className="text-center">No profile data available</p>;

  return (
    <div className="flex flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/3 h-2/4 bg-white p-6 rounded shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-5xl text-green-800 font-semibold mb-2">{admin.email}</h1>
        <button onClick={handleLogout} className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
          Log Out
        </button>
      </aside>

      {/* Profile Content */}
      <main className="w-2/3 pl-5 overflow-y-auto">
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-semibold text-gray-800">Admin Profile</h2>
            <button onClick={() => setEditMode(!editMode)} className="bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700">
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <p><strong>Email:</strong> {admin.email}</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full p-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full p-2 border rounded"
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                <h6>{isSubmitting ? "WAIT..." : "Save Changes"}</h6>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
