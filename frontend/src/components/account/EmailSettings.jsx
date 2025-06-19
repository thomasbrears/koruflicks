// src/components/account/EmailSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, message, Tag, Divider } from 'antd';
import { 
  MailOutlined, 
  LockOutlined, 
  SaveOutlined, 
  SyncOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  updateEmail, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  sendEmailVerification,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

const EmailSettings = ({ user, profileData, setProfileData, updateSuccess, setUpdateSuccess }) => {
  const navigate = useNavigate();
  const [emailForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(null);
  const [pendingEmailExpiration, setPendingEmailExpiration] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(false);

  // Initialize form with current values
  useEffect(() => {
    if (user) {
      emailForm.setFieldsValue({
        newEmail: ''
      });
    }
  }, [user, emailForm]);

  // Check for pending email change in localStorage on mount
  useEffect(() => {
    const pendingChangeStr = localStorage.getItem('pendingEmailChange');
    if (pendingChangeStr) {
      try {
        const pendingChange = JSON.parse(pendingChangeStr);
        if (pendingChange.expiresAt > Date.now()) {
          setPendingEmailChange(pendingChange.email);
          setPendingEmailExpiration(new Date(pendingChange.expiresAt).toLocaleString());
        } else {
          // Clear expired pending change
          localStorage.removeItem('pendingEmailChange');
        }
      } catch (error) {
        console.error("Error parsing pending email change:", error);
        localStorage.removeItem('pendingEmailChange');
      }
    }
  }, []);

  // Check verification status once when component mounts and when user returns to the page
  useEffect(() => {
    if (!pendingEmailChange) return;
    
    // Initial check when component mounts or when user returns to the page
    const checkVerification = async () => {
      try {
        setCheckingVerification(true);
        // Reload user to get latest verification status
        await auth.currentUser.reload();
        const freshUser = auth.currentUser;
        
        // If the email is verified and matches the pending email
        if (freshUser.emailVerified && freshUser.email === pendingEmailChange) {
          // Update in Firestore
          const userDocRef = doc(db, 'users', freshUser.uid);
          await updateDoc(userDocRef, {
            email: freshUser.email
          });
          
          if (setProfileData && profileData) {
            setProfileData({
              ...profileData,
              email: freshUser.email
            });
          }
          
          // Clear pending email change
          localStorage.removeItem('pendingEmailChange');
          setPendingEmailChange(null);
          setPendingEmailExpiration(null);
          
          message.success('Your email has been successfully updated and verified!');
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      } finally {
        setCheckingVerification(false);
      }
    };
    
    // Run check once when component mounts
    checkVerification();
    
    // Also check when component becomes visible again (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVerification();
      }
    };
    
    // Listen for visibility changes (user switching tabs/returning to page)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pendingEmailChange, profileData, setProfileData]);

  // Handle sending verification email for current email and redirect to verification page
  const handleSendVerificationEmail = async () => {
    try {
      // Ensure we have the most current user object
      await auth.currentUser.reload();
      const currentUser = auth.currentUser;
      
      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        message.success('Verification email sent! Please check your emails');
        // Redirect to the VerifyEmailPage using the router
        navigate('/auth/verify-email');
      } else if (currentUser && currentUser.emailVerified) {
        message.info('Your email is already verified.');
      } else {
        message.error('User not found. Please try signing in again.');
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      message.error(`Failed to send verification email: ${error.message}`);
    }
  };

  // Check verification status manually
  const checkVerificationStatus = async () => {
    try {
      setCheckingVerification(true);
      // Reload user to get latest verification status
      await auth.currentUser.reload();
      const freshUser = auth.currentUser;
      
      // Check if we have a pending email change
      if (pendingEmailChange) {
        // The key check: Is the current email matching the pending email AND verified?
        if (freshUser.emailVerified && freshUser.email === pendingEmailChange) {
          // Success! Email has been changed and verified
          // Update in Firestore
          const userDocRef = doc(db, 'users', freshUser.uid);
          await updateDoc(userDocRef, {
            email: freshUser.email
          });
          
          if (setProfileData && profileData) {
            setProfileData({
              ...profileData,
              email: freshUser.email
            });
          }
          
          // Clear pending email change
          localStorage.removeItem('pendingEmailChange');
          setPendingEmailChange(null);
          setPendingEmailExpiration(null);
          
          message.success('Your email has been successfully updated and verified!');
        }
        // If user's email doesn't match the pending change, they haven't clicked the verification link yet
        else if (freshUser.email !== pendingEmailChange) {
          message.info('You haven\'t verified your new email address yet. Please check your inbox and click the verification link.');
        }
        // If email matches but isn't verified
        else if (freshUser.email === pendingEmailChange && !freshUser.emailVerified) {
          message.info('Your new email address has been set, but not verified yet. Please check your inbox and click the verification link.');
        }
      } 
      // No pending change, just check general verification status
      else if (freshUser.emailVerified) {
        message.success('Your email is verified.');
      } else {
        message.info('Your email is not verified yet. Please check your inbox for the verification link.');
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      message.error('Failed to check verification status.');
    } finally {
      setCheckingVerification(false);
    }
  };

  // Handle email update using verifyBeforeUpdateEmail
  const handleUpdateEmail = async (values) => {
    setConfirmLoading(true);
    if (setUpdateSuccess) {
      setUpdateSuccess(prev => ({ ...prev, email: false }));
    }
    
    try {
      // Get the current user
      await auth.currentUser.reload(); // Ensure we have the latest user state
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User not found. Please try signing in again.');
      }
      
      // Check if user is using email/password authentication
      const isPasswordProvider = currentUser.providerData.some(
        provider => provider.providerId === 'password'
      );
      
      if (!isPasswordProvider) {
        throw new Error('oauth-provider');
      }
      
      // Check if current email is verified
      if (!currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        throw new Error('verify-current-email');
      }
      
      // Re-authenticate user before changing email
      try {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          values.currentPassword
        );
        
        await reauthenticateWithCredential(currentUser, credential);
        
        // Use verifyBeforeUpdateEmail instead of updateEmail
        // This sends a verification email to the new address and only changes
        // the email once verification is complete
        await verifyBeforeUpdateEmail(currentUser, values.newEmail);
        
        // Store pending email change in localStorage with expiration (24 hours)
        const pendingChange = {
          email: values.newEmail,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('pendingEmailChange', JSON.stringify(pendingChange));
        setPendingEmailChange(values.newEmail);
        setPendingEmailExpiration(new Date(pendingChange.expiresAt).toLocaleString());
        
        if (setUpdateSuccess) {
          setUpdateSuccess(prev => ({ ...prev, email: true }));
          setTimeout(() => setUpdateSuccess(prev => ({ ...prev, email: false })), 5000);
        }
        
        // Reset form fields
        emailForm.setFieldsValue({
          newEmail: '',
          currentPassword: ''
        });
        
        message.success('Please check your inbox to verify your new email address. After clicking the verification link, return to this page and click "Check Verification Status" to complete the process.');
      } catch (error) {
        console.error("Re-authentication error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error updating email:", error);
      
      if (error.message === 'oauth-provider') {
        message.error('Email cannot be changed for accounts signed in with Google. Please update your email in your Google account settings.');
      } else if (error.message === 'verify-current-email') {
        message.info('Before changing your email, please verify your current email address. A verification email has been sent to your inbox.');
      } else if (error.code === 'auth/wrong-password') {
        message.error('Current password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        message.error('This email is already in use by another account');
      } else if (error.code === 'auth/requires-recent-login') {
        message.error('This action requires recent authentication. Please sign out and sign in again before retrying.');
      } else if (error.code === 'auth/operation-not-allowed') {
        message.info('The current operation is not allowed. Please contact support if this persists.');
      } else {
        message.error(`Failed to update email: ${error.message}`);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  // Check if user is authenticated with Google
  const isGoogleUser = () => {
    return user?.providerData.some(provider => provider.providerId === 'google.com');
  };

  return (
    <div className="p-4">
      <h5 className="text-white text-lg font-semibold mb-4">Email Settings</h5>
      
      {/* Email Display with Verification Tag */}
      <div className="flex items-center mb-4">
        <div className="text-gray-300 mr-2">
          <MailOutlined className="mr-2" />
          {user?.email}
        </div>
        
        {user?.emailVerified ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Verified
          </Tag>
        ) : (
          <div className="ml-2">
            <Button 
              size="small"
              onClick={handleSendVerificationEmail}
              className="bg-LGreen text-black hover:bg-DGreen hover:text-white"
            >
              Verify Email
            </Button>
          </div>
        )}
        
        
      </div>

      <Divider className="border-gray-700" />
      
      {/* Pending Email Change Alert */}
      {pendingEmailChange && (
        <div className="mb-6">
          <Alert
            message="Email Change Pending"
            description={
              <>
                <p>You have requested to change your email to: <strong>{pendingEmailChange}</strong></p>
                <p>Please check your inbox and verify this email before {pendingEmailExpiration}.</p>
                <p className="mt-2 text-sm">After clicking the verification link in your email, return here and click the button below to complete the process:</p>
                <Button 
                  type="primary"
                  onClick={checkVerificationStatus}
                  className="mt-2 bg-LGreen border-LGreen hover:bg-DGreen hover:text-white text-black"
                  icon={checkingVerification ? <SyncOutlined spin /> : null}
                  disabled={checkingVerification}
                >
                  {checkingVerification ? 'Checking...' : 'Check Verification Status'}
                </Button>
              </>
            }
            type="info"
            showIcon
          />
        </div>
      )}
      
      {/* Success Message */}
      {updateSuccess?.email && (
        <Alert
          message="Success!"
          description="Your email change request has been submitted. Please check your inbox to verify your new email address."
          type="success"
          showIcon
          className="mb-4"
        />
      )}
      
      {/* Email Change Form */}
      <h5 className="text-white text-lg font-semibold mb-4">Change Email Address</h5>
      <Form
        form={emailForm}
        layout="vertical"
        onFinish={handleUpdateEmail}
        className="text-white"
      >
        <Form.Item
          name="newEmail"
          label={<span className="text-gray-300">New Email</span>}
          rules={[
            { required: true, message: 'Please enter your new email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input 
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Enter your new email"
            className="bg-gray-800 border border-gray-700 text-white"
            style={{ backgroundColor: '#1f2937', color: 'white' }}
          />
        </Form.Item>
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
        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={confirmLoading}
            disabled={isGoogleUser() || (!user?.emailVerified)}
            className="bg-LGreen border-LGreen hover:bg-DGreen hover:text-white text-black"
          >
            Update Email
          </Button>
          {isGoogleUser() && (
            <p className="text-yellow-500 mt-2">
              Email cannot be changed for Google accounts. Please update your email in your Google account settings.
            </p>
          )}
          {!user?.emailVerified && !isGoogleUser() && (
            <p className="text-yellow-500 mt-2">
              You must verify your current email before changing to a new one.
            </p>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmailSettings;