import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NGOProfile() {
  const [ngo, setNgo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
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
    localStorage.removeItem('ngoToken');
    router.push('/login').then(() => {
      window.location.reload();
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setProfilePhoto(files[0]);
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

      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

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
    <div className='w-full mb-16'>
      <div className="container-reload w-96 flex justify-center mx-auto items-center">
        <img src="reload.gif" alt="Loading..." />
      </div>
    </div>
  );

  if (!ngo) return <p>No NGO profile data available</p>;

  return (
    <>
      <div className="image-face w-full relative">
        <img src="/3.jpg" alt="" className='image-container' />
        <div className="text-container">
          <p className='text-5xl uppercase text-white'>NGO Profile</p>
        </div>
      </div>
      <div className="h-screen flex justify-center items-start">
        <div className="bg-white p-6 -mt-16 rounded flex justify-center flex-col shadow-lg z-10">
          {!editMode ? (
            <>
              <div className="mb-4">
                <img src={ngo.photo || '/default-profile.png'} alt="Profile Picture" className="w-32 h-32 border border-green-800 p-2 rounded-full mx-auto" />
              </div>
              <div className="mb-4">
                <p className='pb-2 mb-3 border-b'><strong>NGO Name:</strong> {ngo.ngoName}</p>
                <p className='pb-2 mb-3 border-b'><strong>Email:</strong> {ngo.email}</p>
                <p className='pb-2 mb-3 border-b'><strong>Contact No:</strong> {ngo.contactNo}</p>
                <p className='pb-2 mb-3 border-b'><strong>Address:</strong> {ngo.address}</p>
                <p className='pb-2 mb-3 border-b'><strong>Manager Name:</strong> {ngo.managerName}</p>
                <p className='pb-2 mb-3 border-b'><strong>NGO Type:</strong> {ngo.ngoType}</p>
                <p className='pb-2 mb-3 border-b'><strong>Website:</strong> {ngo.websiteLink}</p>
              </div>
              <div className="profileButton flex justify-between mx-5 items-center">
                <button onClick={() => setEditMode(true)} className="bg-green-600 text-white px-4 py-2 rounded">Edit Profile</button>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Log Out</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-gray-700">NGO Name</label>
                <input type="text" name="ngoName" value={formData.ngoName || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact No</label>
                <input type="text" name="contactNo" value={formData.contactNo || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Manager Name</label>
                <input type="text" name="managerName" value={formData.managerName || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">NGO Type</label>
                <input type="text" name="ngoType" value={formData.ngoType || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Website</label>
                <input type="text" name="websiteLink" value={formData.websiteLink || ''} onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div>
              {/* <div className="mb-4">
                <label className="block text-gray-700">Profile Photo</label>
                <input type="file" name="profilePhoto" onChange={handleChange} className="mt-1 p-2 border-b border-gray-200 rounded w-full" />
              </div> */}
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{isSubmitting ? "WAIT..." : "Save Change"}</button>
              <button type="button" onClick={() => setEditMode(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
