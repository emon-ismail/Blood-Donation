import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { t } from '../../utils/translations';

const Header = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: t('home', language), path: '/homepage', icon: 'Home' },
    { name: t('findDonors', language), path: '/find-donors', icon: 'Search' },
    { name: t('bloodRequests', language), path: '/blood-requests', icon: 'Heart' },
    { name: t('becomeDonor', language), path: '/donor-registration', icon: 'UserPlus' },
  ];

  const secondaryItems = [
    { name: t('dashboard', language), path: '/donor-dashboard', icon: 'LayoutDashboard' },
    { name: t('admin', language), path: '/admin-dashboard', icon: 'Settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-brand' : 'bg-white'
      } ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavigation('/homepage')}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-all duration-300">
                  <Icon name="Heart" size={24} color="white" className="heartbeat" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bengali font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                  LifeLink
                </h1>
                <p className="text-xs text-muted-foreground font-bengali">Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-white shadow-brand'
                    : 'text-text-primary hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span className={language === 'bn' ? 'font-bengali' : ''}>{item?.name}</span>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Emergency Button */}
            <LanguageToggle className="mr-2" />
            <Button
              variant="destructive"
              size="sm"
              iconName="Phone"
              iconPosition="left"
              className="heartbeat"
              onClick={() => handleNavigation('/blood-requests')}
            >
              <span className={language === 'bn' ? 'font-bengali' : ''}>{t('emergency', language)}</span>
            </Button>
            
            {/* Login/Logout Button */}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                onClick={() => {
                  logout();
                  navigate('/donor-login');
                }}
              >
                <span className="font-bengali">লগআউট</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                iconName="LogIn"
                iconPosition="left"
                onClick={() => handleNavigation('/donor-login')}
              >
                <span className="font-bengali">লগইন</span>
              </Button>
            )}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-all duration-300"
              >
                <Icon name="MoreHorizontal" size={18} />
                <span className={language === 'bn' ? 'font-bengali' : ''}>{language === 'bn' ? 'আরও' : 'More'}</span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-brand-lg border border-border z-60">
                  <div className="py-2">
                    {secondaryItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                          isActivePath(item?.path)
                            ? 'bg-primary text-white' :'text-text-primary hover:bg-muted hover:text-primary'
                        }`}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span className={language === 'bn' ? 'font-bengali' : ''}>{item?.name}</span>
                      </button>
                    ))}
                    <div className="border-t border-border my-2"></div>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-colors duration-200">
                      <Icon name="HelpCircle" size={16} />
                      <span className="font-bengali">সাহায্য</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-colors duration-200">
                      <Icon name="Info" size={16} />
                      <span className="font-bengali">সম্পর্কে</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageToggle className="mr-2" />
            <Button
              variant="destructive"
              size="sm"
              iconName="Phone"
              className="heartbeat"
              onClick={() => handleNavigation('/blood-requests')}
            >
              <span className={`text-xs ${language === 'bn' ? 'font-bengali' : ''}`}>{t('emergency', language)}</span>
            </Button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-text-primary hover:bg-muted hover:text-primary transition-all duration-300"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white relative z-50">
            <div className="py-4 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-white shadow-brand'
                      : 'text-text-primary hover:bg-muted hover:text-primary'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="font-bengali">{item?.name}</span>
                </button>
              ))}
              
              <div className="border-t border-border my-3"></div>
              
              {secondaryItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-white shadow-brand'
                      : 'text-text-primary hover:bg-muted hover:text-primary'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="font-bengali">{item?.name}</span>
                </button>
              ))}
              
              <div className="border-t border-border my-3"></div>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-all duration-300">
                <Icon name="HelpCircle" size={18} />
                <span className="font-bengali">সাহায্য</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-all duration-300">
                <Icon name="Info" size={18} />
                <span className="font-bengali">সম্পর্কে</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Floating Impact Bubble */}
      <div className="absolute top-20 right-4 hidden xl:block">
        <div className="bg-success text-white px-3 py-2 rounded-full text-xs font-medium shadow-brand float-up">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={14} className="heartbeat" />
            <span className="font-bengali">৫২৩ জীবন বাঁচানো হয়েছে</span>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;