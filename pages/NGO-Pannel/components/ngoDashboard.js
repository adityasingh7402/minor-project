import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

export default function NGOProfile() {
  const [ngo, setNgo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhotos, setProfilePhotos] = useState([]); // Change to store multiple images
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          throw new Error('Failed to fetch NGO profile');
        }

        const data = await response.json();
        setNgo(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.message === 'Failed to fetch NGO profile') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    // Remove the token from localStorage (adjust if you have other tokens)
    localStorage.removeItem('ngoToken');
    localStorage.removeItem('volunteerToken'); // Add this if you also support volunteers

    // Redirect to the login page
    router.push('/Login').then(() => {
      window.location.reload(); // Optionally reload the page after redirection
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhotos') {
      setProfilePhotos(Array.from(files)); // Store all selected images
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('ngoToken');
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      profilePhotos.forEach((photo, index) => {
        formDataToSend.append(`profilePhotos`, photo); // Append each photo to FormData
      });

      const response = await fetch('/api/updateNgo', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setNgo(data);
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

  if (!ngo) return <p className="text-center">No NGO profile data available</p>;

  return (
    <div className="flex flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/3 h-2/4 bg-white p-6 rounded shadow-lg flex flex-col justify-center items-center text-white">
        <div className="slider-image">
          <Splide options={{
            rewind: true,
            autoplay: true,
            speed: 800,
          }} aria-label="React Splide Example">
            {ngo.ngoImages.map((image, index) => (
              <SplideSlide key={index}>
                <img src={image} className="w-96 mx-auto" alt={`NGO Image ${index}`} />
              </SplideSlide>
            ))}
          </Splide>
        </div>
        <h1 className="text-5xl text-green-800 font-semibold mb-2">{ngo.ngoName}</h1>
        <p className="text-lg text-gray-700">{ngo.ngoType}</p>
        <button onClick={handleLogout} className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">
          Log Out
        </button>
      </aside>

      {/* Profile Content */}
      <main className="w-2/3 pl-5 overflow-y-auto">
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-semibold text-gray-800">NGO Profile</h2>
            <button onClick={() => setEditMode(!editMode)} className="bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700">
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <p><strong>Email:</strong> {ngo.email}</p>
              <p><strong>Contact No:</strong> {ngo.contactNo}</p>
              <p><strong>Address:</strong> {ngo.address}</p>
              <p><strong>Manager Name:</strong> {ngo.managerName}</p>
              <p><strong>NGO Type:</strong> {ngo.ngoType}</p>
              <p><strong>Website:</strong> <a href={ngo.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ngo.websiteLink}</a></p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" name="ngoName" placeholder="NGO Name" value={formData.ngoName || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="text" name="contactNo" placeholder="Contact No" value={formData.contactNo || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="text" name="address" placeholder="Address" value={formData.address || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="text" name="managerName" placeholder="Manager Name" value={formData.managerName || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="text" name="ngoType" placeholder="NGO Type" value={formData.ngoType || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="url" name="websiteLink" placeholder="Website Link" value={formData.websiteLink || ''} onChange={handleChange} className="block w-full p-2 border rounded" />
              <input type="file" name="profilePhotos" onChange={handleChange} className="block w-full p-2 border rounded" multiple /> {/* Allow multiple files */}
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded shadow-lg hover:bg-green-700 mt-4">{isSubmitting ? "WAIT..." : "Save Changes"}</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
