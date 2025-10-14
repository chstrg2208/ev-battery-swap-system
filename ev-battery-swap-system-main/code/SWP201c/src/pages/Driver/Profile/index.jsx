import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Điều chỉnh đường dẫn

// Import tất cả component con
import ProfileHeader from './components/ProfileHeader';
import ProfileDisplay from './components/ProfileDisplay';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileFormFields from './components/ProfileFormFields';
import ProfileFormActions from './components/ProfileFormActions';

// Dữ liệu giả
const mockStats = {
  joinDate: '15/07/2025',
  totalTrips: 256,
  rating: '4.8 ⭐'
};

const DriverProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', avatarUrl: '' });

  // Load dữ liệu người dùng vào form khi component được mount
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || 'Nguyễn Văn A',
        email: currentUser.email || 'example@email.com',
        phone: currentUser.phone || '090xxxxxxx',
        avatarUrl: currentUser.avatarUrl || 'https://i.pravatar.cc/150'
      });
    }
  }, [currentUser]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving data:", formData);
    // Sau này sẽ gọi API để cập nhật
    setIsEditing(false); // Chuyển về chế độ xem
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <ProfileHeader isEditing={isEditing} onToggleEdit={handleToggleEdit} />

      {isEditing ? (
        // Chế độ CHỈNH SỬA
        <div>
          <ProfileAvatar avatarUrl={formData.avatarUrl} isEditing={true} />
          <ProfileFormFields formData={formData} onChange={handleChange} />
          <ProfileFormActions onSave={handleSave} />
        </div>
      ) : (
        // Chế độ XEM
        <ProfileDisplay user={formData} stats={mockStats} />
      )}
    </div>
  );
};

export default DriverProfile;