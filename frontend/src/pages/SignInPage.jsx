import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { notification, Input, Button, Divider, Form, Checkbox } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout';
import { signInWithEmail, signInWithGoogle, sendMagicLink } from '../services/authService';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();

    // Handle email/password sign-in
    const handleEmailPasswordSignIn = async (values) => {
        const { email, password, rememberMe } = values;

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
            
            // Use auth service to sign in
            const user = await signInWithEmail(email, password);
            
            // If remember me is checked, store in localStorage, otherwise sessionStorage
            if (rememberMe) {
                localStorage.setItem('hasSession', 'true');
            } else {
                sessionStorage.setItem('hasSession', 'true');
            }
            
            notification.success({
                message: 'Success',
                description: 'Signed in successfully!',
            });

            // Redirect to the previous URL if available, otherwise to home
            const previousUrl = sessionStorage.getItem('previousUrl');
            if (previousUrl) {
                navigate(previousUrl);
                sessionStorage.removeItem('previousUrl');
            } else {
                navigate('/');
            }
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
        try {
            setLoading(true);
            setLoadingMessage('Signing in with Google...');
            
            // Use auth service to sign in with Google
            await signInWithGoogle();
            
            notification.success({
                message: 'Success',
                description: 'Signed in successfully with Google!',
            });

            // Redirect to the previous URL if available, otherwise to home
            const previousUrl = sessionStorage.getItem('previousUrl');
            if (previousUrl) {
                navigate(previousUrl);
                sessionStorage.removeItem('previousUrl');
            } else {
                navigate('/');
            }
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
        // Get email from form
        const formEmail = form.getFieldValue('email');
        const emailToUse = formEmail || email;
        
        if (!emailToUse) {
            notification.error({
                message: 'Error',
                description: 'Please enter your email.',
            });
            return;
        }

        try {
            setLoading(true);
            setLoadingMessage(`Sending sign-in link to ${emailToUse}...`);

            // Use auth service to send magic link
            const redirectUrl = window.location.origin + '/auth/magic-link-signin';
            await sendMagicLink(emailToUse, redirectUrl);
            
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
                    initialValues={{ rememberMe: true }}
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

                    <div className="flex justify-between">
                        <Form.Item
                            name="rememberMe"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox className="text-gray-300">
                                Remember me
                            </Checkbox>
                        </Form.Item>
                        
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