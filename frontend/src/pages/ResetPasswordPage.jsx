import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout';
import { resetPassword } from '../services/authService';

function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Function to handle password reset email sending
    const handleResetPassword = async (values) => {
        const { email } = values;
        
        try {
            setLoading(true);
            setLoadingMessage(`Sending password reset email to ${email}...`);

            // Use auth service to reset password
            await resetPassword(email);
            
            notification.success({
                message: 'Email Sent',
                description: 'If an account exists with that email, we have sent a password reset email.',
                duration: 7,
            });
            
            // Delay navigation to login page for 1 second to display success message
            setTimeout(() => {
                navigate("/auth/signin");
            }, 1000);
        } catch (error) {
            console.error("Error sending reset email:", error);
            // Handle Firebase Auth specific error messages
            switch (error.code) {
                case 'auth/invalid-email':
                    notification.error({
                        message: 'Error',
                        description: 'Invalid email format. Please check and try again.',
                    });
                    break;
                case 'auth/network-request-failed':
                    notification.error({
                        message: 'Error',
                        description: 'Network error. Please check your connection and try again.',
                    });
                    break;
                default:
                    notification.error({
                        message: 'Error',
                        description: 'Error sending reset email. Please try again.',
                    });
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password | Koru Flicks</title>
            </Helmet>
            <AuthLayout 
                heading="Reset Password" 
                loading={loading} 
                loadingMessage={loadingMessage}
            >
                <p className="text-gray-300 mb-6 text-center">
                    Please enter your email, and we will send you a link to reset your password.
                </p>
                
                <Form
                    form={form}
                    name="resetPassword"
                    onFinish={handleResetPassword}
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
                        >Reset Password
                        </Button>
                    </Form.Item>
                </Form>

                <p className="mt-8 text-sm text-center text-gray-400">
                    Remembered your password?{' '}
                    <Link to="/auth/signin" className="text-LGreen hover:text-white transition-colors duration-200"
                    > Sign in here
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
}

export default ResetPasswordPage;