import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SearchOutlined, QuestionCircleOutlined, FileTextOutlined, MailOutlined, PhoneOutlined, CommentOutlined, UserOutlined, PlayCircleOutlined, AppstoreOutlined, ToolOutlined } from '@ant-design/icons';


const SupportPage = () => {
    // State for search functionality (to be implemented)
    const [searchQuery, setSearchQuery] = useState('');
    
    // Placeholder for FAQ categories
    const faqCategories = [
        {
            id: 'account',
            title: 'Account & Billing',
            icon: <UserOutlined />,
            description: 'Questions about your account, subscriptions, and payments'
        },
        {
            id: 'streaming',
            title: 'Streaming & Playback',
            icon: <PlayCircleOutlined />,
            description: 'Help with watching content, video quality, and device compatibility'
        },
        {
            id: 'content',
            title: 'Content & Features',
            icon: <AppstoreOutlined />,
            description: 'Information about our movies, shows, and platform features'
        },
        {
            id: 'technical',
            title: 'Technical Issues',
            icon: <ToolOutlined />,
            description: 'Troubleshooting problems with the website or app'
        }
    ];

    return (
        <>
            <Helmet><title>Support & Help Center | Koru Flicks</title></Helmet>
            <div className="min-h-screen bg-black text-white">
                {/* Header/Navigation would typically be here */}
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <Link to="/">
                            <img src="/images/KF-WhiteText-GreenKoru-TransBG.svg" alt="Koru Flicks Logo" className="h-16" />
                        </Link>
                    </div>
                    
                    {/* Support Hero Section */}
                    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl mb-12">
                        <div className="p-8 text-center">
                            <h1 className="text-4xl font-bold text-LGreen mb-6">Help & Support Center</h1>
                            <div className="h-1 w-24 bg-LGreen mx-auto mb-8"></div>
                            
                            <p className="text-gray-200 text-lg mb-8">
                                Find answers to your questions or contact our support team for assistance.
                            </p>
                            
                            {/* Search Box - Functionality to be implemented later */}
                            <div className="relative max-w-2xl mx-auto mb-8">
                                <input
                                    type="text"
                                    placeholder="Search for help..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-LGreen"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <SearchOutlined className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative film strip */}
                        <div className="h-8 w-full bg-gray-800 flex">
                            {[...Array(20)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="h-full w-4 bg-gray-900 mx-1"
                                ></div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Main Support Content */}
                    <div className="max-w-6xl mx-auto">
                        {/* Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {/* FAQ Link */}
                            <div className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors duration-200">
                                <Link to="/support/faq" className="block">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                                        <QuestionCircleOutlined className="text-LGreen text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Frequently Asked Questions</h3>
                                    <p className="text-gray-300">Browse our knowledge base to find quick answers</p>
                                </Link>
                            </div>
                            
                            {/* Contact Link */}
                            <div className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors duration-200">
                                <Link to="/support/contact" className="block">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                                        <MailOutlined className="text-LGreen text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Contact Support</h3>
                                    <p className="text-gray-300">Get in touch with our customer support team</p>
                                </Link>
                            </div>
                            
                            {/* Submit Ticket Link */}
                            <div className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors duration-200">
                                <Link to="/support/ticket/new" className="block">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                                        <FileTextOutlined className="text-LGreen text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Submit a Ticket</h3>
                                    <p className="text-gray-300">Create a support ticket for detailed assistance</p>
                                </Link>
                            </div>
                        </div>
                        
                        {/* FAQ Categories Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Browse Help Topics</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* FAQ Category Placeholders - To be populated later */}
                                {/* Placeholder for Account & Billing */}
                                <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200">
                                    <Link to="/support/faq/account" className="block">
                                        <h3 className="text-xl font-semibold text-LGreen mb-3">Account & Billing</h3>
                                        <p className="text-gray-300 mb-4">Questions about your account, subscriptions, and payments</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">12 articles</span>
                                            <span className="text-LGreen">Browse →</span>
                                        </div>
                                    </Link>
                                </div>
                                
                                {/* Placeholder for Streaming & Playback */}
                                <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200">
                                    <Link to="/support/faq/streaming" className="block">
                                        <h3 className="text-xl font-semibold text-LGreen mb-3">Streaming & Playback</h3>
                                        <p className="text-gray-300 mb-4">Help with watching content, video quality, and device compatibility</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">8 articles</span>
                                            <span className="text-LGreen">Browse →</span>
                                        </div>
                                    </Link>
                                </div>
                                
                                {/* Placeholder for Content & Features */}
                                <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200">
                                    <Link to="/support/faq/content" className="block">
                                        <h3 className="text-xl font-semibold text-LGreen mb-3">Content & Features</h3>
                                        <p className="text-gray-300 mb-4">Information about our movies, shows, and platform features</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">10 articles</span>
                                            <span className="text-LGreen">Browse →</span>
                                        </div>
                                    </Link>
                                </div>
                                
                                {/* Placeholder for Technical Issues */}
                                <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200">
                                    <Link to="/support/faq/technical" className="block">
                                        <h3 className="text-xl font-semibold text-LGreen mb-3">Technical Issues</h3>
                                        <p className="text-gray-300 mb-4">Troubleshooting problems with the website or app</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">15 articles</span>
                                            <span className="text-LGreen">Browse →</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        {/* Popular Questions Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Popular Questions</h2>
                            
                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                                {/* Placeholder Questions - To be populated later */}
                                <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                                    <Link to="/support/faq/article-1" className="block">
                                        <h3 className="text-lg font-medium text-white mb-1">How do I reset my password?</h3>
                                        <p className="text-gray-400 text-sm">Account & Billing</p>
                                    </Link>
                                </div>
                                
                                <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                                    <Link to="/support/faq/article-2" className="block">
                                        <h3 className="text-lg font-medium text-white mb-1">Why is my video buffering or loading slowly?</h3>
                                        <p className="text-gray-400 text-sm">Streaming & Playback</p>
                                    </Link>
                                </div>
                                
                                <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                                    <Link to="/support/faq/article-3" className="block">
                                        <h3 className="text-lg font-medium text-white mb-1">How do I cancel my subscription?</h3>
                                        <p className="text-gray-400 text-sm">Account & Billing</p>
                                    </Link>
                                </div>
                                
                                <div className="border-b border-gray-800 p-4 hover:bg-gray-800">
                                    <Link to="/support/faq/article-4" className="block">
                                        <h3 className="text-lg font-medium text-white mb-1">What devices are compatible with Koru Flicks?</h3>
                                        <p className="text-gray-400 text-sm">Streaming & Playback</p>
                                    </Link>
                                </div>
                                
                                <div className="p-4 hover:bg-gray-800">
                                    <Link to="/support/faq/article-5" className="block">
                                        <h3 className="text-lg font-medium text-white mb-1">When will new episodes of my favorite show be released?</h3>
                                        <p className="text-gray-400 text-sm">Content & Features</p>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="text-center mt-6">
                                <Link to="/support/faq" className="text-LGreen hover:text-white transition-colors duration-200">
                                    View all FAQs →
                                </Link>
                            </div>
                        </div>
                        
                        {/* Contact Options */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Still Need Help?</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Email Support */}
                                <div className="bg-gray-900 rounded-lg p-6 text-center">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-14 h-14 rounded-full mb-4">
                                        <MailOutlined className="text-LGreen text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
                                    <p className="text-gray-300 mb-4">Get a response within 24 hours</p>
                                    <a href="mailto:support@koruflicks.com" className="text-LGreen hover:text-white transition-colors duration-200">
                                        support@koruflicks.com
                                    </a>
                                </div>
                                
                                {/* Phone Support */}
                                <div className="bg-gray-900 rounded-lg p-6 text-center">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-14 h-14 rounded-full mb-4">
                                        <PhoneOutlined className="text-LGreen text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Phone Support</h3>
                                    <p className="text-gray-300 mb-4">Available 9am-5pm NZT, Mon-Fri</p>
                                    <a href="tel:+6499001234" className="text-LGreen hover:text-white transition-colors duration-200">
                                        +64 9 900 1234
                                    </a>
                                </div>
                                
                                {/* Live Chat */}
                                <div className="bg-gray-900 rounded-lg p-6 text-center">
                                    <div className="bg-gray-800 inline-flex items-center justify-center w-14 h-14 rounded-full mb-4">
                                        <CommentOutlined className="text-LGreen text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
                                    <p className="text-gray-300 mb-4">Chat with our support team now</p>
                                    <button className="bg-LGreen text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200">
                                        Start Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Back to Home */}
                <div className="text-center mb-12">
                    <Link to="/" className="text-LGreen hover:text-white transition-colors duration-200">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SupportPage;