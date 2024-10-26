import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AddNGO = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerContactNo, setManagerContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [ngoType, setNgoType] = useState("");
  const [password, setPassword] = useState("");
  const [capital, setCapital] = useState("");
  const [ngoImages, setNgoImages] = useState([]);
  const [websiteLink, setWebsiteLink] = useState("");
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (
      name && email && message && ngoName && contactNo && capital && password && managerName &&
      managerContactNo && address && ngoType && ngoImages.length > 0 && websiteLink
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, message, ngoName, password, contactNo, capital, managerName, managerContactNo, address, ngoType, ngoImages, websiteLink]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'message':
        setMessage(value);
        break;
      case 'ngoName':
        setNgoName(value);
        break;
      case 'contactNo':
        setContactNo(value);
        break;
      case 'managerName':
        setManagerName(value);
        break;
      case 'capital':
        setCapital(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'managerContactNo':
        setManagerContactNo(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'ngoType':
        setNgoType(value);
        break;
      case 'ngoImages':
        setNgoImages(Array.from(files));
        break;
      case 'websiteLink':
        setWebsiteLink(value);
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
    formData.append('email', email);
    formData.append('message', message);
    formData.append('ngoName', ngoName);
    formData.append('contactNo', contactNo);
    formData.append('managerName', managerName);
    formData.append('password', password);
    formData.append('capital', capital);
    formData.append('managerContactNo', managerContactNo);
    formData.append('address', address);
    formData.append('ngoType', ngoType);
    formData.append('websiteLink', websiteLink);

    ngoImages.forEach((file) => {
      formData.append('ngoImages', file);
    });

    try {
      const response = await fetch('/api/NGO_ListApi', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setName("");
      setEmail("");
      setMessage("");
      setNgoName("");
      setCapital("");
      setContactNo("");
      setManagerName("");
      setManagerContactNo("");
      setAddress("");
      setNgoType("");
      setPassword("");
      setNgoImages([]);
      setWebsiteLink("");
      setDisabled(true);
      const result = await response.json();
      console.log('Success:', result);
      router.push({
        pathname: '/Success',
        query: { type: 'ngo', name, email, message, ngoName, capital, contactNo, managerName, managerContactNo, address, ngoType, websiteLink },
      });
      // Handle success (e.g., show a success message, reset the form, etc.)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="image-face w-full relative">
        <img src="/2.jpg" alt="" className='image-container' />
        <div className="text-container">
          <p className='text-5xl text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
            data-aos-mirror="true">ADD YOU NGO</p>
        </div>
      </div>
      <div className="contact-side flex justify-center flex-col items-center mx-auto shadow-xl my-20 border border-green-800 p-10">
        <div className="contact flex flex-col space-y-5">
          {/* First Row */}
          <div className="flex pb-2 space-x-12">
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
              <label htmlFor="name" className="input-label">Your Name</label>
            </div>
            <div className="relative">
              <input
                value={email}
                onChange={handleChange}
                type="text"
                id="email"
                name="email"
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="email" className="input-label">Your Email / Mobile No</label>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex pb-2 space-x-12">
            <div className="relative">
              <input
                value={ngoName}
                onChange={handleChange}
                type="text"
                id="ngoName"
                name='ngoName'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="ngoName" className="input-label">NGO Name</label>
            </div>
            <div className="relative">
              <input
                value={contactNo}
                onChange={handleChange}
                type="text"
                id="contactNo"
                name='contactNo'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="contactNo" className="input-label">Contact No</label>
            </div>
          </div>
          <div className="flex pb-2 space-x-12">
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
              <label htmlFor="password" className="input-label">Enter Password</label>
            </div>
            <div className="relative">
              <input
                value={capital}
                onChange={handleChange}
                type="text"
                id="capital"
                name='capital'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="capital" className="input-label">NGO Capital</label>
            </div>
          </div>

          {/* Third Row */}
          <div className="flex pb-2 space-x-12">
            <div className="relative">
              <input
                value={managerName}
                onChange={handleChange}
                type="text"
                id="managerName"
                name='managerName'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="managerName" className="input-label">Manager Name</label>
            </div>
            <div className="relative">
              <input
                value={managerContactNo}
                onChange={handleChange}
                type="text"
                id="managerContactNo"
                name='managerContactNo'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="managerContactNo" className="input-label">Manager Contact No</label>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="flex pb-2 space-x-12">
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
                value={ngoType}
                onChange={handleChange}
                id="ngoType"
                name='ngoType'
                required
                className="input-field peer"
              >
                <option value="" disabled>Select Type of NGO</option>
                <option value="charitable">Charitable Orientation</option>
                <option value="service">Service Orientation</option>
                <option value="participatory">Participatory Orientation</option>
                <option value="empowering">Empowering Orientation</option>
              </select>
              <label htmlFor="ngoType" className="input-label">NGO Type</label>
            </div>
          </div>

          {/* Fifth Row */}
          <div className="flex pb-2 space-x-12">
            <div className="relative">
              <input
                type="file"
                onChange={handleChange}
                id="ngoImages"
                name='ngoImages'
                className="input-field peer"
                multiple
                placeholder=" "
              />
              <label htmlFor="ngoImages" className="input-label">Images of Your NGO - Add more then 4</label>
            </div>
            <div className="relative">
              <input
                value={websiteLink}
                onChange={handleChange}
                type="text"
                id="websiteLink"
                name='websiteLink'
                className="input-field peer"
                placeholder=" "
              />
              <label htmlFor="websiteLink" className="input-label">Website Link</label>
            </div>
          </div>

          {/* Message Row */}
          <div className="relative">
            <textarea
              value={message}
              onChange={handleChange}
              id="message"
              name="message"
              className="input-field peer resize-none text-area"
              placeholder=" "
              cols="57"
              rows="5"
            />
            <label htmlFor="message" className="input-label">Message</label>
          </div>
          <button disabled={disabled || isSubmitting} onClick={handleSubmit} className='font-medium rounded-full disabled:bg-green-500 hover:disabled:text-white disabled:cursor-default bg-green-700 w-52 px-10 py-4 hover:bg-white text-white hover:text-gray-800 border transition-all border-green-700'>
          <h6>{isSubmitting ? "WAIT..." : "ADD NGO"}</h6>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AddNGO;
