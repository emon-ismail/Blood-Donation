import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const quickLinks = [
    { name: 'রক্তদাতা হন', path: '/donor-registration', icon: 'UserPlus' },
    { name: 'রক্ত খুঁজুন', path: '/find-donors', icon: 'Search' },
    { name: 'জরুরি অনুরোধ', path: '/blood-requests', icon: 'AlertCircle' },
    { name: 'ড্যাশবোর্ড', path: '/donor-dashboard', icon: 'LayoutDashboard' }
  ];

  const supportLinks = [
    { name: 'সাহায্য কেন্দ্র', path: '/help' },
    { name: 'যোগাযোগ', path: '/contact' },
    { name: 'গোপনীয়তা নীতি', path: '/privacy' },
    { name: 'ব্যবহারের শর্তাবলী', path: '/terms' }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const emergencyContacts = [
    { name: 'জাতীয় জরুরি সেবা', number: '999' },
    { name: 'অ্যাম্বুলেন্স সেবা', number: '16263' },
    { name: 'LifeLink হটলাইন', number: '09666-778899' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={24} color="white" className="heartbeat" />
              </div>
              <div>
                <h3 className="text-xl font-bengali font-bold">LifeLink</h3>
                <p className="text-sm text-gray-300 font-bengali">Bangladesh</p>
              </div>
            </div>
            <p className="text-gray-300 font-bengali leading-relaxed mb-6">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত রক্তদান প্ল্যাটফর্ম। আমরা জরুরি মুহূর্তে রক্তের প্রয়োজনে দাতা ও গ্রহীতার মধ্যে সেতুবন্ধন তৈরি করি।
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Icon name="Facebook" size={18} />
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Icon name="Twitter" size={18} />
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Icon name="Instagram" size={18} />
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors duration-300">
                <Icon name="Youtube" size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold font-bengali mb-6">দ্রুত লিংক</h4>
            <div className="space-y-3">
              {quickLinks?.map((link) => (
                <button
                  key={link?.path}
                  onClick={() => navigate(link?.path)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  <Icon name={link?.icon} size={16} className="group-hover:text-primary" />
                  <span className="font-bengali">{link?.name}</span>
                </button>
              ))}
            </div>

            {/* Blood Groups Quick Access */}
            <div className="mt-8">
              <h5 className="text-sm font-bold font-bengali mb-4 text-gray-400">রক্তের গ্রুপ</h5>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups?.map((group) => (
                  <button
                    key={group}
                    onClick={() => navigate(`/find-donors?bloodGroup=${group}`)}
                    className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-300"
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-bold font-bengali mb-6">সহায়তা</h4>
            <div className="space-y-3">
              {supportLinks?.map((link) => (
                <button
                  key={link?.path}
                  onClick={() => navigate(link?.path)}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-bengali"
                >
                  {link?.name}
                </button>
              ))}
            </div>

            {/* App Download */}
            <div className="mt-8">
              <h5 className="text-sm font-bold font-bengali mb-4 text-gray-400">অ্যাপ ডাউনলোড</h5>
              <div className="space-y-2">
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors duration-300">
                  <Icon name="Smartphone" size={16} />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on</p>
                    <p className="text-sm font-medium">Google Play</p>
                  </div>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors duration-300">
                  <Icon name="Smartphone" size={16} />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on</p>
                    <p className="text-sm font-medium">App Store</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-lg font-bold font-bengali mb-6">জরুরি যোগাযোগ</h4>
            <div className="space-y-4">
              {emergencyContacts?.map((contact, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm font-bengali text-gray-300 mb-1">{contact?.name}</p>
                  <button
                    onClick={() => window.open(`tel:${contact?.number}`)}
                    className="flex items-center space-x-2 text-white hover:text-primary transition-colors duration-300"
                  >
                    <Icon name="Phone" size={16} />
                    <span className="font-bold">{contact?.number}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Emergency Button */}
            <Button
              variant="destructive"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
              className="w-full mt-6 heartbeat"
              onClick={() => navigate('/blood-requests')}
            >
              <span className="font-bengali">জরুরি সাহায্য</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">১২৪৭+</p>
              <p className="text-sm text-gray-400 font-bengali">নিবন্ধিত দাতা</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">৫২ৃ+</p>
              <p className="text-sm text-gray-400 font-bengali">জীবন বাঁচানো</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">৬৪</p>
              <p className="text-sm text-gray-400 font-bengali">জেলায় সেবা</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">৯৮%</p>
              <p className="text-sm text-gray-400 font-bengali">সফল সংযোগ</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <p className="font-bengali">
                © {currentYear} LifeLink Bangladesh. সকল অধিকার সংরক্ষিত।
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="font-bengali">SSL সুরক্ষিত</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-warning" />
                <span className="font-bengali">ISO সার্টিফাইড</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Heart" size={16} className="text-primary heartbeat" />
                <span className="font-bengali">Made with ♥ in Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Emergency Button for Mobile */}
      <div className="fixed bottom-20 left-4 z-50 md:hidden">
        <Button
          variant="destructive"
          size="icon"
          className="w-14 h-14 rounded-full shadow-brand-lg heartbeat"
          onClick={() => navigate('/blood-requests')}
        >
          <Icon name="Phone" size={20} />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;