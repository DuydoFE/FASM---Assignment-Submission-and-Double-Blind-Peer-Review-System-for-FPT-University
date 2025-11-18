import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";
import { Outlet } from "react-router-dom";
import Aurora from "@/components/Aurora"; 

function Layout() {
  return (
    <div className="relative min-h-screen bg-black text-zinc-200">
      <Aurora
        className="absolute top-0 left-0 w-full h-full z-0"
        
        
        colorStops={['#0055FF', '#FF8C00', '#20BF55']}

        blend={0.5}
        amplitude={1.0}
        speed={0.2}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;