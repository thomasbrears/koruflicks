// src/components/account/NameSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const NameSettings = ({ user, profileData, setProfileData, updateSuccess, setUpdateSuccess }) => {
  const [nameForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Set initial form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      nameForm.setFieldsValue({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || ''
      });
    }
  }, [profileData, nameForm]);

  // Handle name update
  const handleUpdateName = async (values) => {
    setConfirmLoading(true);
    if (setUpdateSuccess) {
      setUpdateSuccess(prev => ({ ...prev, name: false }));
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        firstName: values.firstName,
        lastName: values.lastName
      });
      
      if (setProfileData) {
        setProfileData({
          ...profileData,
          firstName: values.firstName,
          lastName: values.lastName
        });
      }
      
      if (setUpdateSuccess) {
        setUpdateSuccess(prev => ({ ...prev, name: true }));
        setTimeout(() => setUpdateSuccess(prev => ({ ...prev, name: false })), 5000);
      }
      
      message.success('Name updated successfully');
    } catch (error) {
      console.error("Error updating name:", error);
      message.error('Failed to update name');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h5 className="text-white text-lg font-semibold mb-4">Update Your Name</h5>
      
      {updateSuccess?.name && (
        <Alert
          message="Success!"
          description="Your name has been updated successfully."
          type="success"
          showIcon
          className="mb-4"
        />
      )}
      
      <Form
        form={nameForm}
        layout="vertical"
        onFinish={handleUpdateName}
        className="text-white"
      >
        <Form.Item
          name="firstName"
          label={<span className="text-gray-300">First Name</span>}
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your first name"
            className="bg-gray-800 border border-gray-700 text-white"
            style={{ backgroundColor: '#1f2937', color: 'white' }}
          />
        </Form.Item>
        <Form.Item
          name="lastName"
          label={<span className="text-gray-300">Last Name</span>}
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your last name"
            className="bg-gray-800 border border-gray-700 text-white"
            style={{ backgroundColor: '#1f2937', color: 'white' }}
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={confirmLoading}
            className="bg-LGreen border-LGreen hover:bg-DGreen hover:text-white text-black"
          >
            Update Name
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NameSettings;