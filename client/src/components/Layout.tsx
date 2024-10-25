import React from 'react';
import { Outlet } from 'react-router-dom';
import ToasterProvider from '../providers/ToasterProvider';
import RegisterModal from './modals/RegisterModal';
import LoginModal from './modals/LoginModal';
import RentModal from './modals/RentModal';
import Navbar from './navbar/Navbar';
import SearchModal from './modals/SearchModal';

const Layout: React.FC = () => {
  return (
    <div>
      <ToasterProvider />
      <RegisterModal />
      <LoginModal />
      <RentModal />
      <SearchModal/>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
