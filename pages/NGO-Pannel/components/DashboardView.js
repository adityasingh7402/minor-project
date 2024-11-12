import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const VolunteerView = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/getVolunteer');
        if (!response.ok) {
          throw new Error('Failed to fetch Volunteers');
        }
        const data = await response.json();
        setVolunteers(data);
      } catch (error) {
        console.error('Error fetching Volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Filter volunteers by approval status and search term
  const filteredVolunteers = volunteers
    .filter(volunteer => volunteer.approval === 'Approved') // Show only approved volunteers
    .filter(volunteer =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by search term
    );

  if (loading) return (
    <div className='w-full mb-16'>
      <div className="container-reload w-96 flex justify-center mx-auto items-center">
        <img src="reload.gif" alt="" />
      </div>
    </div>
  );

  return (
    <div className="container-view">

      <div className="search-container w-full mt-10 mb-5">
        <div className="flex justify-end pr-20">
          <input
            type="text"
            placeholder="Search Volunteer by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-b-2 border-green-800 rounded w-96 outline-none"
          />
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <p>No Volunteers available</p>
      ) : (
        <div className="container-view-list my-5">
          {filteredVolunteers.map((volunteer) => (
            <div key={volunteer._id} className="child-list flex justify-start items-center mb-10 shadow-md pb-5" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out" data-aos-mirror="true">
              <div className="left-view-con w-2/4 p-2 m-5">
                <div className="text-details flex justify-center flex-col px-16">
                  <h3 className='text-3xl pb-3 border-b font-medium'>{volunteer.name}</h3>
                  <p className='border-b text-xl mt-3 pb-1'>Personal Details</p>
                  <p className='pb-1 font-bold'>Contact Number : <span className='font-normal'>{volunteer.phoneNo}</span></p>
                  <p className='pb-1 font-bold'>Email : <span className='font-normal'>{volunteer.email}</span></p>
                  <p className='pb-1 font-bold'>Address : <span className='font-normal'>{volunteer.address}</span></p>
                  <p className='pb-1 font-bold'>Qualification : <span className='font-normal'>{volunteer.qualification}</span></p>
                  <p className='pb-1 font-bold'>Purpose/Aim : <span className='font-normal'>{volunteer.purposeAim}</span></p>
                </div>
              </div>
              <div className="right-view-con w-2/4 flex justify-center items-center">
                <div className="slider-image">
                  <img src={volunteer.photo} className="w-60 mx-auto" alt={`Volunteer Image`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerView;
