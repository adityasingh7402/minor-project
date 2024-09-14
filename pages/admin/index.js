import Head from "next/head";
import Link from "next/link";
import NGO_list from "./NGO_list";
import { useState } from "react";
import Volunteer_list from "./Volunteer_list";
import React, { useEffect } from "react";
import mongoose from "mongoose";
import { useRouter } from "next/router";

export default function Home() {
  const [active, setActive] = useState("NGO_list");
  const router = useRouter()
  return (
    <div className="overflow-hidden h-screen containerr">

      <Link href={'/'}><div className="gotoHome right-10 top-10 fixed cursor-pointer text-white p-2 bg-gray-300 font-bold text-4xl"></div></Link>
      <div className="my-8 px-5 w-full flex flex-row">
        <div className=" bg-green-900 w-56 border border-gray-200 rounded-sm py-8 px-5 shadow-sm h-min">
          <ul className="flex flex-col">
            <li className="text-xl pb-5 font-medium text-white flex items-center"><span className="text-2xl pr-5"></span> Inventory</li>
            <li onClick={() => setActive("NGO_list")} className="text-base pb-5 font-medium cursor-pointer hover:text-red-200 text-white flex items-center"><span className="text-xl pr-5"></span> List of NGO&apos;s</li>
            <li onClick={() => setActive("Volunteer_list")} className="text-base pb-5 font-medium cursor-pointer hover:text-red-200 text-white flex items-center"><span className="text-xl pr-5"></span> List of Volunteer&apos;s</li>
          </ul>
          <ul className="flex flex-col mt-2">
            <Link href={'/'}><li className="text-base pb-4 cursor-pointer hover:text-red-200 text-white flex items-center"><button className="px-5 py-2 border broder-white w-full rounded-full hover:bg-red-900"><p>Logout</p></button></li></Link>
          </ul>
        </div>
        <div className=" bg-white w-5/6 text-sm text-gray-800 ml-5 border border-gray-200 rounded-sm py-3 px-2 shadow-sm overflow-scroll h-screen">
          {active === "NGO_list" && <NGO_list />}
          {active === "Volunteer_list" && <Volunteer_list/>}
        </div>
      </div>
    </div>
  );
}



