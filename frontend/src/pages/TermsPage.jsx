import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TermsPage = () => {
    return (
        <>
            <Helmet><title>Terms of Use | Koru Flicks</title></Helmet>
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
                            <h1 className="text-4xl text-LGreen mb-6">Terms of Use</h1>
                            <div className="h-1 w-24 bg-LGreen mb-8"></div>
                            
                            <div className="space-y-8 text-gray-200">
                                <div className="prose prose-invert max-w-none">
                                    <p className="mb-4">Last Updated: March 21, 2025</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">1. Introduction</h2>
                                    <p>
                                        Welcome to Koru Flicks ("Koru Flicks," "Company," "we," "us," "our"), a digital streaming service provider. By accessing or utilizing our website and services or engaging in any form of interaction with us, you are entering into a binding agreement and consenting to comply with the terms and conditions outlined in this document. This is critical, as it influences your legal rights and obligations.
                                    </p>
                                    <p>
                                        This document, referred to as the "Terms of Use" (the "Policy") serves as a comprehensive guide, outlining the rules and regulations that dictate your interaction with our website (the "Website"), and the services we render. These terms form a legally binding contract between you (the user) and Koru Flicks (the service provider).
                                    </p>
                                    <p>
                                        Our Website includes any websites associated with Koru Flicks, specifically those with the KoruFlicks.vercel.app URL and pages that directly link to this Policy.
                                    </p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">2. Acceptance of Terms</h2>
                                    <p>
                                        Your access to and use of our website, services, or any form of interaction with us, whether through our Website, social media pages ("Socials"), or other channels, signifies your acknowledgment, understanding, and agreement to be bound by these terms. It also implies your commitment to comply with all prevailing laws and regulations. 
                                    </p>
                                    <p>
                                        If you are representing a business or any other entity, you affirm that you have the authority to bind said entity to these terms, making the term "you" applicable to both you as an individual and the entity you represent.
                                    </p>
                                    <p>
                                        This Policy should be read in conjunction with the Agreement under which you engaged us to provide services to you (the "Agreement"). If there is any inconsistency, the Agreement takes precedence over this Policy.
                                    </p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">3. Usage of Cookies and Tracking Technologies</h2>
                                    <p>
                                        We employ various tracking technologies, including cookies, web beacons, and pixels, to enhance your experience and optimize our services.
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Purpose:</strong> These technologies are used to gather information, provide personalized content, and analyze user interaction with our services.</li>
                                        <li><strong>Control:</strong> You can manage your preferences and opt out of certain tracking technologies. Detailed guidance on how to do so is provided in our Cookie Notice at KoruFlicks.vercel.app/cookie-notice</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">4. Updating This Policy</h2>
                                    <p>
                                        We are dedicated to upholding the highest standards of data protection and privacy. As part of this commitment, we regularly review and update our privacy notice to ensure its accuracy and compliance with current laws and best practices.
                                    </p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">4.1 Notification of Changes</h3>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Revised Date:</strong> Any changes made to this privacy notice will be reflected by an updated "modified" date at the top of this page. The changes will take effect immediately upon posting.</li>
                                        <li><strong>Material Changes:</strong> In the event of significant changes that directly impact your privacy or how we handle your personal information, we will take additional steps to notify you. This may include a conspicuous notice on our Website or a direct communication.</li>
                                    </ul>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">4.2 Encouragement to Stay Informed</h3>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Proactive Review:</strong> We encourage you to review our privacy notice regularly to stay informed about how we protect your information.</li>
                                        <li><strong>Open Communication:</strong> If you have any questions about this notice or our data protection practices, please do not hesitate to contact us. We are here to provide clarity and assurance regarding your privacy and the security of your personal information.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">5. Registration and Account Security</h2>
                                    <p>
                                        To access and utilize specific features of our Website or Services, you may be required to register and create an account. In doing so, you agree to provide accurate, current, and complete information as prompted by the registration process. You are responsible for maintaining the confidentiality of your account credentials and solely responsible for all activities that occur under your account.
                                    </p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Account Accuracy:</strong> You commit to ensuring that the information you provide during the registration process and any subsequent updates are truthful, precise, and comprehensive.</li>
                                        <li><strong>Account Security:</strong> You are responsible for safeguarding the confidentiality of your account password and other access credentials. Any unauthorized use or suspected security breach must be promptly reported to us.</li>
                                        <li><strong>Account Responsibility:</strong> You accept full responsibility for all activities conducted through your account, regardless of whether you or a third party undertakes such activities.</li>
                                        <li><strong>Account Usage:</strong> Your account is for your personal or business use only, as applicable. You may not impersonate someone else, create an account for someone else without their permission, or provide an email address other than your own.</li>
                                        <li><strong>Account Termination:</strong> We reserve the right to suspend or terminate your account at our sole discretion, without notice, if we believe that you have violated these Terms of Use, engaged in fraudulent or illegal activities, or for any other reason.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">6. User Commitments and Assurances</h2>
                                    <p>By using our Site and engaging in our Services, you affirm and guarantee that:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Legal Age and Authority:</strong> You are at least 18 years of age, or if you are under 18, you are using the Site under the supervision of a parent or guardian who agrees to be bound by these Terms of Use. You have the legal capacity and authority to enter into binding agreements.</li>
                                        <li><strong>Accurate Information:</strong> All information you submit to us is truthful, accurate, and complete. You will maintain the accuracy of such information and promptly update it as necessary.</li>
                                        <li><strong>Compliance with Laws:</strong> You will comply with all applicable local, state, national, and international laws and regulations in using the Site and our Services.</li>
                                        <li><strong>Prohibited Activities:</strong> You will not engage in any activities that are prohibited by these Terms of Use, or that could damage, disable, overburden, or impair the Site or interfere with any other party's use of the Site.</li>
                                        <li><strong>No False Identity:</strong> You will not use a false identity or provide false information and will not impersonate another user or any other person or entity.</li>
                                        <li><strong>No Unauthorized Access:</strong> You will not attempt to gain unauthorized access to the Site or our Services, other users' accounts, or any computer systems or networks connected to the Site.</li>
                                        <li><strong>No Harmful Conduct:</strong> You will not engage in any conduct that could harm us, our services, or any other Site user.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">7. Access and Use of the Site</h2>
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.1 Access to the Site</h3>
                                    <p>Upon completion of the registration process and acceptance of our terms, you are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the Site per these Terms of Use. Any additional rights are expressly excluded unless otherwise stated in writing.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.2 Permitted Uses</h3>
                                    <p>You are permitted to use the Site for lawful purposes and per these Terms of Use. Any use of the Site violating these Terms of Use or applicable laws, rules, or regulations is strictly prohibited.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.3 Prohibited Activities</h3>
                                    <p>You agree not to engage in any of the following prohibited activities:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>Copying, distributing, or disclosing any part of the Site in any medium.</li>
                                        <li>Using any automated system, including "robots," "spiders," "offline readers," etc., to access the Site.</li>
                                        <li>Transmitting spam, chain letters, or other unsolicited email.</li>
                                        <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Site.</li>
                                        <li>Taking any action that imposes, or may impose, an unreasonable or disproportionately large load on our infrastructure.</li>
                                        <li>Uploading invalid data, viruses, worms, or other software agents through the Site.</li>
                                        <li>Collecting or harvesting any personally identifiable information, including account names, from the Site.</li>
                                        <li>Using the Site for any commercial solicitation purposes.</li>
                                        <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity, conducting fraud, hiding, or attempting to hide your identity.</li>
                                        <li>Interfering with the proper working of the Site.</li>
                                        <li>Accessing any content on the Site through any technology or means other than those provided or authorized by the Site.</li>
                                        <li>Bypassing the measures we may use to prevent or restrict access to the Site, including features that prevent or restrict use or copying of any content or enforce limitations on the use of the Site or the content therein.</li>
                                    </ul>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.4 Changes to the Site</h3>
                                    <p>We reserve the right to modify, suspend, or discontinue, temporarily or permanently, the Site or any service to which it connects, with or without notice and without liability to you.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.5 Updates to the Site</h3>
                                    <p>We may occasionally provide enhancements or improvements to the features/functionality of the Site, which may include patches, bug fixes, updates, upgrades, and other modifications ("Updates"). Updates may modify or delete certain features and/or functionalities of the Site. You agree that we have no obligation to (i) provide any Updates or (ii) continue to provide or enable any particular features and/or functionalities of the Site to you. You further agree that all Updates will be (i) deemed to constitute an integral part of the Site, and (ii) subject to these Terms of Use.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">7.6 Third-Party Services</h3>
                                    <p>The Site may display, include, or make available third-party content (including data, information, applications, and other products or services) or provide links to third-party websites or services ("Third-Party Services"). You acknowledge and agree that we shall not be responsible for any Third-Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality, or any other aspect thereof. We do not assume and shall not have any liability or responsibility to you or any other person or entity for any Third-Party Services.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">8. Content Management</h2>
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">8.1 User Contributions</h3>
                                    <p>The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Site and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
                                        <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Site, and other users of the Site to use your Contributions in any manner contemplated by the Site and these Terms of Use.</li>
                                        <li>You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Site and these Terms of Use.</li>
                                        <li>Your Contributions are not false, inaccurate, or misleading.</li>
                                        <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
                                        <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
                                        <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
                                        <li>Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.</li>
                                        <li>Your Contributions do not violate any applicable law, regulation, or rule.</li>
                                        <li>Your Contributions do not violate any third party's privacy or publicity rights.</li>
                                        <li>Your Contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner.</li>
                                        <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.</li>
                                        <li>Your Contributions do not include offensive comments connected to race, national origin, gender, sexual preference, or physical handicap.</li>
                                        <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of these Terms of Use, or any applicable law or regulation.</li>
                                    </ul>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">8.2 Contribution License</h3>
                                    <p>By posting your Contributions to any part of the Site, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">8.3 Your Content Ownership and Rights</h3>
                                    <p>We do not claim any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Site. You are solely responsible for your Contributions to the Site and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>
                                    
                                    <h3 className="text-xl font-medium text-LGreen mt-6 mb-3">8.4 Site Management</h3>
                                    <p>We have the right, in our sole and absolute discretion, to edit, redact, or otherwise change any Contributions, to re-categorize any Contributions to place them in more appropriate locations on the Site, and to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">9. Guidelines for Providing Reviews</h2>
                                    <p>Koru Flicks values your feedback and encourages you to share your opinions and experiences in relation to our services. When contributing a review to our platform, please adhere to the following guidelines to ensure a respectful and constructive environment:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Firsthand Experience:</strong> Ensure your review is based on your personal experience with our services.</li>
                                        <li><strong>Appropriate Language:</strong> Maintain a respectful tone, avoiding any offensive, abusive, or discriminatory language.</li>
                                        <li><strong>Avoid Discrimination:</strong> Refrain from making discriminatory remarks based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability.</li>
                                        <li><strong>Stay Legal:</strong> Do not reference or imply any illegal activities in your review.</li>
                                        <li><strong>Avoid Conflicts of Interest:</strong> If you have affiliations with competitors, do not post negative reviews about our services.</li>
                                        <li><strong>Don't Jump to Conclusions:</strong> Avoid making assumptions or statements about the legality of conduct.</li>
                                        <li><strong>Be Honest and Accurate:</strong> Ensure that your review is truthful, accurate, and not misleading.</li>
                                        <li><strong>No Campaigning:</strong> Refrain from organizing campaigns to encourage others to post reviews, whether positive or negative.</li>
                                    </ul>
                                    <p>We reserve the right to accept, reject, or remove reviews at our sole discretion. Reviews do not necessarily reflect our views or opinions, and we do not assume liability for any review or for any claims, liabilities, or losses resulting from any review. By submitting a review, you grant us a perpetual, non-exclusive, worldwide, royalty-free, fully-paid, assignable, and sublicensable right to reproduce, modify, translate, display, and distribute the content of your review.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">10. Contributions and Feedback</h2>
                                    <p>Your input is invaluable to us, and we welcome your contributions, suggestions, and feedback with open arms. When you share your ideas, comments, or other forms of feedback with us regarding the Site ("Submissions"), please be aware of the following terms:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Non-Confidentiality:</strong> All Submissions you provide are non-confidential and will become the sole property of Koru Flicks.</li>
                                        <li><strong>Ownership and Use:</strong> We gain exclusive rights to these Submissions, including all associated intellectual property rights. We are free to use and share these Submissions for any lawful purpose, whether for commercial use or otherwise, without any obligation to acknowledge or compensate you.</li>
                                        <li><strong>Warranty and Originality:</strong> You assure that the Submissions are your original work, or you have the right to share them. By submitting, you also waive any moral rights you may have in the Submissions.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">11. Managing the Site</h2>
                                    <p>Our commitment to providing a safe and user-friendly environment on the Site is unwavering. However, we also need to set clear boundaries and expectations:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Oversight:</strong> We reserve the right, though not the obligation, to monitor the Site for any violations of our Terms of Use.</li>
                                        <li><strong>Enforcement:</strong> We may take legal action against anyone who breaches these Terms, including reporting them to law enforcement authorities.</li>
                                        <li><strong>Content Management:</strong> We can edit, move, or remove any content at our discretion, ensuring the Site remains orderly and on-topic.</li>
                                        <li><strong>Accessibility:</strong> We aim to keep the Site available at all times, but we must also conduct maintenance and updates, which could lead to temporary unavailability.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">12. Respecting Your Privacy</h2>
                                    <p>Your privacy is a priority for us, and we are committed to safeguarding your personal information. By using the Site, you are agreeing to our Privacy Policy, which is a fundamental part of these Terms of Use.</p>
                                    <p>For a detailed understanding of how we collect, use, and protect your personal information, please refer to our complete Privacy Policy at KoruFlicks.vercel.app/privacy</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">13. Copyright Infringements</h2>
                                    <p>We honor and protect intellectual property rights, advocating for the legal and ethical use of copyrighted material.</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Reporting Infringements:</strong> If you suspect any content on the Site violates your copyright, please promptly notify us. Provide detailed information to assist in our investigation.</li>
                                        <li><strong>Addressing Notifications:</strong> Upon receiving a notification, we'll review the material and take necessary actions, which might include removing the content or contacting the responsible party.</li>
                                        <li><strong>Legal Liability:</strong> Be aware that false claims can lead to legal consequences. Ensure accuracy and truthfulness when reporting potential infringements.</li>
                                        <li><strong>Support and Guidance:</strong> We are here to help. If you're unsure about the process or need assistance, feel free to reach out.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">14. Term and Termination</h2>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Duration of Terms:</strong> These Terms of Use are effective as long as you use the Site. They govern our relationship and your use of the Site.</li>
                                        <li><strong>Our Rights:</strong> We reserve the right to terminate your access or use of the Site at any time, for any reason, including for violations of these Terms of Use or applicable laws. This can happen without notice or liability.</li>
                                        <li><strong>Consequences of Termination:</strong> Upon termination, you must cease all use of the Site and its services. You may not create new accounts or attempt to access the Site through other means.</li>
                                        <li><strong>Legal Actions:</strong> We reserve the right to take legal actions for breaches, including pursuing damages and injunctive relief.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">15. Modifications and Interruptions</h2>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li><strong>Updates and Changes:</strong> We continually strive to improve the Site. This means we may update content, features, or services at any time. While we aim to provide timely and accurate updates, we are not obligated to explicitly announce every change.</li>
                                        <li><strong>Service Interruptions:</strong> Technical issues, maintenance, or updates may cause temporary interruptions. We are committed to minimizing downtime, but we cannot guarantee uninterrupted service.</li>
                                        <li><strong>Your Understanding:</strong> You acknowledge that interruptions may occur and agree not to hold us liable for any inconvenience or loss resulting from downtime.</li>
                                        <li><strong>Ongoing Development:</strong> We are dedicated to the continuous enhancement of the Site, ensuring it remains a valuable resource for all users.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">16. Governing Law</h2>
                                    <p>These Terms shall be governed and interpreted in accordance with the laws of New Zealand. Both you and Koru Flicks agree to submit to the jurisdiction of New Zealand courts for the resolution of any disputes arising from these Terms.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">17. Intellectual Property Rights</h2>
                                    <p>The content, features, and functionality of the website, including but not limited to text, graphics, logos, images, software, audio clips, and digital downloads, are the property of Koru Flicks, its licensors, or other providers of such material, and are protected by New Zealand and international intellectual property or proprietary rights laws.</p>
                                    <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the website for your personal, non-commercial use in accordance with these Terms of Use. However, this license does not allow you to make any commercial use or modification of the site or its contents.</p>
                                    <p>You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
                                        <li>You may store files that are automatically cached by your web browser for display enhancement purposes.</li>
                                    </ul>
                                    <p>You must not:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>Modify copies of any materials from this site.</li>
                                        <li>Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text.</li>
                                        <li>Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from this site.</li>
                                    </ul>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">18. Third-Party Links and Content</h2>
                                    <p>The website may contain links to third-party websites or resources that are not owned or controlled by Koru Flicks. These links are provided for your convenience only and do not imply any endorsement by Koru Flicks of the site or any association with its operators.</p>
                                    <p>We have no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. By using the website, you expressly relieve Koru Flicks from any and all liability arising from your use of any third-party website or reliance on any third-party content.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">19. Corrections</h2>
                                    <p>We strive to maintain accurate and up-to-date information on our Site. However, it is possible that the Site may contain typographical errors, inaccuracies, or omissions, including in descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information on the Site at any time, without prior notice. We appreciate your understanding and encourage you to contact us if you notice any discrepancies so that we can address them promptly.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">20. Disclaimer</h2>
                                    <p>The Site is provided on an "as is" and "as available" basis. Your use of the Site and our services is at your own risk. We disclaim all warranties, whether express or implied, related to the Site and your use of it, including but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no promises or guarantees regarding the accuracy or completeness of the content on the Site or any sites linked to the Site, and we will not be liable for any harm, loss, or damage resulting from your use of the Site.</p>
                                    <p>This includes but is not limited to:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>errors or inaccuracies in content and materials,</li>
                                        <li>personal injury or property damage resulting from your access to and use of the Site,</li>
                                        <li>unauthorized access to or use of our servers and/or any personal or financial information stored on them,</li>
                                        <li>interruption or cessation of transmission to or from the Site,</li>
                                        <li>bugs, viruses, trojan horses, or the like which may be transmitted to or through the Site by any third party, and</li>
                                        <li>errors or omissions in any content and materials or any loss or damage incurred due to the use of any content posted, transmitted, or otherwise made available via the Site.</li>
                                    </ul>
                                    <p>We do not warrant, endorse, guarantee, or assume responsibility for any product or service advertised or offered by a third party through the Site, any hyperlinked website, or any website or mobile application featured in any banner or other advertising. We will not be a party to or in any way responsible for monitoring any transaction between you and third-party providers of products or services.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">21. Limitations of Liability</h2>
                                    <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Site, even if we have been advised of the possibility of such damages.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">22. Indemnification</h2>
                                    <p>You agree to defend, indemnify, and hold harmless Koru Flicks, its subsidiaries, affiliates, and all of their respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of:</p>
                                    <ul className="list-disc pl-6 mb-6 space-y-2">
                                        <li>your Contributions;</li>
                                        <li>your use of the Site;</li>
                                        <li>breach of these Terms of Use;</li>
                                        <li>any breach of your representations and warranties set forth in these Terms of Use;</li>
                                        <li>your violation of the rights of a third party, including but not limited to intellectual property rights; or</li>
                                        <li>any overt harmful act toward any other user of the Site with whom you connected via the Site.</li>
                                    </ul>
                                    <p>Notwithstanding the foregoing, Koru Flicks reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">23. User Data</h2>
                                    <p>We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">24. Electronic Communications, Transactions, and Signatures</h2>
                                    <p>Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing.</p>
                                    <p>YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">25. Miscellaneous</h2>
                                    <p>This policy and any policies or operating rules posted by us on the Site or in respect to the Site constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms of Use shall not operate as a waiver of such right or provision. These Terms of Use operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Terms of Use is determined to be unlawful, void, or unenforceable, that provision or portion of the provision is deemed severable from these Terms of Use and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment, or agency relationship created between you and us due to these Terms of Use or use of the Site. You agree that these Terms of Use will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Terms of Use and the lack of signing by the parties hereto to execute these Terms of Use.</p>
                                    
                                    <h2 className="text-2xl text-white mt-8 mb-4">26. Contact Us</h2>
                                    <p>We value open communication and are here to assist with any inquiries or concerns you might have. Below are the ways you can reach out to us:</p>
                                    <p><strong>Email:</strong> For quick and direct communication, please email us at KoruFlicks@brears.xyz</p>
                                    <p>Alternatively, please visit our Website or help desk to access our contact form and other contact methods.</p>
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
}

export default TermsPage;