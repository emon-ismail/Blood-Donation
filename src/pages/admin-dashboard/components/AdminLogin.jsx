import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { adminService } from '../../../lib/adminService';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminData = await adminService.login(credentials.username, credentials.password);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminData', JSON.stringify(adminData));
      onLogin(true);
    } catch (error) {
      setError('ভুল ইউজারনেম বা পাসওয়ার্ড');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary font-bengali mb-2">
            অ্যাডমিন লগইন
          </h1>
          <p className="text-muted-foreground font-bengali">
            LifeLink Bangladesh ড্যাশবোর্ড অ্যাক্সেস
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="ইউজারনেম বা ইমেইল"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            placeholder="ইউজারনেম বা ইমেইল"
            iconName="User"
            required
          />

          <Input
            label="পাসওয়ার্ড"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            placeholder="পাসওয়ার্ড"
            iconName="Lock"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-red-600" />
                <span className="text-sm text-red-700 font-bengali">{error}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={loading}
            iconName="LogIn"
            iconPosition="left"
          >
            <span className="font-bengali">লগইন করুন</span>
          </Button>
        </form>


      </div>
    </div>
  );
};

export default AdminLogin;