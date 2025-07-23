import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Skeleton, 
  Empty, 
  Tag, 
  message
} from 'antd';
import { 
  QuestionCircleOutlined, 
  FormOutlined, 
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  RightOutlined,
  WarningOutlined
} from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { fetchUserTickets } from '../../api/ContactAPI';
import '../../style/Support.css';

const SupportPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [userTickets, setUserTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  
  const navigate = useNavigate();
  
  // Fetch user tickets if user is logged in
  useEffect(() => {
    const getUserTickets = async () => {
      if (user && user.uid) {
        setTicketsLoading(true);
        setTicketsError(null);
        
        try {
          const tickets = await fetchUserTickets(user.uid);
          setUserTickets(tickets || []);
          setFetchAttempted(true);
        } catch (error) {
          console.error('Error fetching user tickets:', error);
          setTicketsError('Failed to load your tickets. Please try again later.');
          message.error('Could not retrieve your support tickets. Please try again later.');
        } finally {
          setTicketsLoading(false);
        }
      }
    };
    
    if (user && !authLoading) {
      getUserTickets();
    }
  }, [user, authLoading]);
  
  // Get status color for ticket status tags
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'blue';
      case 'in progress':
      case 'in-progress':
        return 'orange';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Format date for ticket display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };
  
  // Handle ticket click to navigate to all tickets page with selected ticket ID
  const handleTicketClick = (ticketId) => {
    navigate('/support/tickets', { state: { selectedTicketId: ticketId } });
  };
  
  // Determine if the user is logged in
  const isLoggedIn = !!user;
  
  // Determine if there are recent tickets to show
  const hasRecentTickets = isLoggedIn && userTickets && userTickets.length > 0;
  
  // Get only the 3 most recent tickets
  const recentTickets = hasRecentTickets 
    ? [...userTickets]
        .sort((a, b) => {
          // Safely handle missing dates
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 3) 
    : [];
  
  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* title Section */}
      <div className="bg-black py-12 mb-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-white mb-4">Support Center</h1>
            <p className="text-xl text-gray-400 mb-6">How can we help you today?</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mb-12 flex-grow">
        {/* Recent Tickets Section for Logged-in Users */}
        {isLoggedIn && (
          <div className="mb-12">
            <div className="section-header mb-4">
              <h2 className="section-title">Your Recent Tickets</h2>
            </div>
            
            {ticketsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-900 border-gray-800 ticket-skeleton">
                  <Skeleton active paragraph={{ rows: 2 }} avatar />
                </Card>
                <Card className="bg-gray-900 border-gray-800 ticket-skeleton">
                  <Skeleton active paragraph={{ rows: 2 }} avatar />
                </Card>
                <Card className="bg-gray-900 border-gray-800 ticket-skeleton lg:block hidden">
                  <Skeleton active paragraph={{ rows: 2 }} avatar />
                </Card>
              </div>
            ) : ticketsError ? (
              <Card className="bg-gray-900 border-gray-800 mb-6">
                <div className="flex items-center justify-center p-6 flex-col">
                  <WarningOutlined style={{ fontSize: '36px', color: '#ff4d4f', marginBottom: '16px' }} />
                  <span className="text-gray-400">{ticketsError}</span>
                  <Button 
                    type="primary" 
                    className="mt-4 border-0"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            ) : hasRecentTickets ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentTickets.map((ticket) => (
                  <Card 
                    key={ticket.id}
                    className="bg-gray-900 border-gray-800 ticket-card" 
                    hoverable
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-3 flex-grow">
                        <div className="flex items-center mb-2">
                          <FileTextOutlined className="text-green-500 mr-2" />
                          <span className="text-white ticket-subject truncate" style={{ maxWidth: '90%' }}>
                            {ticket.subject || 'No Subject'}
                          </span>
                        </div>
                        <div className="ticket-meta">
                          <span className="ticket-number block mb-1">
                            Ticket #{ticket.ticketNumber || 'Unknown'}
                          </span>
                          <span className="ticket-date block text-gray-400 text-sm">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Tag 
                          color={getStatusColor(ticket.status)} 
                          className="ticket-status"
                        >
                          {ticket.status || 'Unknown'}
                        </Tag>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* View All Card */}
                <Card 
                  className="bg-gray-900 border-gray-800 flex items-center justify-center" 
                  hoverable
                >
                  <Link to="/support/tickets" className="w-full h-full flex flex-col items-center justify-center p-6">
                    <RightOutlined className="text-green-500 text-3xl mb-3" />
                    <span className="text-white text-lg">View All Tickets</span>
                  </Link>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-900 border-gray-800 mb-6">
                <div className="no-tickets-container">
                  <Empty 
                    description={
                      <span className="text-gray-400">
                        {fetchAttempted 
                          ? "You haven't submitted any support tickets yet."
                          : "Loading your tickets..."}
                      </span>
                    } 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Link to="/support/ticket/new">
                      <Button type="primary" className=" border-0">
                        Create Your First Ticket
                      </Button>
                    </Link>
                  </Empty>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 text-5xl mb-4">
                <FormOutlined />
              </div>
              <h1 className="text-white mb-2 text-3xl">Create Support Ticket</h1>
              <p className="text-gray-400 mb-4">
                Need help with a specific issue? Submit a ticket and our support team will get back to you.
              </p>
              <Link to="/support/ticket/new">
                <Button type="primary" size="large" className=" border-0">
                  Create New Ticket
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-500 text-5xl mb-4">
                <QuestionCircleOutlined />
              </div>
              <h1 className="text-white mb-2 text-3xl">Contact Information</h1>
              <div className="flex flex-col items-center gap-2 text-gray-300 mb-4">
                <div className="flex items-center">
                  <MailOutlined className="mr-2" /> support_koruflicks@brears.xyz
                </div>
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" /> +64 27 269 0900
                </div>
                <div className="flex items-center mt-1">
                  <ClockCircleOutlined className="mr-2" /> 
                  <span>Support Hours: 9 AM - 6 PM (Mon-Fri)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h1 className="text-white mb-2 text-3xl">Frequently Asked Questions</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* FAQ Item */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-medium mb-3">How do I reset my password?</h3>
              <p className="text-gray-400">
                You can reset your password by clicking on "Forgot Password" on the login screen, 
                or by going to Account Settings → Password section after logging in.
              </p>
            </div>
            
            {/* FAQ Item */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-medium mb-3">Why is my video buffering?</h3>
              <p className="text-gray-400">
                Buffering issues are usually caused by internet connection problems. Try 
                checking your internet speed, closing other apps, or lowering the video quality.
              </p>
            </div>
            
            {/* FAQ Item */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-medium mb-3">When will new content be available?</h3>
              <p className="text-gray-400">
                New episodes of shows are typically added once they are added with our third party provider.
              </p>
            </div>
            
            {/* FAQ Item */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white text-lg font-medium mb-3">Coming soon</h3>
              <p className="text-gray-400">
                More frequently asked questions coming soon...
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/support/ticket/new">
              <Button type="primary" size="large" className=" border-0">
                Need more help? Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Extra div to ensure background extends to bottom */}
      <div className="bg-black w-full py-4"></div>
    </div>
  );
};

export default SupportPage;