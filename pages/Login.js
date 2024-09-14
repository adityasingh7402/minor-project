import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/Volunteer_Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem('volunteerToken', data.token);

        // Redirect to the dashboard
        router.push('/volunteerDashboard').then(() => {
          // Optionally, force a page reload after redirection
          // This may not be necessary if the Navbar uses state or context
          window.location.reload();
        });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="image-face w-full relative">
        <img src="/3.jpg" alt="" className='image-container' />
        <div className="text-container">
          <p className='text-5xl text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out" data-aos-mirror="true">VOLUNTEER LOGIN</p>
        </div>
      </div>
      <div className="flex justify-center withOFlogin items-center my-20 border border-green-800 mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md withOFlogin max-w-sm">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            <h6>{isSubmitting ? "WAIT..." : "LOGIN"}</h6>
          </button>
          <Link href={'Volunteer'}><p className='flex justify-end text-green-800 font-medium pt-5'>Register as Volunteer</p></Link>
        </form>
      </div>
    </>
  );
};

export default Login;
