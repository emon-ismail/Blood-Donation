import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { donorService } from '../../lib/donorService';
import { bloodRequestService, donationService, successStoryService } from '../../lib/bloodRequestService';
import HeroSection from './components/HeroSection';
import UrgentRequestsTicker from './components/UrgentRequestsTicker';
import ImpactDashboard from './components/ImpactDashboard';
import SuccessStoriesCarousel from './components/SuccessStoriesCarousel';
import Footer from './components/Footer';
import { useTranslation } from '../../hooks/useTranslation';

const Homepage = () => {
  const { t, language, isBengali } = useTranslation();
  const [stats, setStats] = useState({
    totalDonors: 0,
    livesSaved: 0,
    activeRequests: 0,
    totalDonations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [donorStats, requestStats, donationStats] = await Promise.all([
        donorService.getDonorStats(),
        bloodRequestService.getRequestStats(),
        donationService.getDonationStats()
      ]);

      setStats({
        totalDonors: donorStats.verified,
        livesSaved: donationStats.total,
        activeRequests: requestStats.active,
        totalDonations: donationStats.total
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{isBengali ? 'LifeLink Bangladesh - আপনার রক্ত, তাদের আশা | বাংলাদেশের বিশ্বস্ত রক্তদান প্ল্যাটফর্ম' : 'LifeLink Bangladesh - Your Blood, Their Hope | Trusted Blood Donation Platform'}</title>
        <meta 
          name="description" 
          content="বাংলাদেশের সবচেয়ে বিশ্বস্ত রক্তদান প্ল্যাটফর্ম। জরুরি মুহূর্তে রক্তের প্রয়োজনে দাতা ও গ্রহীতার মধ্যে সেতুবন্ধন। ১২৪৭+ দাতা, ৫২৩+ জীবন বাঁচানো, ৬৪ জেলায় সেবা।" 
        />
        <meta name="keywords" content="রক্তদান, blood donation, Bangladesh, LifeLink, জরুরি রক্ত, blood donor, রক্তদাতা" />
        <meta property="og:title" content="LifeLink Bangladesh - আপনার রক্ত, তাদের আশা" />
        <meta property="og:description" content="বাংলাদেশের বিশ্বস্ত রক্তদান প্ল্যাটফর্ম। জরুরি মুহূর্তে রক্তের প্রয়োজনে আমরা আছি আপনার পাশে।" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lifelink.com.bd" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LifeLink Bangladesh - আপনার রক্ত, তাদের আশা" />
        <meta name="twitter:description" content="বাংলাদেশের বিশ্বস্ত রক্তদান প্ল্যাটফর্ম। জরুরি মুহূর্তে রক্তের প্রয়োজনে আমরা আছি আপনার পাশে।" />
        <link rel="canonical" href="https://lifelink.com.bd" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Bengali" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.country" content="Bangladesh" />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection stats={stats} loading={loading} />

        {/* Urgent Requests Ticker */}
        <UrgentRequestsTicker />

        {/* Impact Dashboard */}
        <ImpactDashboard stats={stats} loading={loading} />

        {/* Success Stories Carousel */}
        <SuccessStoriesCarousel />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;