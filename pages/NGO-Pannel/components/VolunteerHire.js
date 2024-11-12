import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ApprovedVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [formData2, setFormData2] = useState([]); // Store hired volunteers here

    // Fetch the NGO ID from an API or local storage
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
                    throw new Error('Failed to fetch NGO profile');
                }

                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.message === 'Failed to fetch NGO profile') {
                    router.push('/Login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    // Fetch hired volunteer IDs
    useEffect(() => {
        const fetchHiredVolunteers = async () => {
            try {
                const response = await fetch('/api/getHireVolunteer');
                if (!response.ok) {
                    throw new Error('Failed to fetch hired volunteers');
                }
                const data = await response.json();
                setFormData2(data); // Store hired volunteers data
            } catch (error) {
                console.error('Error fetching hired volunteers:', error);
            }
        };

        fetchHiredVolunteers();
    }, []);

    // Fetch approved and not-hired volunteers from the backend
    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await fetch('/api/getVolunteer');
                if (!response.ok) {
                    throw new Error('Failed to fetch volunteers');
                }
                const data = await response.json();
    
                // If formData2 is empty, only filter by approval status
                const hiredVolunteerIds = formData2.length > 0 ? new Set(formData2.map(v => v.volunteerId)) : new Set();
    
                const filteredVolunteers = data.filter(v => {
                    const isApproved = v.approval === 'Approved';
                    const isNotHired = formData2.length === 0 || !hiredVolunteerIds.has(v._id);
                    return isApproved && isNotHired;
                });
    
                setVolunteers(filteredVolunteers);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            } finally {
                setLoading(false);
            }
        };
    
        // Fetch volunteers only after formData2 (hired volunteers) is fetched
        if (formData2.length === 0 || formData2) {
            fetchVolunteers();
        }
    }, [formData2]);

    // Handle the hiring action
    const hireVolunteer = async (volunteerId, ngoId) => {
        if (!ngoId) {
            alert('NGO ID is not available. Please try again later.');
            return;
        }

        try {
            const response = await fetch(`/api/volunteers/hire/${volunteerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ngoId }), // Pass NGO ID here
            });

            if (!response.ok) {
                throw new Error('Failed to hire volunteer');
            }

            alert('Volunteer hired successfully');
            // Reload volunteers list after hiring
            setVolunteers(volunteers.filter(v => v._id !== volunteerId));
        } catch (error) {
            console.error('Error hiring volunteer:', error);
            alert('Failed to hire volunteer');
        }
    };

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4">Approved Volunteers</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {volunteers.length === 0 ? (
                        <p>No approved volunteers available.</p>
                    ) : (
                        <ul className="flex flex-col">
                            {volunteers.map((volunteer) => (
                                <li key={volunteer._id} className="p-4 border h-96 mb-3 w-full border-gray-300 rounded-lg flex flex-col justify-between">
                                    <div className="flex flex-row justify-between p-2 m-5">
                                        <div className="text-details w-2/4 flex justify-center flex-col">
                                            <h3 className='text-3xl pb-3 border-b font-medium'>{volunteer.name}</h3>
                                            <p className='border-b text-xl mt-3 pb-1'>Personal Details</p>
                                            <p className='pb-1 font-bold'>Contact Number : <span className='font-normal'>{volunteer.phoneNo}</span></p>
                                            <p className='pb-1 font-bold'>Email : <span className='font-normal'>{volunteer.email}</span></p>
                                            <p className='pb-1 font-bold'>Address : <span className='font-normal'>{volunteer.address}</span></p>
                                            <p className='pb-1 font-bold'>Qualification : <span className='font-normal'>{volunteer.qualification}</span></p>
                                            <p className='pb-1 font-bold'>Purpose/Aim : <span className='font-normal'>{volunteer.purposeAim}</span></p>
                                        </div>
                                        <div className="right-view-con w-2/4 flex justify-center items-center">
                                            <div className="slider-image">
                                                <img src={volunteer.photo} className="w-60 h-60 mx-auto" alt={`Volunteer Image`} />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => hireVolunteer(volunteer._id, formData._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Hire
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApprovedVolunteers;
