import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification, Result } from 'antd';
import { MailOutlined, HomeOutlined } from '@ant-design/icons';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import AuthLayout from '../layouts/AuthLayout';
import Loading from '../components/Loading';

function MagicLinkSigninPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Checking your sign-in link...');
    const [emailPrompt, setEmailPrompt] = useState(false);
    const [hasNotified, setHasNotified] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const [form] = Form.useForm();

    // Function to handle sign-in with email link
    const handleSignIn = async (email) => {
        setLoading(true);
        setLoadingMessage(`Signing in with ${email}...`); 
        try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            const user = result.user;

            window.localStorage.removeItem('emailForSignIn');
            localStorage.setItem('token', result.user.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));

            if (!hasNotified) {
                notification.success({
                    message: 'Success',
                    description: 'Successfully signed in! Welcome!'
                });
                setHasNotified(true);
            }
            
            // Get previous URL from session storage
            const previousUrl = sessionStorage.getItem('previousUrl');

            // Redirect to the previous URL page, otherwise redirect to home
            if (previousUrl) {
                navigate(previousUrl); // Redirect to the previous URL
                sessionStorage.removeItem('previousUrl'); // Clear after redirect
            } else {
                navigate('/');
            }
        } catch (error) {
            // Handle Firebase Auth specific error messages
            if (!hasNotified) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        notification.error({
                            message: 'Error',
                            description: 'Invalid email. Please check and try again.'
                        });
                        break;
                    case 'auth/expired-action-code':
                        notification.error({
                            message: 'Error',
                            description: 'The sign-in link has expired. Please request a new one.'
                        });
                        break;
                    case 'auth/invalid-action-code':
                        notification.error({
                            message: 'Error',
                            description: 'The sign-in link is invalid. Please check your email for a valid link.'
                        });
                        break;
                    case 'auth/user-disabled':
                        notification.error({
                            message: 'Error',
                            description: 'This account has been disabled. Please contact support.'
                        });
                        break;
                    case 'auth/network-request-failed':
                        notification.error({
                            message: 'Error',
                            description: 'Network error. Please check your internet connection and try again.'
                        });
                        break;
                    default:
                        notification.error({
                            message: 'Error',
                            description: 'Error signing in. Please try again.'
                        });
                        break;
                }
                setHasNotified(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const storedEmail = window.localStorage.getItem('emailForSignIn');
            if (storedEmail) {
                handleSignIn(storedEmail);
            } else {
                setEmailPrompt(true);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [auth]);

    // Function to handle form submission for email input
    const handleSubmitEmail = (values) => {
        handleSignIn(values.email);
    };

    return (
        <>
            <Helmet>
                <title>Complete Your Sign-In | Koru Flicks</title>
            </Helmet>
            <AuthLayout 
                heading="" 
                loading={loading} 
                loadingMessage={loadingMessage}
            >
                {!loading && (
                    <>
                        {emailPrompt ? (
                            <>
                                <p className="text-gray-300 mb-6 text-center">
                                    Please confirm your email to complete the sign-in process. 
                                    This is needed to verify your identity and log you in.
                                </p>
                                <Form
                                    form={form}
                                    name="emailConfirm"
                                    onFinish={handleSubmitEmail}
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit"
                                            className="w-full bg-LGreen text-black font-semibold py-3 h-11 px-4 rounded-lg hover:bg-DGreen hover:text-white transition-colors duration-300 text-center"
                                        >
                                            Complete Sign-in
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </>
                        ) : (
                            <Result
                                icon={<MailOutlined style={{ color: '#10B981' }} />}
                                title={<span className="text-white">Check your email</span>}
                                subTitle={
                                    <span className="text-gray-300">
                                        We emailed you a link to sign in to your account. 
                                        Please click the link on this device to complete the sign-in.
                                    </span>
                                }
                                extra={[
                                    <Button 
                                        key="home"
                                        onClick={() => navigate('/')}
                                        className="bg-LGreen text-black hover:bg-DGreen hover:text-white"
                                        icon={<HomeOutlined />}
                                    >
                                        Home
                                    </Button>,
                                ]}
                                className="text-white bg-transparent"
                            />
                        )}
                    </>
                )}
            </AuthLayout>
        </>
    );    
}

export default MagicLinkSigninPage;