import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
    return (
        <>
            <Helmet><title>Privacy Policy | Koru Flicks</title></Helmet>
            <div className="min-h-screen bg-black text-white">
                {/* Header/Navigation would typically be here */}
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <Link to="/">
                            <img src="/images/KF-WhiteText-GreenKoru-TransBG.svg" alt="Koru Flicks Logo" className="h-16" />
                        </Link>
                    </div>
                    
                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                        <div className="p-8">
                            <h1 className="text-4xl   text-LGreen mb-6">Privacy Policy</h1>
                            <div className="h-1 w-24 bg-LGreen mb-8"></div>
                            
                            <div className="space-y-8 text-gray-200">
                                <div className="prose prose-invert max-w-none">
                                    <p className="mb-4">Last Updated: March 19, 2025</p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">1. Introduction</h2>
                                    <p>
                                        At Koru Flicks, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our streaming service.
                                    </p>
                                    <p>
                                        Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">2. Information We Collect</h2>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">2.1 Personal Information</h3>
                                    <p>We may collect the following types of personal information:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and billing information.</li>
                                        <li><strong>Payment Information:</strong> If you subscribe to our service, we collect payment details, billing address, and transaction history.</li>
                                        <li><strong>Profile Information:</strong> Information you provide in your user profile, such as profile picture, preferences, and interests.</li>
                                        <li><strong>Contact Information:</strong> Information you provide when contacting our customer support.</li>
                                    </ul>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">2.2 Usage Information</h3>
                                    <p>We automatically collect certain information about your interaction with our platform:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Viewing History:</strong> The movies and shows you watch, search for, or add to your watchlist.</li>
                                        <li><strong>Device Information:</strong> Type of device, operating system, browser type, device ID, and IP address.</li>
                                        <li><strong>Log Data:</strong> Time and duration of visits, pages viewed, features used, and error reports.</li>
                                        <li><strong>Location Information:</strong> General location based on IP address or more precise location if you grant permission.</li>
                                    </ul>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">2.3 Cookies and Similar Technologies</h3>
                                    <p>
                                        We use cookies, web beacons, and similar technologies to collect information about your browsing behavior, remember your preferences, and improve your experience. You can manage your cookie preferences through your browser settings, although disabling certain cookies may affect the functionality of our service.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">3. How We Use Your Information</h2>
                                    <p>We use the information we collect for the following purposes:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Provide and Maintain Service:</strong> To deliver our streaming service, process payments, and fulfill our contractual obligations.</li>
                                        <li><strong>Personalize Experience:</strong> To customize content recommendations, display relevant advertisements, and enhance your user experience.</li>
                                        <li><strong>Improve Service:</strong> To analyze usage patterns, troubleshoot technical issues, and develop new features.</li>
                                        <li><strong>Communication:</strong> To send service updates, administrative messages, and marketing communications (you can opt out of marketing communications).</li>
                                        <li><strong>Customer Support:</strong> To respond to your inquiries and resolve issues.</li>
                                        <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other potentially prohibited or illegal activities.</li>
                                        <li><strong>Compliance:</strong> To comply with legal obligations and enforce our Terms of Use.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">4. How We Share Your Information</h2>
                                    <p>We may share your information with the following categories of recipients:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Service Providers:</strong> Third-party companies that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.</li>
                                        <li><strong>Business Partners:</strong> Content providers, distributors, and marketing partners with whom we have agreements.</li>
                                        <li><strong>Affiliates:</strong> Companies within the Koru Flicks corporate family.</li>
                                        <li><strong>Legal Authorities:</strong> When required by law, legal process, or to protect our rights or the safety of others.</li>
                                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset.</li>
                                    </ul>
                                    <p>
                                        We do not sell your personal information to third parties for their marketing purposes without your explicit consent.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">5. Data Retention</h2>
                                    <p>
                                        We retain your personal information for as long as your account is active or as needed to provide you with our services. We will also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
                                    </p>
                                    <p>
                                        You can request deletion of your account and personal information by contacting us. Note that some information may be retained in our backup systems for a period after deletion.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">6. Data Security</h2>
                                    <p>
                                        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                                    </p>
                                    <p>
                                        We encourage you to use a unique and strong password, keep your account information confidential, and log out after using our service on shared devices.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">7. Your Rights and Choices</h2>
                                    <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                                        <li><strong>Correction:</strong> You can request corrections to inaccurate or incomplete information.</li>
                                        <li><strong>Deletion:</strong> You can request deletion of your personal information under certain circumstances.</li>
                                        <li><strong>Objection:</strong> You can object to our processing of your personal information for direct marketing purposes.</li>
                                        <li><strong>Restriction:</strong> You can request restriction of processing of your personal information.</li>
                                        <li><strong>Data Portability:</strong> You can request a copy of your personal information in a structured, machine-readable format.</li>
                                    </ul>
                                    <p>
                                        To exercise these rights, please contact us at Privacy-KoruFlicks@brears.xyz. We will respond to your request within 30 days.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">8. Children's Privacy</h2>
                                    <p>
                                        Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information as soon as possible.
                                    </p>
                                    <p>
                                        Parents who believe we may have collected personal information from their child can contact us at Privacy-KoruFlicks@brears.xyz.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">9. International Data Transfers</h2>
                                    <p>
                                        Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from those in your country.
                                    </p>
                                    <p>
                                        When we transfer personal information across borders, we take appropriate measures to ensure that your information receives an adequate level of protection, including through standard contractual clauses approved by relevant authorities.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">10. Third-Party Links and Services</h2>
                                    <p>
                                        Our service may contain links to third-party websites, applications, or services that are not operated or controlled by Koru Flicks. This Privacy Policy does not apply to those third-party services. We encourage you to review the privacy policies of any third-party services you visit.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">11. Changes to This Privacy Policy</h2>
                                    <p>
                                        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
                                    </p>
                                    <p>
                                        We encourage you to review this Privacy Policy periodically for any changes. Continued use of our service after such modifications constitutes your acknowledgment of the modified Privacy Policy.
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">12. Contact Information</h2>
                                    <p>
                                        If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us by emailing Privacy-KoruFlicks@brears.xyz<br />
                                    </p>
                                    
                                    <h2 className="text-2xl   text-white mt-8 mb-4">13. Cookie Policy</h2>
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">13.1 What Are Cookies?</h3>
                                    <p>Cookies are small text files placed on your computer by the websites you visit. They are widely used to make websites work or work more efficiently, as well as to provide information to the site's owners. 
                                    <br />The use of cookies is now standard for most websites. If you are uncomfortable using cookies, you can manage and control them through your browser, including removing cookies by deleting them from your 'browser history' (cache) when you leave the site.
                                    <br />Weboid and its service providers may use analytics cookies, also called performance cookies, to collect information about your site use. The analytics cookies collect information which, amongst other things, allows us to count our audience size and see usage patterns. The analytics cookies also record if you experience difficulties using our site, which can assist us in improving functionality.
                                    <br />Weboid and its service providers may also use targeting and tracking cookies to understand your interests and behaviours as you browse our site, so we can deliver a more personalised experience in the future. This may also assist us in delivering relevant advertising to you during various advertising campaigns we may run through participating third-party sites.
                                    <br />Our website uses Google Analytics, a service that transmits website traffic data to Google servers in the United States. Google Analytics does not identify individual users or associate your IP address with any other data held by Google. We use reports provided by Google Analytics to help us understand website traffic and webpage usage.
                                    <br />Please note, by using this website, you consent to the processing of data about you by Google in the manner described in  'How Google uses data when you use our partners' sites or apps', which is located at policies.google.com/technologies/partner-sites</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">13.2 Types of Cookies</h3>
                                    <p>Cookies are small text files placed on your computer by the websites you visit. They are widely used to make websites work or work more efficiently, as well as to provide information to the site's owners. </p>
                                    
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Session cookies</strong> remain in your browser during your browser session only, ie until you leave the website.</li>
                                        <li><strong>Persistent cookies</strong> remain in your browser after the session (unless deleted by you).</li>
                                        <li><strong>Performace cookies</strong> collect information about your use of the website, such as webpages visited and any error messages; they do not collect personally identifiable information, and the information collected is aggregated such that it is anonymous. Performance cookies are used to improve how a website works.</li>
                                        <li><strong>Functionality cookies</strong> allow the website to remember any choices you make about the website (such as changes to text size and customised pages) or enable services such as commenting on a blog.</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">13.3 Managing Cookies</h3>
                                    <p>You have control over your cookie settings and can choose to accept, reject, or customize your cookie preferences. Please note that blocking some types of cookies may impact your experience on our site and the services we are able to offer.</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Browser Settings: </strong>You can manage your cookie preferences through your browser settings, where you can delete existing cookies, prevent future cookies, and set preferences for certain websites.</li>
                                        <li><strong>Opt-out Tools:</strong> There are also third-party tools available that enable you to opt out of tracking by certain advertisers.</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">You can learn more about cookies at allaboutcookies.org</h3>
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
                    
                    {/* Back to Home */}
                    <div className="mt-8 text-center">
                        <Link to="/" className="text-LGreen hover:text-white transition-colors duration-200">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPage;