import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const DonorLogin = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      navigate('/donor-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!identifier) {
      setError('ইমেইল বা মোবাইল নম্বর দিন');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(identifier);
    
    if (result.success) {
      navigate('/donor-dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-brand p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={32} color="white" />
                </div>
                <h1 className="text-2xl font-bengali font-bold text-text-primary mb-2">
                  দাতা লগইন
                </h1>
                <p className="text-muted-foreground font-bengali">
                  আপনার ড্যাশবোর্ডে প্রবেশ করুন
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="ইমেইল বা মোবাইল নম্বর"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ইমেইল বা মোবাইল নম্বর দিন"
                  error={error}
                  required
                />

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  loading={loading}
                  fullWidth
                  iconName="LogIn"
                  iconPosition="left"
                >
                  <span className="font-bengali">লগইন করুন</span>
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground font-bengali mb-2">
                  এখনো নিবন্ধিত নন?
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/donor-registration')}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  <span className="font-bengali">রক্তদাতা হন</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorLogin;