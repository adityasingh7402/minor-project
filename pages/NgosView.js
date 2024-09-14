import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const NgosView = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await fetch('/api/getNgos');
        if (!response.ok) {
          throw new Error('Failed to fetch NGOs');
        }
        const data = await response.json();
        setNgos(data);
        setFilteredNgos(data); // Initialize filteredNgos with the full list
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  useEffect(() => {
    // Filter NGOs based on the search query
    const filtered = ngos.filter((ngo) =>
      ngo.ngoName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNgos(filtered);
  }, [searchQuery, ngos]);

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
            VIEW NGOS
          </p>
        </div>
      </div>
      <div className="container-view-list my-14">
        <div className="search-conatiner w-full mt-10 mb-5">
          <div className="flex justify-end pr-20">
            <input
              type="text"
              placeholder="Search NGOs by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border-b-2 border-green-800 rounded w-96 outline-none"
            />
          </div>
        </div>

        {filteredNgos.length > 0 ? (
          filteredNgos.map((ngo) => (
            <div key={ngo._id} className="child-list flex justify-start items-center mb-20 shadow-md pb-10" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out" data-aos-mirror="true">
              <div className="left-view-con w-2/4 p-3 m-10">
                <div className="text-details flex justify-center flex-col px-16">
                  <h3 className='text-5xl pb-3 border-b font-medium'>{ngo.ngoName}</h3>
                  <p className='border-b text-xl mt-3 pb-2'>NGO Details</p>
                  <p className='pb-2 font-bold'>Email ID : <span className='font-normal'>{ngo.email}</span></p>
                  <p className='pb-2 font-bold'>Contact Number : <span className='font-normal'>{ngo.contactNo}</span></p>
                  <p className='pb-2 font-bold'>Address : <span className='font-normal'>{ngo.address}</span></p>
                  <p className='pb-2 font-bold'>Type of NGO : <span className='font-normal'>{ngo.ngoType} Orientation</span></p>
                  <p className='pb-2 font-bold'>Manager Name : <span className='font-normal'>{ngo.managerName}</span></p>
                  <p className='pb-2 font-bold'>Manager Contact Info : <span className='font-normal'>{ngo.managerContactNo}</span></p>
                  <p className='pb-2 font-bold'>Website Link : <span className='font-normal'><a href={ngo.websiteLink} target='_blank'>{ngo.websiteLink}</a></span></p>
                  <p className='pb-2 font-bold'>Advice : <span className='font-normal'>{ngo.message}</span></p>
                </div>
              </div>
              <div className="right-view-con w-2/4">
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
              </div>
            </div>
          ))
        ) : (
          <p>No NGOs available</p>
        )}
      </div>
    </div>
  );
};

export default NgosView;
