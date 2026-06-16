import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-heading text-lg mb-4">FASHION</h4>
            <p className="text-sm text-gray-500">Premium clothing for the modern individual.</p>
          </div>
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider mb-3">Client Service</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="#" className="hover:text-[#b8a28c]">After-sale Service</Link></li>
              <li><Link to="#" className="hover:text-[#b8a28c]">Free Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider mb-3">Our Brand</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="#" className="hover:text-[#b8a28c]">The Company</Link></li>
              <li><Link to="#" className="hover:text-[#b8a28c]">The Excellence</Link></li>
              <li><Link to="#" className="hover:text-[#b8a28c]">International Awards</Link></li>
              <li><Link to="#" className="hover:text-[#b8a28c]">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm uppercase tracking-wider mb-3">Luxury Clothing</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/products?category=1" className="hover:text-[#b8a28c]">Special Edition</Link></li>
              <li><Link to="/products?category=2" className="hover:text-[#b8a28c]">Summer Edition</Link></li>
              <li><Link to="/products?category=3" className="hover:text-[#b8a28c]">Unique Collection</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <span>Worldwide / English</span>
          </div>
          <div className="flex space-x-6">
            <Link to="#" className="hover:text-[#b8a28c]">Cookie Policy</Link>
            <Link to="#" className="hover:text-[#b8a28c]">Privacy Policy</Link>
            <Link to="#" className="hover:text-[#b8a28c]">Legal Notes</Link>
          </div>
          <div className="mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} FASHION. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;