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
import UserContent from '../components/account/UserContent';

const LibraryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Loading state while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
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
        <title>My Library | Koru Flicks</title>
      </Helmet>
      
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <Card className="bg-gray-900 border border-gray-800">
              <Skeleton active paragraph={{ rows: 10 }} />
            </Card>
          ) : (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Library</h1>
                <p className="text-gray-400">Manage your watchlist and liked content</p>
              </div>

              {/* User Content Component */}
              <UserContent 
                user={user}
                recentComments={recentComments}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LibraryPage;