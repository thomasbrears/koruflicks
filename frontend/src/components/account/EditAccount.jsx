// src/components/account/EditAccount.jsx
import React, { useState, useEffect } from 'react';
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

const { TabPane } = Tabs;

const EditAccount = ({ user, profileData, setProfileData }) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('password');
  const [updateSuccess, setUpdateSuccess] = useState({
    name: false,
    email: false,
    phone: false,
    password: false
  });

  return (
    <div>
      <h4 className="text-white text-xl font-semibold mb-4">Account Settings</h4>
      <Tabs 
        activeKey={activeSettingsTab} 
        onChange={setActiveSettingsTab}
        className="text-white custom-tabs"
      >
        <TabPane 
          tab={<span className="text-white"><LockOutlined /> Password</span>} 
          key="password"
        >
          <PasswordSettings 
            user={user} 
            updateSuccess={updateSuccess} 
            setUpdateSuccess={setUpdateSuccess} 
          />
        </TabPane>
        
        <TabPane 
          tab={<span className="text-white"><MailOutlined /> Email</span>} 
          key="email"
        >
          <EmailSettings 
            user={user} 
            profileData={profileData}
            setProfileData={setProfileData}
            updateSuccess={updateSuccess} 
            setUpdateSuccess={setUpdateSuccess} 
          />
        </TabPane>
        
        <TabPane 
          tab={<span className="text-white"><UserOutlined /> Name</span>} 
          key="name"
        >
          <NameSettings 
            user={user} 
            profileData={profileData}
            setProfileData={setProfileData} 
            updateSuccess={updateSuccess} 
            setUpdateSuccess={setUpdateSuccess} 
          />
        </TabPane>
        
        <TabPane 
          tab={<span className="text-white"><PhoneOutlined /> Phone</span>} 
          key="phone"
        >
          <PhoneSettings 
            user={user} 
            profileData={profileData}
            setProfileData={setProfileData}
            updateSuccess={updateSuccess} 
            setUpdateSuccess={setUpdateSuccess} 
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EditAccount;