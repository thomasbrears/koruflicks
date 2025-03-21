// src/components/account/PhoneSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const PhoneSettings = ({ user, profileData, setProfileData, updateSuccess, setUpdateSuccess }) => {
  const [phoneForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Set initial form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      phoneForm.setFieldsValue({
        phone: profileData.phone || ''
      });
    }
  }, [profileData, phoneForm]);

  // Handle phone update
  const handleUpdatePhone = async (values) => {
    setConfirmLoading(true);
    if (setUpdateSuccess) {
      setUpdateSuccess(prev => ({ ...prev, phone: false }));
    }
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        phone: values.phone
      });
      
      if (setProfileData) {
        setProfileData({
          ...profileData,
          phone: values.phone
        });
      }
      
      if (setUpdateSuccess) {
        setUpdateSuccess(prev => ({ ...prev, phone: true }));
        setTimeout(() => setUpdateSuccess(prev => ({ ...prev, phone: false })), 5000);
      }
      
      message.success('Phone number updated successfully');
    } catch (error) {
      console.error("Error updating phone:", error);
      message.error('Failed to update phone number');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h5 className="text-white text-lg font-semibold mb-4">
        {profileData?.phone ? 'Update Phone Number' : 'Add Phone Number'}
      </h5>
      
      {updateSuccess?.phone && (
        <Alert
          message="Success!"
          description="Your phone number has been updated successfully."
          type="success"
          showIcon
          className="mb-4"
        />
      )}
      
      <Form
        form={phoneForm}
        layout="vertical"
        onFinish={handleUpdatePhone}
        className="text-white"
      >
        <Form.Item
          name="phone"
          label={<span className="text-gray-300">Phone Number</span>}
          rules={[
            { 
              pattern: /^\+?[0-9]{10,15}$/, 
              message: 'Please enter a valid phone number',
              validateTrigger: 'onBlur'
            }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            placeholder="Enter your phone number"
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
            {profileData?.phone ? 'Update Phone' : 'Add Phone'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PhoneSettings;