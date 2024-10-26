import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('volunteer'); // Default role is Volunteer
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let apiEndpoint = '';
    switch (role) {
      case 'volunteer':
        apiEndpoint = '/api/Volunteer_Login';
        break;
      case 'ngo':
        apiEndpoint = '/api/NGO_Login';
        break;
      case 'admin':
        apiEndpoint = '/api/Admin_Login';
        break;
      default:
        apiEndpoint = '/api/Volunteer_Login';
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem(`${role}Token`, data.token);

        // Redirect to the respective dashboard based on the token present
        const token = localStorage.getItem('volunteerToken') || localStorage.getItem('ngoToken');
        const dashboardRoute = token ? (token === data.token ? (role === 'volunteer' ? '/Volunteer-Pannel' : '/NGO-Pannel') : null) : null;

        if (dashboardRoute) {
          router.push(dashboardRoute).then(() => {
            // Optionally, force a page reload after redirection
            window.location.reload();
          });
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to change role
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError(''); // Reset error message when role changes
  };

  // Role display mapping
  const roleDisplayName = {
    volunteer: 'Volunteer',
    ngo: 'NGO',
    admin: 'Admin',
  };

  return (
    <>
      {/* Hero Section */}
      <div className="image-face w-full relative">
        <img src="/3.jpg" alt="" className="image-container" />
        <div className="text-container">
          <p className="text-5xl text-white">LOGIN TO DASHBOARD</p>
        </div>
      </div>

      {/* Role Selector Buttons */}
      <div className="flex justify-center items-center my-10 space-x-4">
        <button
          onClick={() => handleRoleChange('volunteer')}
          className={`px-4 py-2 ${role === 'volunteer' ? 'bg-green-600' : 'bg-gray-300'} text-white rounded`}
        >
          Volunteer
        </button>
        <button
          onClick={() => handleRoleChange('ngo')}
          className={`px-4 py-2 ${role === 'ngo' ? 'bg-green-600' : 'bg-gray-300'} text-white rounded`}
        >
          NGO
        </button>
        <button
          onClick={() => handleRoleChange('admin')}
          className={`px-4 py-2 ${role === 'admin' ? 'bg-green-600' : 'bg-gray-300'} text-white rounded`}
        >
          Admin
        </button>
      </div>

      {/* Display Login as Role */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Login as {roleDisplayName[role]}?</h2>
      </div>

      {/* Login Form */}
      <div className="flex justify-center items-center my-10 border border-green-800 mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-sm">
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Submit Button */}
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            <h6>{isSubmitting ? 'WAIT...' : 'LOGIN'}</h6>
          </button>

          {/* Link to Registration for Volunteers */}
          {role === 'volunteer' && (
            <Link href="/Volunteer">
              <p className="flex justify-end text-green-800 font-medium pt-5">Register as Volunteer</p>
            </Link>
          )}
        </form>
      </div>
    </>
  );
};

export default Login;
