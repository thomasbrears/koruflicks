import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Avatar, 
  Tag, 
  Skeleton,
  notification
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined 
} from '@ant-design/icons';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  db, 
  auth 
} from '../firebaseConfig';
import useAuth from '../hooks/useAuth';

// Import refactored components
import EditAccount from '../components/account/EditAccount';
import UserContent from '../components/account/UserContent';

const AccountPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState({
    name: false,
    email: false,
    phone: false,
    password: false
  });
  
  // Placeholder data for content tabs - in a real app, you would fetch this data
  const watchlist = [];
  const likedContent = [];
  const recentComments = [];

  useEffect(() => {
    if (user && !authLoading) {
      // Fetch user profile data from Firestore
      const fetchUserProfile = async () => {
        try {
          // Ensure we have the most up-to-date user object
          try {
            await auth.currentUser.reload();
          } catch (error) {
            console.error("Error reloading user:", error);
            // Continue with current user object if reload fails
          }
          
          const currentUser = auth.currentUser;
          if (!currentUser) {
            navigate('/auth/signin');
            return;
          }
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if the user has a roles array, if not, add it
            if (!userData.roles || !Array.isArray(userData.roles)) {
              await updateDoc(userDocRef, {
                roles: ['user'],
                updatedAt: serverTimestamp()
              });
              
              // Update the local user data with the roles
              userData.roles = ['user'];
            }
            
            setProfileData(userData);
          } else {
            // If user document doesn't exist (edge case), create it
            const userData = {
              firstName: currentUser.displayName ? currentUser.displayName.split(' ')[0] : '',
              lastName: currentUser.displayName ? currentUser.displayName.split(' ').slice(1).join(' ') : '',
              email: currentUser.email,
              phone: '',
              roles: ['user'],
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            
            await setDoc(userDocRef, userData);
            setProfileData(userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          notification.error({
            message: 'Error',
            description: 'Failed to load profile data'
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    } else if (!authLoading && !user) {
      // User is not authenticated, redirect to sign in
      navigate('/auth/signin');
    }
  }, [user, authLoading, navigate]);

  // Check for pending email change in localStorage and update if necessary
  useEffect(() => {
    if (user) {
      const checkPendingEmailChange = async () => {
        const pendingChangeStr = localStorage.getItem('pendingEmailChange');
        if (!pendingChangeStr) return;
        
        try {
          const pendingChange = JSON.parse(pendingChangeStr);
          
          // Check if expired
          if (pendingChange.expiresAt < Date.now()) {
            localStorage.removeItem('pendingEmailChange');
            return;
          }
          
          // Check if email is verified
          await auth.currentUser.reload();
          const freshUser = auth.currentUser;
          
          if (freshUser.emailVerified && freshUser.email === pendingChange.email) {
            // Email has been verified and updated
            const userDocRef = doc(db, 'users', freshUser.uid);
            await updateDoc(userDocRef, {
              email: freshUser.email,
              updatedAt: serverTimestamp()
            });
            
            setProfileData(prevData => ({
              ...prevData,
              email: freshUser.email
            }));
            
            localStorage.removeItem('pendingEmailChange');
            notification.success({
              message: 'Success',
              description: 'Your email has been successfully updated and verified.'
            });
          }
        } catch (error) {
          console.error("Error checking pending email change:", error);
        }
      };
      
      checkPendingEmailChange();
    }
  }, [user]);

  // Loading state while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border border-gray-800 mb-8">
            <Skeleton avatar active paragraph={{ rows: 3 }} />
          </Card>
          <Card className="bg-gray-900 border border-gray-800">
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Koru Flicks</title>
      </Helmet>
      
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <>
              <Card className="bg-gray-900 border border-gray-800 mb-8">
                <Skeleton avatar active paragraph={{ rows: 3 }} />
              </Card>
              <Card className="bg-gray-900 border border-gray-800">
                <Skeleton active paragraph={{ rows: 10 }} />
              </Card>
            </>
          ) : (
            <>
              {/* Profile Header */}
              <Card className="bg-gray-900 border border-gray-800 mb-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <Avatar 
                      size={100} 
                      src={user.photoURL} 
                      icon={!user.photoURL && <UserOutlined />}
                      className="bg-DGreen" 
                    />
                  </div>
                  
                  <div className="text-left flex-grow">
                    <h3 className="text-white text-2xl font-semibold m-0 mr-2">
                      {profileData?.firstName} {profileData?.lastName}
                    </h3>
                    
                    <p className="text-gray-400 flex items-center mb-2">
                      <MailOutlined className="mr-2" /> {user.email}
                      {!user.emailVerified && (
                        <Tag color="warning" className="ml-2">Unverified</Tag>
                      )}
                    </p>
                    
                    <p className="text-gray-400 flex items-center mb-2">
                      <PhoneOutlined className="mr-2" /> 
                      {profileData?.phone ? profileData.phone : 'No phone number added'}
                    </p>
                    
                    {profileData?.createdAt && (
                      <p className="text-gray-500 text-sm block mt-2">
                        Member since {new Date(profileData.createdAt.seconds ? 
                          profileData.createdAt.toDate() : 
                          profileData.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    {/* Display user roles */}
                    {profileData?.roles && (
                      <div className="mt-2">
                        {profileData.roles.map(role => (
                          <Tag key={role} color={role === 'admin' ? 'gold' : role === 'premium' ? 'green' : 'default'} className="mr-1">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              
              {/* User Content Component */}
              <Card className="bg-gray-900 border border-gray-800 mb-8">
                <UserContent 
                  user={user}
                  watchlist={watchlist}
                  likedContent={likedContent}
                  recentComments={recentComments}
                />
              </Card>
              
              {/* Account Settings Component */}
              <Card className="bg-gray-900 border border-gray-800">
                <EditAccount 
                  user={user}
                  profileData={profileData}
                  setProfileData={setProfileData}
                  updateSuccess={updateSuccess}
                  setUpdateSuccess={setUpdateSuccess}
                />
              </Card>
            </>
          )}
        </div>
      </div>
      
      {/* Custom styles for dark-themed UI */}
      <style jsx="true">{`
        .custom-tabs .ant-tabs-tab {
          color: #a0aec0;
        }
        .custom-tabs .ant-tabs-tab:hover {
          color: #ffffff;
        }
        .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #3db636 !important;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background-color: #3db636;
        }
        .ant-alert-success {
          background-color: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.2);
        }
        .ant-alert-success .ant-alert-message {
          color: #34D399;
        }
        .ant-alert-success .ant-alert-description {
          color: #D1FAE5;
        }
      `}</style>
    </>
  );
};

export default AccountPage;