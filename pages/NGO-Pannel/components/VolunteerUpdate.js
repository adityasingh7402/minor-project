// components/VolunteerUpdate.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VolunteerUpdate = () => {
  const [ngoProfile, setNgoProfile] = useState(null);
  const [hiredVolunteers, setHiredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch NGO Profile on component mount
  useEffect(() => {
    const fetchNgoProfile = async () => {
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
          throw new Error('Failed to fetch NGO profile');
        }

        const data = await response.json();
        setNgoProfile(data); // Set NGO profile data for further use
      } catch (error) {
        console.error('Error fetching NGO profile:', error);
        router.push('/Login');
      } finally {
        setLoading(false);
      }
    };

    fetchNgoProfile();
  }, [router]);

  // Fetch the list of hired volunteers and volunteer details
  useEffect(() => {
    if (!ngoProfile || !ngoProfile._id) return; // Ensure ngoProfile is valid

    const fetchHiredVolunteers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/hiredVolunteers/${ngoProfile._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch hired volunteers');
        }

        const data = await response.json();

        // Fetch volunteer details for each hired volunteer
        const volunteersWithDetails = await Promise.all(
          data.map(async (hire) => {
            const volunteerResponse = await fetch(`/api/getVolunteerProfile/${hire.volunteerId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('ngoToken')}`,
              },
            });
            if (!volunteerResponse.ok) {
              throw new Error('Failed to fetch volunteer details');
            }
            const volunteerData = await volunteerResponse.json();
            return { ...hire, volunteerProfile: volunteerData };
          })
        );

        setHiredVolunteers(volunteersWithDetails); // Set the final data with volunteer profiles
      } catch (error) {
        console.error('Error fetching hired volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiredVolunteers();
  }, [ngoProfile]);

  const removeVolunteer = async (hireId) => {
    try {
      const response = await fetch(`/api/hiredVolunteers/${ngoProfile._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hireId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove volunteer');
      }

      alert('Volunteer removed successfully');
      setHiredVolunteers((prevVolunteers) =>
        prevVolunteers.filter((volunteer) => volunteer._id !== hireId)
      ); // Update state correctly after removal
    } catch (error) {
      console.error('Error removing volunteer:', error);
      alert('Failed to remove volunteer');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Volunteer Update</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          {ngoProfile ? (
            <div className="mb-6">
              <h3 className="text-xl font-bold">NGO Profile</h3>
              <p><strong>Name:</strong> {ngoProfile.name}</p>
              <p><strong>Email:</strong> {ngoProfile.email}</p>
              <p><strong>Contact:</strong> {ngoProfile.contactNo}</p>
            </div>
          ) : (
            <p>No NGO profile found.</p>
          )}

          {hiredVolunteers.length === 0 ? (
            <p>No hired volunteers found.</p>
          ) : (
            <ul>
              {hiredVolunteers.map((volunteer) => (
                <li key={volunteer._id} className="p-4 border border-gray-300 rounded-lg mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">{volunteer.volunteerProfile?.name}</h3>
                      <p>Email: {volunteer.volunteerProfile?.email}</p>
                      <p>Contact: {volunteer.volunteerProfile?.phoneNo}</p>
                      <p>Hire Date: {new Date(volunteer.hireDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {volunteer.status}</p> {/* Display Status */}
                    </div>
                    <button
                      onClick={() => removeVolunteer(volunteer._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerUpdate;
