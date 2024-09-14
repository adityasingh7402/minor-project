import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Donation = () => {
  const [name, setName] = useState("");
  const [emailPhone, setEmailPhone] = useState("");
  const [address, setAddress] = useState("");
  const [option, setOption] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [donorPurpose, setDonorPurpose] = useState("");
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (name && emailPhone && option && donorPurpose) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, emailPhone, address, option, paymentScreenshot, donorPurpose]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'emailPhone':
        setEmailPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'option':
        setOption(value);
        break;
      case 'paymentScreenshot':
        setPaymentScreenshot(files[0]);
        break;
      case 'donorPurpose':
        setDonorPurpose(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('emailPhone', emailPhone);
    formData.append('address', address);
    formData.append('option', option);
    formData.append('donorPurpose', donorPurpose);
  
    // Check if the file is present before appending
    if (paymentScreenshot) {
      formData.append('paymentScreenshot', paymentScreenshot);
    }
  
    try {
      const response = await fetch('/api/Donation_ListApi', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Clear form fields after successful submission
      setName("");
      setEmailPhone("");
      setAddress("");
      setOption("");
      setPaymentScreenshot(null);
      setDonorPurpose("");
      setDisabled(true);
  
      const result = await response.json();
      console.log('Success:', result);
  
      // Redirect or show success message
      router.push({
        pathname: '/Success',
        query: { type: 'donation', name, emailPhone, address, option, donorPurpose },
      });
    } catch (error) {
      console.error('Error:', error);
      // Optionally, show user-friendly error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="image-face w-full relative">
        <img src="/1.jpg" alt="" className='image-container' />
        <div className="text-container">
          <p className='text-5xl text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
            data-aos-mirror="true">DONATION FORM</p>
        </div>
      </div>
      <div className="contact-side flex justify-center flex-col items-center mx-auto shadow-xl my-20 border border-green-800 p-10">
        <div className="contact flex flex-col space-y-5">
          {/* Name and Email/Phone */}
          <div className="flex mb-4 space-x-12">
            <div className="relative">
              <input
                value={name}
                onChange={handleChange}
                type="text"
                id="name"
                name='name'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="name" className="input-label">Name</label>
            </div>
            <div className="relative">
              <input
                value={emailPhone}
                onChange={handleChange}
                type="text"
                id="emailPhone"
                name="emailPhone"
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="emailPhone" className="input-label">Email / Phone</label>
            </div>
          </div>

          {/* Address and Option */}
          <div className="flex pb-4 space-x-12">
            <div className="relative">
              <input
                value={address}
                onChange={handleChange}
                type="text"
                id="address"
                name='address'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="address" className="input-label">Address</label>
            </div>
            <div className="relative">
              <select
                value={option}
                onChange={handleChange}
                id="option"
                name='option'
                required
                className="input-field peer"
              >
                <option value="" disabled>Select Donation Option</option>
                <option value="Money">Money</option>
                <option value="Food">Food</option>
                <option value="Things">Things (Cloth, Blanket, Toys)</option>
              </select>
              <label htmlFor="option" className="input-label">Option</label>
            </div>
          </div>

          {/* Payment Screenshot and Donor Purpose */}
          <div className="flex pb-4 space-x-12">
            <div className="relative">
              <input
                type="file"
                onChange={handleChange}
                id="paymentScreenshot"
                name='paymentScreenshot'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="paymentScreenshot" className="input-label">Upload Payment/Object</label>
            </div>
            <div className="relative">
              <input
                value={donorPurpose}
                onChange={handleChange}
                type="text"
                id="donorPurpose"
                name='donorPurpose'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="donorPurpose" className="input-label">Purpose of Donation</label>
            </div>
          </div>

          <button disabled={disabled || isSubmitting} onClick={handleSubmit} className='font-medium rounded-full disabled:bg-green-500 hover:disabled:text-white disabled:cursor-default bg-green-700 w-52 px-10 py-4 hover:bg-white text-white hover:text-gray-800 border transition-all border-green-700'>
          <h6>{isSubmitting ? "WAIT..." : "DONATE"}</h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donation;
