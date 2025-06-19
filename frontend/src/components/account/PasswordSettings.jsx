import React, { useState } from 'react';
import { Form, Input, Button, Tag, Alert, Divider, message } from 'antd';
import {
  LockOutlined,
  SaveOutlined,
  GoogleOutlined,
  MailOutlined
} from '@ant-design/icons';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  linkWithCredential
} from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const PasswordSettings = ({ user, updateSuccess, setUpdateSuccess }) => {
  const [passwordForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Function to calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    // Basic criteria for password strength
    const lengthScore = Math.min(password.length * 5, 30); // Up to 30 points for length
    const hasUppercase = /[A-Z]/.test(password) ? 20 : 0;
    const hasLowercase = /[a-z]/.test(password) ? 20 : 0;
    const hasNumber = /[0-9]/.test(password) ? 20 : 0;
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password) ? 20 : 0;
    
    // Calculate total score (max 100)
    const totalScore = Math.min(lengthScore + hasUppercase + hasLowercase + hasNumber + hasSpecialChar, 100);
    
    return totalScore;
  };

  // Handle password update
  const handleUpdatePassword = async (values) => {
    setConfirmLoading(true);
    if (setUpdateSuccess) {
      setUpdateSuccess(prev => ({ ...prev, password: false }));
    }
   
    try {
      // Check if user has a password (Google sign-in users may not have a password)
      if (hasPassword()) {
        try {
          // Re-authenticate user
          await auth.currentUser.reload(); // Ensure we have latest user object
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            values.currentPassword
          );
         
          await reauthenticateWithCredential(auth.currentUser, credential);
         
          // Update password
          await updatePassword(auth.currentUser, values.newPassword);
         
          if (setUpdateSuccess) {
            setUpdateSuccess(prev => ({ ...prev, password: true }));
            setTimeout(() => setUpdateSuccess(prev => ({ ...prev, password: false })), 5000);
          }
         
          // Reset form
          passwordForm.resetFields();
         
          message.success('Password updated successfully');
        } catch (error) {
          throw error;
        }
      } else {
        try {
          // User doesn't have a password (Google sign-in), set a new one
          await auth.currentUser.reload(); // Ensure we have latest user object
         
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            values.newPassword
          );
         
          // Link password credential to account
          await linkWithCredential(auth.currentUser, credential);
         
          if (setUpdateSuccess) {
            setUpdateSuccess(prev => ({ ...prev, password: true }));
            setTimeout(() => setUpdateSuccess(prev => ({ ...prev, password: false })), 5000);
          }
         
          // Reset form
          passwordForm.resetFields();
         
          message.success('Password set successfully. You can now use email/password to sign in.');
        } catch (error) {
          // Special handling for Google-authenticated users
          if (error.code === 'auth/provider-already-linked') {
            message.error('This account already has a password set');
          } else if (error.code === 'auth/email-already-in-use') {
            message.error('This email is already associated with another account');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
     
      if (error.code === 'auth/wrong-password') {
        message.error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        message.error('Password is too weak. Please use a stronger password');
      } else if (error.code === 'auth/requires-recent-login') {
        message.error('This action requires recent authentication. Please sign out and sign in again before retrying.');
      } else {
        message.error('Failed to update password');
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // Calculate if user has a password set
  const hasPassword = () => {
    return user?.providerData.some(provider => provider.providerId === 'password');
  };

  return (
    <div className="p-4">
      <h5 className="text-white text-lg font-semibold mb-4">
        {hasPassword() ? 'Change Your Password' : 'Set Password for Email Login'}
      </h5>
     
      {updateSuccess?.password && (
        <Alert
          message="Success!"
          description={hasPassword() ? "Your password has been updated successfully." : "Your password has been set successfully."}
          type="success"
          showIcon
          className="mb-4"
        />
      )}
     
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handleUpdatePassword}
        className="text-white"
      >
        {hasPassword() && (
          <Form.Item
            name="currentPassword"
            label={<span className="text-gray-300">Current Password</span>}
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Enter your current password"
              className="bg-gray-800 border border-gray-700 text-white"
              style={{ backgroundColor: '#1f2937', color: 'white' }}
            />
          </Form.Item>
        )}
        <Form.Item
          name="newPassword"
          label={<span className="text-gray-300">New Password</span>}
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter your new password"
            className="bg-gray-800 border border-gray-700 text-white"
            style={{ backgroundColor: '#1f2937', color: 'white' }}
          />
        </Form.Item>

        <Form.Item noStyle dependencies={['newPassword']}>
          {({ getFieldValue }) => {
            const password = getFieldValue('newPassword');
            const strength = calculatePasswordStrength(password);
            
            // Only render the strength indicator if password has some value
            return password ? (
              <div className="mb-4">
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      strength < 33 ? 'bg-red-500' : 
                      strength < 66 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {strength < 33 ? 'Weak' : strength < 66 ? 'Medium' : 'Strong'}
                  {strength < 33 && ' - Consider using uppercase letters, numbers, and special characters'}
                </p>
              </div>
            ) : null;
          }}
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="text-gray-300">Confirm New Password</span>}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm your new password"
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
            {hasPassword() ? 'Update Password' : 'Set Password'}
          </Button>
        </Form.Item>
      </Form>
     
      <Divider className="border-gray-700" />
     
      <h5 className="text-white text-lg font-semibold mb-4">Login Methods</h5>
      <div className="flex flex-wrap">
        {user?.providerData.map(provider => (
          <Tag
            key={provider.providerId}
            color={provider.providerId === 'google.com' ? 'blue' : 'green'}
            icon={provider.providerId === 'google.com' ? <GoogleOutlined /> : <MailOutlined />}
            className="mr-2 mb-2 text-base py-1 px-3"
          >
            {provider.providerId === 'google.com' ? 'Google' : 'Email & Password'}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default PasswordSettings;