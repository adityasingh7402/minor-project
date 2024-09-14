import "@/styles/globals.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { useEffect } from "react";
import BackToTopButton from "./component/BackToTopButton";
import Aos from "aos";
import 'aos/dist/aos.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    Aos.init();
  }, [])
  return <>
  <Navbar />
  <BackToTopButton />
  <Component {...pageProps} />
  <Footer />
  </>
}
