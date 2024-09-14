import React from 'react'
import { useState, useEffect } from 'react'

const Contact = () => {
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [message, setmessage] = useState("")
    const [disabled, setdisabled] = useState(true)

    useEffect(() => {
        if (name && email && message) {
            setdisabled(false)
        }
        else {
            setdisabled(true)
        }
    }, [name, email, message])

    const handleChange = async (e) => {
        e.preventDefault()
        if (e.target.name == 'name') {
            setname(e.target.value)
        }
        else if (e.target.name == 'email') {
            setemail(e.target.value)
        }
        else if (e.target.name == 'message') {
            setmessage(e.target.value)
        }
    }
    return (
        <div>
            <div className="image-face w-full relative">
                <img src="/3.jpg" alt="" className='image-container' />
                <div className="text-container">
                    <p className='text-5xl text-white' data-aos="fade-down" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
                        data-aos-mirror="true">WE&rsquo;RE READY, LET&rsquo;S TALK.</p>
                </div>
            </div>
            <div className="contact-side flex justify-center flex-col items-center mx-auto shadow-xl my-20 border border-green-800 p-10">
                <div className="contact flex flex-col">
                    <input value={name} onChange={handleChange} type="text" id="name" name='name' placeholder="Your Name" required className="p-3 outline-none focus:border-green-700 mb-5 input-bck text-gray-600 text-base border border-gray-300" />
                    <input value={email} onChange={handleChange} type="text" id="email" name="email" placeholder="Your Email / Mobile No" required className="p-3 outline-none focus:border-green-700 mb-5 input-bck text-gray-600 text-base border border-gray-300" />
                    <textarea value={message} onChange={handleChange} type="text" id="message" name="message" placeholder="Message" required cols="57" rows="5" className="p-3 resize-none outline-none focus:border-green-700 mb-5 input-bck text-gray-600 border text-base border-gray-300" />
                    <button disabled={disabled} className='font-medium rounded-full disabled:bg-green-500 hover:disabled:text-white disabled:cursor-default bg-green-700 w-52 px-10 py-4 hover:bg-white text-white hover:text-gray-800 border transition-all border-green-700' data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease-in-out"
                        data-aos-mirror="true"><h6>SEND MESSAGE</h6></button>
                </div>
            </div>
        </div>
    )
}

export default Contact