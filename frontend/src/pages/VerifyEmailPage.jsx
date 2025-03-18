import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button, notification, Result, Progress } from 'antd';
import { MailOutlined, HomeOutlined, RedoOutlined } from '@ant-design/icons';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import AuthLayout from '../layouts/AuthLayout';

function VerifyEmailPage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds countdown
    const [canResend, setCanResend] = useState(false); // They can't resend immediately
    const [userEmail, setUserEmail] = useState('');

    // Check if user is available and get email
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email); // Set the user's email to display
        } else {
            // If no user is logged in, redirect to sign in
            notification.warning({
                message: 'Not signed in',
                description: 'Please sign in to verify your email address.',
            });
            navigate('/auth/signin');
        }

        // Polling to check if the user's email is verified
        const intervalId = setInterval(() => {
            if (user) {
                user.reload().then(() => {
                    if (user.emailVerified) {
                        clearInterval(intervalId);
                        notification.success({
                            message: 'Success',
                            description: 'Email verified! Happy Watching',
                        });
                        navigate('/'); // Redirect to home page after verification
                    }
                });
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [auth, navigate]);

    // Countdown logic for resend email button
    useEffect(() => {
        let timer;
        if (resendCooldown > 0 && !canResend) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        } else if (resendCooldown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [resendCooldown, canResend]);

    // Handle resend email
    const handleResendEmail = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                notification.error({
                    message: 'Error',
                    description: 'No user is currently logged in. Please sign in again.',
                });
                navigate('/auth/signin');
                return;
            }

            setLoading(true);
            setLoadingMessage(`Resending verification email to ${user.email}...`);
            
            await sendEmailVerification(user);
            
            notification.success({
                message: 'Success',
                description: 'Verification email resent! Please check your inbox.',
            });
            
            setCanResend(false); // Disable the resend button
            setResendCooldown(60); // Reset countdown
        } catch (error) {
            console.error('Error resending verification email:', error);
            notification.error({
                message: 'Error',
                description: 'Sorry, we failed to resend the verification email. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Verify Email | Koru Flicks</title>
            </Helmet>
            <AuthLayout
                heading="" 
                loading={loading} 
                loadingMessage={loadingMessage}
            >
                <Result
                    icon={<MailOutlined style={{ color: '#10B981', fontSize: '48px' }} />}
                    title={<span className="text-white text-xl">Check your inbox!</span>}
                    subTitle={
                        <div className="text-gray-300 text-center">
                            <p className="mb-2">We have sent a verification email to:</p>
                            <p className="font-bold text-LGreen mb-4">{userEmail}</p>
                            <p>Please click the verification link in the email to verify your account.</p>
                            <p className="mt-2">Once verified, you will be automatically redirected.</p>
                        </div>
                    }
                    extra={[
                        <div key="cooldown" className="mb-4 w-full">
                            {!canResend && (
                                <div className="mb-2">
                                    <Progress 
                                        percent={Math.round((60 - resendCooldown) / 60 * 100)} 
                                        showInfo={false}
                                        strokeColor="#10B981"
                                        trailColor="#374151"
                                    />
                                    <p className="text-center text-gray-400 text-sm">
                                        Resend available in {resendCooldown}s
                                    </p>
                                </div>
                            )}
                            <Button 
                                type="primary"
                                onClick={handleResendEmail}
                                disabled={!canResend}
                                icon={<RedoOutlined />}
                                className={`w-full bg-LGreen text-black font-semibold py-3 h-11 px-4 rounded-lg hover:bg-DGreen hover:text-white transition-colors duration-300 text-center ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >Resend Verification Email
                            </Button>
                        </div>,
                        
                    ]}
                    className="text-white bg-transparent"
                />
            </AuthLayout>
        </>
    );
}

export default VerifyEmailPage;