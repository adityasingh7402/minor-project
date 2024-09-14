import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const DonationView = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/getDonation');
        if (!response.ok) {
          throw new Error('Failed to fetch Donations');
        }
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error('Error fetching Donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className='w-full mb-16'>
    <div className="container-reload w-96 flex justify-center mx-auto items-center">
      <img src="reload.gif" alt="" />
    </div>
  </div>;

  return (
    <div className="container-view">
      <div className="image-face w-full relative">
        <img src="/3.jpg" alt="" className="image-container" />
        <div className="text-container">
          <p className="text-5xl text-white" data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out" data-aos-mirror="true">
            VIEW DONATIONS
          </p>
        </div>
      </div>

      <div className="search-conatiner w-full mt-10 mb-5">
        <div className="flex justify-end pr-20">
          <input
            type="text"
            placeholder="Search Donation by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-b-2 border-green-800 rounded w-96 outline-none"
          />
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <p>No Donations available</p>
      ) : (
        <div className="container-view-list my-14">
          {filteredDonations.map((donation) => (
            <div key={donation._id} className="child-list flex justify-start items-center mb-20 shadow-md pb-10" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out" data-aos-mirror="true">
              <div className="left-view-con w-2/4 p-3 m-10">
                <div className="text-details flex justify-center flex-col px-16">
                  <h3 className='text-5xl pb-3 border-b font-medium'>{donation.name}</h3>
                  <p className='border-b text-xl mt-3 pb-2'>Personal Details</p>
                  <p className='pb-2 font-bold'>Contact Info : <span className='font-normal'>{donation.emailPhone}</span></p>
                  <p className='pb-2 font-bold'>Address : <span className='font-normal'>{donation.address}</span></p>
                  <p className='pb-2 font-bold'>Donation : <span className='font-normal'>{donation.option}</span></p>
                  <p className='pb-2 font-bold'>Purpose of Donation : <span className='font-normal'>{donation.donorPurpose}</span></p>
                </div>
              </div>
              <div className="right-view-con w-2/4 flex justify-center items-center">
                <div className="slider-image">
                      <img src={donation.paymentScreenshot} className="w-96 h-96 mx-auto" alt={`Donation Image`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationView;
