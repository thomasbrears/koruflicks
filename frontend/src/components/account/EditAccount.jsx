import React, { useState } from 'react';
import { Tabs } from 'antd';
import PasswordSettings from './PasswordSettings';
import EmailSettings from './EmailSettings';
import NameSettings from './NameSettings';
import PhoneSettings from './PhoneSettings';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined 
} from '@ant-design/icons';

const EditAccount = ({ user, profileData, setProfileData, updateSuccess, setUpdateSuccess }) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('password');

  const tabItems = [
    {
      key: 'password',
      label: <span className="text-white"><LockOutlined /> Password</span>,
      children: (
        <PasswordSettings 
          user={user} 
          updateSuccess={updateSuccess} 
          setUpdateSuccess={setUpdateSuccess} 
        />
      )
    },
    {
      key: 'email',
      label: <span className="text-white"><MailOutlined /> Email</span>,
      children: (
        <EmailSettings 
          user={user} 
          profileData={profileData}
          setProfileData={setProfileData}
          updateSuccess={updateSuccess} 
          setUpdateSuccess={setUpdateSuccess} 
        />
      )
    },
    {
      key: 'name',
      label: <span className="text-white"><UserOutlined /> Name</span>,
      children: (
        <NameSettings 
          user={user} 
          profileData={profileData}
          setProfileData={setProfileData} 
          updateSuccess={updateSuccess} 
          setUpdateSuccess={setUpdateSuccess} 
        />
      )
    },
    {
      key: 'phone',
      label: <span className="text-white"><PhoneOutlined /> Phone</span>,
      children: (
        <PhoneSettings 
          user={user} 
          profileData={profileData}
          setProfileData={setProfileData}
          updateSuccess={updateSuccess} 
          setUpdateSuccess={setUpdateSuccess} 
        />
      )
    }
  ];

  return (
    <div>
      <h4 className="text-white text-xl font-semibold mb-4">Account Settings</h4>
      <Tabs 
        activeKey={activeSettingsTab} 
        onChange={setActiveSettingsTab}
        className="text-white custom-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default EditAccount;