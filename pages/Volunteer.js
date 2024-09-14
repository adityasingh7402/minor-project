import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Volunteer = () => {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [purposeAim, setPurposeAim] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (name && phoneNo && email && address && qualification && purposeAim && password && photo) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, phoneNo, email, address, qualification, purposeAim, password, photo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'phoneNo':
        setPhoneNo(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'qualification':
        setQualification(value);
        break;
      case 'purposeAim':
        setPurposeAim(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'photo':
        setPhoto(files[0]);
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
    formData.append('phoneNo', phoneNo);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('qualification', qualification);
    formData.append('purposeAim', purposeAim);
    formData.append('password', password);

    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await fetch('/api/Volunteer_ListApi', {
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
      setPhoneNo("");
      setEmail("");
      setAddress("");
      setQualification("");
      setPurposeAim("");
      setPassword("");
      setPhoto(null);
      setDisabled(true);

      const result = await response.json();
      console.log('Success:', result);

      // Redirect or show success message
      router.push({
        pathname: '/Success',
        query: { type: 'volunteer', name, email, phoneNo, address, qualification, purposeAim },
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
        <img src="/3.jpg" alt="" className='image-container' />
        <div className="text-container">
          <p className='text-5xl text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
            data-aos-mirror="true">VOLUNTEER REGISTRATION</p>
        </div>
      </div>
      <div className="contact-side flex justify-center flex-col items-center mx-auto shadow-xl my-20 border border-green-800 p-10">
        <div className="contact flex flex-col space-y-5">
          {/* Name and Phone No */}
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
                value={phoneNo}
                onChange={handleChange}
                type="text"
                id="phoneNo"
                name="phoneNo"
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="phoneNo" className="input-label">Phone Number</label>
            </div>
          </div>

          {/* Email and Address */}
          <div className="flex mb-4 space-x-12">
            <div className="relative">
              <input
                value={email}
                onChange={handleChange}
                type="email"
                id="email"
                name='email'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="email" className="input-label">Email</label>
            </div>
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
          </div>

          {/* Qualification and Purpose/Aim */}
          <div className="flex mb-4 space-x-12">
            <div className="relative">
              <input
                value={qualification}
                onChange={handleChange}
                type="text"
                id="qualification"
                name='qualification'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="qualification" className="input-label">Qualification</label>
            </div>
            <div className="relative">
              <input
                value={purposeAim}
                onChange={handleChange}
                type="text"
                id="purposeAim"
                name='purposeAim'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="purposeAim" className="input-label">Purpose/Aim</label>
            </div>
          </div>

          {/* Password and Photo */}
          <div className="flex mb-4 space-x-12">
            <div className="relative">
              <input
                value={password}
                onChange={handleChange}
                type="password"
                id="password"
                name='password'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="password" className="input-label">Password</label>
            </div>
            <div className="relative">
              <input
                type="file"
                onChange={handleChange}
                id="photo"
                name='photo'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="photo" className="input-label">Upload Photo</label>
            </div>
          </div>

          <button disabled={disabled || isSubmitting} onClick={handleSubmit} className='font-medium rounded-full disabled:bg-green-500 hover:disabled:text-white disabled:cursor-default bg-green-700 w-52 px-10 py-4 hover:bg-white text-white hover:text-gray-800 border transition-all border-green-700'>
          <h6>{isSubmitting ? "WAIT..." : "SUBMIT"}</h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
