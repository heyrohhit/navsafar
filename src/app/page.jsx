"use client"
import { useState, useEffect } from 'react';
import { StarterLoader } from './components/starter-loader';
import { usePathname } from 'next/navigation';
import { PremiumHeader } from './components/premium-header';
import  HomePage  from './pages/home';
import  AboutPage  from './about/page';
import  ServicesPage  from './services/page';
import  CorporatePage  from './corporate/page';
import  BookingPage from './booking/page';
import  ContactPage  from './contact/page';


export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(()=>{
      setShowLoader(false);
    }, 3000)
    return () => clearTimeout(timer)
  }, []);

  if (showLoader) {
    return <StarterLoader/>;
  }

  const randerPage =()=>{
    switch(pathname){
      case "/":
      return <HomePage/>;
      case "/about":
        return <AboutPage/>;
      case "/services":
        return <ServicesPage/>;
      case "/corporate":
        return <CorporatePage/>;
      case "/booking":
        return <BookingPage/>;
      case "/contact":
        return <ContactPage/>;
      default:
        return <HomePage/>
    }
  }

  return (
      <div className="min-h-screen">
        {randerPage()}
        {/* Premium Footer */}
      </div>
  
  );
}
