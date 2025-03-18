import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
} from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { notification, Input, Button, Divider, Form } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Handle email/password sign-in
    const handleEmailPasswordSignIn = async (values) => {
        const { email, password } = values;

        if (!email || !password) {
            notification.error({
                message: 'Error',
                description: 'Please enter both email and password.',
            });
            return;
        }

        try {
            setLoading(true);
            setLoadingMessage(`Signing in as ${email}...`);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            notification.success({
                message: 'Success',
                description: 'Signed in successfully!',
            });

            navigate('/'); // Redirect to the homepage
        } catch (error) {
            console.error("Error during sign-in:", error);
            switch (error.code) {
                case 'auth/user-not-found':
                    notification.error({
                        message: 'Error',
                        description: 'No user found with this email.',
                    });
                    break;
                case 'auth/wrong-password':
                    notification.error({
                        message: 'Error',
                        description: 'Incorrect password.',
                    });
                    break;
                default:
                    notification.error({
                        message: 'Error',
                        description: 'Login failed. Please try again.',
                    });
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            setLoading(true);
            setLoadingMessage('Signing in with Google...');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            notification.success({
                message: 'Success',
                description: 'Signed in successfully with Google!',
            });

            navigate('/'); // Redirect to the homepage
        } catch (error) {
            console.error("Error with Google sign-in:", error);
            notification.error({
                message: 'Error',
                description: 'Google sign-in failed. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle passwordless sign-in via email link
    const handlePasswordlessSignIn = async () => {
        if (!email) {
            notification.error({
                message: 'Error',
                description: 'Please enter your email.',
            });
            return;
        }

        const actionCodeSettings = {
            url: 'http://localhost:3000/auth/magic-link-signin',
            handleCodeInApp: true,
        };

        try {
            setLoading(true);
            setLoadingMessage(`Sending sign-in link to ${email}...`);

            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            
            notification.success({
                message: 'Success',
                description: 'Sign-in link sent! Please check your email and click the link included.',
            });

            navigate('/auth/magic-link-signin');
        } catch (error) {
            console.error("Error sending sign-in link:", error);
            notification.error({
                message: 'Error',
                description: 'Error sending sign-in link. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign In | Koru Flicks</title>
            </Helmet>
            <AuthLayout 
                heading="Sign In" 
                loading={loading} 
                loadingMessage={loadingMessage}
            >
                <Form
                    form={form}
                    name="signin"
                    onFinish={handleEmailPasswordSignIn}
                    layout="vertical"
                    className="space-y-4"
                >
                    <Form.Item
                        name="email"
                        label={<span className="text-gray-300">Email Address</span>}
                        rules={[
                            { 
                                required: true, 
                                message: 'Please enter your email!',
                                type: 'email'
                            }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span className="text-gray-300">Password</span>}
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Enter your password"
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                    </Form.Item>

                    {/* Forgot password link */}
                    <div className="flex justify-end">
                        <Link
                            to="/auth/reset-password"
                            className="text-sm text-LGreen hover:text-white transition-colors duration-200"
                        >Forgot Password?
                        </Link>
                    </div>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            className="w-full bg-LGreen text-black font-semibold py-3 h-11 px-4 rounded-lg hover:bg-DGreen hover:text-white transition-colors duration-300 text-center"
                        >Sign In
                        </Button>
                    </Form.Item>

                    <Divider className="border-gray-700">
                        <span className="text-sm text-gray-400">or continue with</span>
                    </Divider>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={handleGoogleSignIn}
                            className="flex items-center justify-center px-4 py-3 h-11 bg-gray-800 text-white font-medium text-sm rounded-lg border border-gray-700 transition-colors duration-300 hover:bg-gray-700"
                            icon={<GoogleOutlined />}
                        >
                            Google
                        </Button>
                        
                        <Button
                            onClick={handlePasswordlessSignIn}
                            className="flex items-center justify-center px-4 py-3 h-11 bg-gray-800 text-white font-medium text-sm rounded-lg border border-gray-700 transition-colors duration-300 hover:bg-gray-700"
                            icon={<MailOutlined />}
                        >
                            Email Link
                        </Button>
                    </div>
                </Form>

                <p className="mt-8 text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/auth/signup"
                        className="text-LGreen hover:text-white transition-colors duration-200"
                    >
                        Sign up here
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
}

export default SignInPage;