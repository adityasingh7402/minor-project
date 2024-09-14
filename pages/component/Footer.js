import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div>
<footer className="bg-green-600 shadow-md">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8" >
        <div className="sm:flex sm:items-center sm:justify-between" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
              data-aos-mirror="true"> 
            <Link href={"/"} className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src="/logo.png" className="w-14" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">KindnessNetwork</span>
            </Link>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0">
                <li>
                    <Link href={"/about"} className="hover:text-green-300 uppercase me-4 md:me-6">About</Link>
                </li>
                <li>
                    <Link href={"/NGOs"} className="hover:text-green-300 me-4 md:me-6">NGOs</Link>
                </li>
                <li>
                    <Link href={"/Donors"} className="hover:text-green-300 uppercase me-4 md:me-6">Donors</Link>
                </li>
                <li>
                    <Link href={"/Contact"} className="hover:text-green-300 uppercase">Contact</Link>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span  className="block text-sm text-white sm:text-center">© 2024 <Link href={"/"} className="hover:text-green-300 text-lg" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
              data-aos-mirror="true">KindnessNetwork</Link>. All Rights Reserved.</span>
    </div>
</footer>


    </div>
  )
}

export default Footer