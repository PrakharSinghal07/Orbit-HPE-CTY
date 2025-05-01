import { useRef, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar/Sidebar';


const Layout = () => {

    return (
        <>  
            <div
                    className="flex-1 transition-all duration-300 md:ml-28"
                    
                >
                    <Outlet />
            </div>
        </>
  
    );
};

export default Layout;
