import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    sendSignInLinkToEmail,
    GoogleAuthProvider,
    updateProfile
  } from 'firebase/auth';
  import { auth, db } from '../firebaseConfig';
  import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
  
  // Sign in with email and password
  export const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };
  
  // Sign up with email and password
  export const signUpWithEmail = async (email, password, firstName, lastName) => {
    try {
      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Create user document with default role
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        roles: ['user'],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      return user;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this is a first-time sign-in
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // First-time user, set up their document
        const { displayName, email } = user;
        
        // Split the displayName into first and last name
        const nameParts = displayName ? displayName.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await setDoc(userDocRef, {
          firstName,
          lastName,
          email,
          roles: ['user'],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          provider: 'google'
        });
      } else {
        // Existing user, just update the login timestamp
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        });
      }
      
      return user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };
  
  // Send password reset email
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };
  
  // Send email sign-in link
  export const sendMagicLink = async (email, redirectUrl) => {
    try {
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email for confirmation
      localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error("Magic link error:", error);
      throw error;
    }
  };
  
  // Get user roles
  export const getUserRoles = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().roles || ['user'];
      }
      return ['user']; // Default role
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return ['user'];
    }
  };
  
  // Update user profile
  export const updateUserProfile = async (uid, data) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // If updating name fields, also update auth display name
      if (data.firstName || data.lastName) {
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        const displayName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName });
        }
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };
  
  export default {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    sendMagicLink,
    getUserRoles,
    updateUserProfile
  };