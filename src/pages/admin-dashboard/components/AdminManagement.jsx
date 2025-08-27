import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { supabase } from '../../../lib/supabase';

// Simple password hashing function (same as adminService)
const hashPassword = (password) => {
  return btoa(password); // Base64 encoding to match adminService
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: []
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            username: formData.name,
            email: formData.email,
            role: formData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAdmin.id);
        
        if (error) throw error;
        alert('অ্যাডমিন সফলভাবে আপডেট করা হয়েছে');
      } else {
        // Hash password before storing
        const hashedPassword = hashPassword(formData.password);
        
        const { error } = await supabase
          .from('admin_users')
          .insert({
            username: formData.name,
            email: formData.email,
            password_hash: hashedPassword,
            role: formData.role,
            is_active: true,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        alert('নতুন অ্যাডমিন সফলভাবে যোগ করা হয়েছে');
      }
      
      resetForm();
      loadAdmins();
    } catch (error) {
      console.error('Failed to save admin:', error);
      alert('অ্যাডমিন সেভ করতে সমস্যা হয়েছে');
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.username,
      email: admin.email,
      password: '',
      role: admin.role,
      permissions: admin.permissions || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (adminId) => {
    if (confirm('আপনি কি এই অ্যাডমিনকে মুছে ফেলতে চান?')) {
      try {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', adminId);
        
        if (error) throw error;
        alert('অ্যাডমিন সফলভাবে মুছে ফেলা হয়েছে');
        loadAdmins();
      } catch (error) {
        console.error('Failed to delete admin:', error);
        alert('অ্যাডমিন মুছতে সমস্যা হয়েছে');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      permissions: []
    });
    setEditingAdmin(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-brand">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bengali font-bold">অ্যাডমিন ব্যবস্থাপনা</h3>
        <Button 
          variant="default" 
          iconName="Plus" 
          onClick={() => setShowAddForm(true)}
        >
          <span className="font-bengali">নতুন অ্যাডমিন</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted">
          <h4 className="font-bengali font-semibold mb-4">
            {editingAdmin ? 'অ্যাডমিন সম্পাদনা' : 'নতুন অ্যাডমিন যোগ করুন'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="নাম"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="ইমেইল"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            {!editingAdmin && (
              <Input
                label="পাসওয়ার্ড"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            )}
            
            <div>
              <label className="block text-sm font-medium font-bengali mb-2">ভূমিকা</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="admin">অ্যাডমিন</option>
                <option value="super_admin">সুপার অ্যাডমিন</option>
                <option value="moderator">মডারেটর</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" variant="default">
                <span className="font-bengali">
                  {editingAdmin ? 'আপডেট করুন' : 'যোগ করুন'}
                </span>
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <span className="font-bengali">বাতিল</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
            <p className="font-bengali">লোড হচ্ছে...</p>
          </div>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <div key={admin.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="white" />
                  </div>
                  <div>
                    <h4 className="font-bengali font-semibold">{admin.username}</h4>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.role === 'super_admin' ? 'bg-red-100 text-red-700' :
                        admin.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {admin.role === 'super_admin' ? 'সুপার অ্যাডমিন' :
                         admin.role === 'admin' ? 'অ্যাডমিন' : 'মডারেটর'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {admin.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    iconName="Edit"
                    onClick={() => handleEdit(admin)}
                  >
                    <span className="font-bengali">সম্পাদনা</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    iconName="Trash2"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <span className="font-bengali">মুছুন</span>
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground font-bengali">
                যোগ হয়েছে: {new Date(admin.created_at).toLocaleDateString('bn-BD')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="font-bengali text-muted-foreground">কোনো অ্যাডমিন পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;