import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const [volunteer, setVolunteer] = useState(null);
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
        const token = localStorage.getItem('volunteerToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/volunteerProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setVolunteer(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.message === 'Failed to fetch profile') {
          router.push('/Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem('volunteerToken');
    router.push('/Login').then(() => {
      // Optionally, force a page reload after redirection
      // This may not be necessary if the Navbar uses state or context
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
      const token = localStorage.getItem('volunteerToken');
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto); // Adjust field name
      }

      const response = await fetch('/api/updateVolunteer', {
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
      setVolunteer(data);
      setEditMode(false);
      alert('Profile updated successfully');
      router.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <div className='w-full mb-16'>
    <div className="container-reload w-96 flex justify-center mx-auto items-center">
      <img src="reload.gif" alt="" />
    </div>
  </div>;

  if (!volunteer) return <p>No profile data available</p>;

  return (<>
    <div className="image-face w-full relative">
      <img src="/3.jpg" alt="" className='image-container' />
      <div className="text-container">
        <p className='text-5xl uppercase text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
          data-aos-mirror="true">Volunteer Profile</p>
      </div>
    </div>
    <div className="h-screen flex justify-center items-start">
      <div className="bg-white p-6 -mt-16 rounded flex justify-center flex-col withOFlogin shadow-lg withOFlogin z-10">
        {!editMode ? (
          <>
            <div className="mb-4">
              <img src={volunteer.photo || '/default-profile.png'} alt="Profile Picture" className="w-32 h-32 border border-green-800 p-2 rounded-full mx-auto" />
            </div>
            <div className="mb-4">
              <p className='pb-2 mb-3 border-b'><strong>Name:</strong> {volunteer.name}</p>
              <p className='pb-2 mb-3 border-b'><strong>Email:</strong> {volunteer.email}</p>
              <p className='pb-2 mb-3 border-b'><strong>Phone:</strong> {volunteer.phoneNo}</p>
              <p className='pb-2 mb-3 border-b'><strong>Address:</strong> {volunteer.address}</p>
              <p className='pb-2 mb-3 border-b'><strong>Qualification:</strong> {volunteer.qualification}</p>
              <p className='pb-2 mb-3 border-b'><strong>Purpose/Aim:</strong> {volunteer.purposeAim}</p>
            </div>
            <div className="profileButton flex justify-between mx-5 items-center">
              <button onClick={() => setEditMode(true)} className="bg-green-600 text-white px-4 py-2 rounded">Edit Profile</button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Log Out</button>
            </div>

          </>
        ) : (
          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input type="text" name="phoneNo" value={formData.phoneNo || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Purpose/Aim</label>
              <input type="text" name="purposeAim" value={formData.purposeAim || ''} onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Photo</label>
              <input type="file" name="profilePhoto" onChange={handleChange} className="mt-1  p-2 border-b border-gray-200 rounded w-full" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded"><h6>{isSubmitting ? "WAIT..." : "Save Change"}</h6></button>
            <button type="button" onClick={() => setEditMode(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
          </form>
        )}
      </div>
    </div>
  </>
  );
}
