import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check for VolunteerToken in localStorage
        const token = localStorage.getItem('volunteerToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    return (
        <div>
            <div className="navbar flex justify-center items-center px-20 h-24 shadow-md relative z-20 bg-white">
                <div className="logo w-1/2">
                    <div className="logoImg">
                        <Link href={"/"}><img src="/logo.png" alt="" /></Link>
                    </div>
                </div>
                <div className="menus flex w-1/2 justify-center items-center ml-20" data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-once="false" data-aos-easing="ease-in-out"
                    data-aos-mirror="true">
                    <div className="list-menu mr-14 font-medium"><Link className=" hover:text-green-600 text-black" href={'/'}>Home</Link></div>
                    <div className="list-menu mr-14 font-medium"><Link className=" hover:text-green-600 text-black" href={'/about'}>About</Link></div>
                    <div className="list-menu ngos cursor-pointer relative mr-14 font-medium"><div className=" hover:text-green-600 text-black">NGOs</div>
                        <div className="sub-menu absolute top-0 -left-20 w-52">
                            <div className="sub-list-list bg-white flex justify-between shadow-md mt-16 items-start flex-col">
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/AddNGO'}>Add NGO&apos;s</Link>
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/NgosView'}>View NGO&apos;s</Link>
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/VolunteerView'}>View Volunteer&apos;s</Link>
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/DonationView'}>View Donation&apos;s</Link>
                            </div>
                        </div>
                    </div>
                    <div className="list-menu donation cursor-pointer relative mr-14 font-medium"><div className=" hover:text-green-600 text-black">Donation</div>
                        <div className="sub-menu-2 absolute top-0 -left-10 w-52">
                            <div className="sub-list-list bg-white flex justify-between shadow-md mt-16 items-start flex-col">
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/Donation'}>Donate</Link>
                                <Link className="px-6 py-3 hover:shadow-sm w-full hover:text-green-600 text-black" href={'/Volunteer'}>Become Volunteer</Link>
                            </div>
                        </div>
                    </div>
                    <div className="list-menu mr-14 font-medium"><Link className=" hover:text-green-600 text-black" href={'/Contact'}>Contact</Link></div>
                    {isLoggedIn ?(<Link href={'/volunteerDashboard'}><button className="button-68" role="button">Dashboard</button></Link>) :
                    (<Link href={'/Login'}><button className="button-68 w-24" role="button">Login</button></Link>)}
                </div>
            </div>
        </div>
    )
}

export default Navbar