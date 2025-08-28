import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { donorService } from '../../lib/donorService';
import { useAuth } from '../../contexts/AuthContext';

// Import components
import RegistrationHeader from './components/RegistrationHeader';
import ProgressIndicator from './components/ProgressIndicator';
import PersonalInfoStep from './components/PersonalInfoStep';
import BloodInfoStep from './components/BloodInfoStep';
import ContactStep from './components/ContactStep';
import VerificationStep from './components/VerificationStep';
import SuccessMessage from './components/SuccessMessage';

const DonorRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    age: '',
    gender: '',
    district: '',
    upazila: '',
    address: '',
    
    // Blood Info
    bloodGroup: '',
    availability: '',
    isHealthy: false,
    noRecentDonation: false,
    adequateWeight: false,
    noSmokingDrugs: false,
    
    // Contact Info
    mobile: '',
    email: '',
    emergencyContact: '',
    smsNotifications: true,
    phoneCallsAllowed: true,
    whatsappAllowed: false,
    emergencyContactAllowed: true,
    agreeToTerms: false
  });

  const totalSteps = 3;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Info
        if (!formData?.fullName?.trim()) newErrors.fullName = 'নাম প্রয়োজন';
        if (!formData?.age || formData?.age < 18 || formData?.age > 65) {
          newErrors.age = 'বয়স ১৮-৬৫ বছরের মধ্যে হতে হবে';
        }
        if (!formData?.gender) newErrors.gender = 'লিঙ্গ নির্বাচন করুন';
        if (!formData?.district) newErrors.district = 'জেলা নির্বাচন করুন';
        if (!formData?.upazila?.trim()) newErrors.upazila = 'উপজেলা প্রয়োজন';
        if (!formData?.address?.trim()) newErrors.address = 'ঠিকানা প্রয়োজন';
        break;

      case 2: // Blood Info
        if (!formData?.bloodGroup) newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন';
        if (!formData?.availability) newErrors.availability = 'উপলব্ধতা নির্বাচন করুন';
        if (!formData?.isHealthy) newErrors.isHealthy = 'স্বাস্থ্য নিশ্চিতকরণ প্রয়োজন';
        if (!formData?.noRecentDonation) newErrors.noRecentDonation = 'সাম্প্রতিক রক্তদানের তথ্য প্রয়োজন';
        if (!formData?.adequateWeight) newErrors.adequateWeight = 'ওজনের তথ্য প্রয়োজন';
        if (!formData?.noSmokingDrugs) newErrors.noSmokingDrugs = 'ধূমপান/মাদকের তথ্য প্রয়োজন';
        break;

      case 3: // Contact Info
        const mobileRegex = /^01[3-9]\d{8}$/;
        if (!formData?.mobile || !mobileRegex?.test(formData?.mobile)) {
          newErrors.mobile = 'সঠিক মোবাইল নম্বর দিন (01xxxxxxxxx)';
        }
        if (!formData?.email || !/\S+@\S+\.\S+/?.test(formData?.email)) {
          newErrors.email = 'ইমেইল ঠিকানা আবশ্যক';
        }

        if (!formData?.agreeToTerms) {
          newErrors.agreeToTerms = 'শর্তাবলীতে সম্মতি প্রয়োজন';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    console.log('Submit clicked, formData:', formData);
    console.log('Validation result:', validateStep(3));
    console.log('Current errors:', errors);
    
    if (!validateStep(3)) {
      console.log('Validation failed, errors:', errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if mobile number already exists
      const existingMobileDonor = await donorService.getDonorByMobile(formData.mobile);
      if (existingMobileDonor) {
        setErrors({ mobile: '⚠️ এই মোবাইল নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে। অন্য নম্বর ব্যবহার করুন বা লগইন করুন।' });
        setIsSubmitting(false);
        return;
      }

      // Check if email already exists
      const existingEmailDonor = await donorService.getDonorByEmail(formData.email);
      if (existingEmailDonor) {
        setErrors({ email: '⚠️ এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে। অন্য ইমেইল ব্যবহার করুন বা লগইন করুন।' });
        setIsSubmitting(false);
        return;
      }

      // Create new donor
      const newDonor = await donorService.createDonor(formData);
      setFormData(prev => ({ ...prev, donorId: newDonor.id }));
      
      // Auto login the user using AuthContext
      console.log('Attempting auto-login with email:', formData.email);
      const loginResult = await login(formData.email);
      console.log('Login result:', loginResult);
      
      if (loginResult.success) {
        console.log('Login successful, checking for return URL');
        
        // Check for return URL
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl');
          window.location.href = returnUrl;
        } else {
          navigate('/donor-dashboard');
        }
      } else {
        console.log('Login failed:', loginResult.error);
        // If auto-login fails, still redirect to login page
        navigate('/donor-login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'নিবন্ধনে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = (success) => {
    if (success) {
      setIsVerified(true);
      setTimeout(() => {
        setIsCompleted(true);
      }, 1000);
    } else {
      setErrors({ otp: 'ভুল OTP কোড। পুনরায় চেষ্টা করুন।' });
    }
  };

  const getCompletedSteps = () => {
    if (isCompleted) return totalSteps;
    if (isVerified) return totalSteps;
    if (currentStep === 4) return 3;
    return currentStep - 1;
  };

  const renderStepContent = () => {
    if (isCompleted) {
      return <SuccessMessage donorData={formData} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <BloodInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <ContactStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    if (isCompleted) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        {currentStep > 1 && currentStep < 3 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            iconName="ArrowLeft"
            iconPosition="left"
            fullWidth
          >
            <span className="font-bengali">পূর্ববর্তী</span>
          </Button>
        )}

        {currentStep < 3 && (
          <Button
            variant="default"
            onClick={handleNext}
            iconName="ArrowRight"
            iconPosition="right"
            fullWidth
          >
            <span className="font-bengali">পরবর্তী</span>
          </Button>
        )}

        {currentStep === 3 && (
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            fullWidth
          >
            <span className="font-bengali">নিবন্ধন সম্পন্ন করুন</span>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {!isCompleted && <RegistrationHeader />}
            
            {!isCompleted && (
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                completedSteps={getCompletedSteps()}
              />
            )}

            {renderStepContent()}
            {renderNavigationButtons()}
          </div>
        </div>
      </main>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full shadow-brand-lg heartbeat"
        >
          <Icon name="HelpCircle" size={24} color="white" />
        </Button>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default DonorRegistration;