// pages/success.js
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Success = () => {
  const router = useRouter();
  const { type, ...details } = router.query;

  const renderDetails = () => {
    switch (type) {
      case 'ngo':
        return (
          <>
            <li>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                </div>
                <div className="min-w-0">
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Name : {details.name}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Email : {details.email}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Message : {details.message}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    NGO Name : {details.ngoName}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Contact Number : {details.contactNo}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Manager Name : {details.managerName}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Manager Contact No. : {details.managerContactNo}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Address : {details.address}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    NGO Type : {details.ngoType}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Website Link : {details.websiteLink}
                  </p>
                </div>
              </div>
            </li>
          </>
        );
      case 'volunteer':
        return (
          <>
            <li>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                </div>
                <div className="min-w-0">
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Name : {details.name}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Email : {details.email}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Phone : {details.phoneNo}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Address : {details.address}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Qualification : {details.qualification}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Purpose/Aim : {details.purposeAim}
                  </p>
                </div>
              </div>
            </li>
          </>
        );
      case 'donation':
        return (
          <>
            <li>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                </div>
                <div className="min-w-0">
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900 ">
                    Name : {details.name}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Email/Phone : {details.emailPhone}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Address : {details.address}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Donation : {details.option}
                  </p>
                  <p className="text-sm my-2 py-2 font-medium border-b border-gray-200 text-gray-900">
                    Purpose of Donation : {details.donorPurpose}
                  </p>
                </div>
              </div>
            </li>
          </>
        );
      default:
        return <p>No details available.</p>;
    }
  };

  return (
    <div className="success-container">
      <div className="flex h-full p-5 items-center justify-center">
        <div>
          <div className="flex flex-col items-center space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-green-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-4xl font-bold">Thank You !</h1>
            <p>Thank you for your interest! Your submission has been successfully received.</p>
            <div className="max-w-2xl mx-auto">
              <div className="p-2 max-w-md bg-white rounded-lg border shadow-md sm:p-8">
                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200">
                    {renderDetails()}
                  </ul>
                </div>
              </div>
            </div>
            <Link href={'/'}><button className="button-68" role="button"> Back to Home</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
