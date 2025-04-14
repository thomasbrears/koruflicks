import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { notification, Input, Button, Divider, Form, Checkbox } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import AuthLayout from '../layouts/AuthLayout';
import { signUpWithEmail, signInWithGoogle } from '../services/authService';

function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const navigate = useNavigate();
    const [form] = Form.useForm();

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

    // Handle sign-up with email/password
    const handleSubmit = async (values) => {
        const { email, confirmEmail, password, confirmPassword, firstName, lastName, agreement } = values;
    
        if (!email || !confirmEmail || !password || !confirmPassword || !firstName || !lastName || !agreement) {
            notification.error({
                message: 'Error',
                description: 'Please fill in all fields and accept the Terms of Service.',
            });
            return;
        }
        
        if (email !== confirmEmail) {
            notification.error({
                message: 'Error',
                description: 'Email addresses do not match.',
            });
            return;
        }
        
        if (password !== confirmPassword) {
            notification.error({
                message: 'Error',
                description: 'Passwords do not match.',
            });
            return;
        }
    
        try {
            setLoading(true);
            setLoadingMessage(`Creating account for ${email}...`);
    
            // Use the auth service to sign up
            await signUpWithEmail(email, password, firstName, lastName);
            
            notification.success({
                message: 'Success',
                description: 'Account created successfully! Please verify your email.',
            });
            
            navigate('/auth/verify-email'); // Redirect to email verification page
        } catch (error) {
            console.error('Error creating user:', error);
            // Handle Firebase Auth specific error messages
            switch (error.code) {
                case 'auth/email-already-in-use':
                    notification.error({
                        message: 'Error',
                        description: 'This email is already in use. Please sign in or use a different email.',
                    });
                    break;
                case 'auth/invalid-email':
                    notification.error({
                        message: 'Error',
                        description: 'Invalid email format. Please enter a valid email.',
                    });
                    break;
                case 'auth/weak-password':
                    notification.error({
                        message: 'Error',
                        description: 'Password is too weak. Please use a stronger password.',
                    });
                    break;
                default:
                    notification.error({
                        message: 'Error',
                        description: error.message || 'Error creating account. Please try again.',
                    });
            }
        } finally {
            setLoading(false);
        }
    };    
    
    // Handle sign-up with Google
    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);
            setLoadingMessage('Signing up with Google...');
    
            // Use the auth service to sign in with Google
            await signInWithGoogle();
            
            notification.success({
                message: 'Success',
                description: 'Account created successfully with Google!',
            });
            
            navigate('/'); // Redirect to the home page after successful Google sign-up
        } catch (error) {
            console.error('Error with Google sign-up:', error);
            notification.error({
                message: 'Error',
                description: 'Google sign-up failed. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign Up | Koru Flicks</title>
            </Helmet>
            <AuthLayout 
                heading="Sign Up" 
                loading={loading} 
                loadingMessage={loadingMessage}
            >
                <Form
                    form={form}
                    name="signup"
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-4"
                >
                    <Form.Item
                        name="firstName"
                        label={<span className="text-gray-300">First Name</span>}
                        rules={[{ required: true, message: 'Please enter your first name!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Enter your first name"
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label={<span className="text-gray-300">Last Name</span>}
                        rules={[{ required: true, message: 'Please enter your last name!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Enter your last name"
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                        />
                    </Form.Item>

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
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                        />
                    </Form.Item>

                    <Form.Item noStyle dependencies={['email']}>
                        {({ getFieldValue }) => {
                            const email = getFieldValue('email');
                            return email ? (
                                <Form.Item
                                    name="confirmEmail"
                                    label={<span className="text-gray-300">Confirm Email Address</span>}
                                    dependencies={['email']}
                                    rules={[
                                        { 
                                            required: true, 
                                            message: 'Please confirm your email!'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('email') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two email addresses do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input 
                                        prefix={<MailOutlined className="site-form-item-icon" />}
                                        placeholder="Confirm your email"
                                        className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        style={{ backgroundColor: '#1f2937', color: 'white' }}
                                    />
                                </Form.Item>
                            ) : null;
                        }}
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span className="text-gray-300">Password</span>}
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Enter your password"
                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                        />
                    </Form.Item>

                    <Form.Item noStyle dependencies={['password']}>
                        {({ getFieldValue }) => {
                            const password = getFieldValue('password');
                            const strength = calculatePasswordStrength(password);
                            
                            // Only render the following if password has some value
                            return password ? (
                                <>
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
                                    
                                    <Form.Item
                                        name="confirmPassword"
                                        label={<span className="text-gray-300">Confirm Password</span>}
                                        dependencies={['password']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The two passwords do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            placeholder="Confirm your password"
                                            className="px-4 py-2 h-11 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                            style={{ backgroundColor: '#1f2937', color: 'white' }}
                                        />
                                    </Form.Item>
                                </>
                            ) : null;
                        }}
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Please accept the agreement')),
                            },
                        ]}
                    >
                        <Checkbox className="text-gray-300">
                            I agree to the <Link to="/terms" className="text-LGreen hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-LGreen hover:underline">Privacy Policy</Link>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            className="w-full bg-LGreen text-black font-semibold py-3 h-11 px-4 rounded-lg hover:bg-DGreen hover:text-white transition-colors duration-300 text-center"
                        >Sign Up
                        </Button>
                    </Form.Item>

                    <Divider className="border-gray-700">
                        <span className="text-sm text-gray-400">or continue with</span>
                    </Divider>

                    <Button
                        onClick={handleGoogleSignUp}
                        className="w-full flex items-center justify-center h-11 bg-gray-800 text-white font-medium text-sm rounded-lg border border-gray-700 transition-colors duration-300 hover:bg-gray-700"
                        icon={<GoogleOutlined />}
                    >Sign up with Google
                    </Button>
                </Form>

                <p className="mt-8 text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <Link
                        to="/auth/signin"
                        className="text-LGreen hover:text-white transition-colors duration-200"
                    >Sign in here
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
}

export default SignUpPage;