import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Table, 
  Tag, 
  Space, 
  Empty, 
  Skeleton, 
  message,
  Tooltip,
  Modal,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  WarningOutlined,
  UserOutlined,
  MailOutlined,
  TagOutlined,
  RightCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { getCurrentUserTickets } from '../../api/ContactAPI';
import '../../style/Support.css';

const TicketsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch user tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userTickets = await getCurrentUserTickets();
        setTickets(userTickets || []);
        
        // Check if there's a ticket ID in the state (from navigation)
        if (location.state && location.state.selectedTicketId) {
          const ticketToShow = userTickets.find(t => t.id === location.state.selectedTicketId);
          if (ticketToShow) {
            setSelectedTicket(ticketToShow);
            setModalVisible(true);
            
            // Clear the state to prevent reopening on page refresh
            window.history.replaceState({}, document.title);
          }
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load your tickets. Please try again.');
        message.error('Could not retrieve your support tickets');
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading && user) {
      fetchTickets();
    } else if (!authLoading && !user) {
      navigate('/login', { state: { from: '/support/tickets' } });
    }
  }, [user, authLoading, navigate, location.state]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };
  
  // Get status color for tags
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
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'normal':
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };
  
  // Format category for display
  const formatCategory = (category) => {
    if (!category) return 'N/A';
    
    const displayText = category.charAt(0).toUpperCase() + category.slice(1);
    if (displayText === 'Account') return 'Account Issues';
    if (displayText === 'Billing') return 'Billing & Payments';
    if (displayText === 'Playback') return 'Playback Problems';
    if (displayText === 'Content') return 'Content Availability';
    if (displayText === 'Technical') return 'Technical Support';
    return displayText;
  };
  
  // Handle ticket click to show details modal
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };
  
  // Close details modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  // Define table columns
  const columns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (text) => (
        <span className="text-green-500">{text}</span>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text, record) => (
        <div 
          className="flex items-center cursor-pointer hover:text-green-400"
          onClick={() => handleTicketClick(record)}
        >
          <FileTextOutlined className="mr-2 text-green-500" />
          <span className="text-white">
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const displayText = formatCategory(category);
        return <span className="text-gray-300">{displayText}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} className="uppercase">
          {status || 'Unknown'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Tooltip title={formatDate(date)}>
          <div className="flex items-center text-gray-400">
            <ClockCircleOutlined className="mr-2" />
            <span>{date ? new Date(date).toLocaleDateString() : 'N/A'}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            size="small" 
            className="text-green-500 hover:text-green-400"
            onClick={() => handleTicketClick(record)}
            icon={<RightCircleOutlined />}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  // Ticket card component for mobile view
  const TicketCard = ({ ticket }) => (
    <Card 
      key={ticket.id}
      className="bg-gray-800 border-gray-700 mb-4 hover:border-green-500 cursor-pointer transition-all"
      onClick={() => handleTicketClick(ticket)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center mb-2">
            <FileTextOutlined className="text-green-500 mr-2" />
            <span className="text-white font-medium">{ticket.subject}</span>
          </div>
          <div className="text-green-500 text-sm">
            Ticket #{ticket.ticketNumber}
          </div>
        </div>
        <Tag color={getStatusColor(ticket.status)} className="uppercase">
          {ticket.status || 'Unknown'}
        </Tag>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <div className="text-gray-400">Category:</div>
          <div className="text-white">{formatCategory(ticket.category)}</div>
        </div>
        <div>
          <div className="text-gray-400">Created:</div>
          <div className="text-white flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </div>
      
      <Button 
        type="text" 
        size="small" 
        className="text-green-500 hover:text-green-400 p-0"
        onClick={(e) => {
          e.stopPropagation();
          handleTicketClick(ticket);
        }}
        icon={<RightCircleOutlined />}
      >
        View Details
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back navigation */}
          <Link to="/support">
            <Button 
              type="text" 
              className="text-gray-400 hover:text-white mb-6 flex items-center" 
              icon={<ArrowLeftOutlined />}
            >
              Back to Support
            </Button>
          </Link>
          
          <Card className="bg-gray-900 border-gray-800 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-white text-2xl m-0 mb-4 md:mb-0">My Support Tickets</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/support/ticket/new">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    className=" border-0"
                  >
                    Create New Ticket
                  </Button>
                </Link>
                {loading ? null : (
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => {
                      setLoading(true);
                      getCurrentUserTickets()
                        .then(data => {
                          setTickets(data || []);
                          setLoading(false);
                        })
                        .catch(err => {
                          console.error(err);
                          setError('Failed to refresh tickets');
                          setLoading(false);
                          message.error('Failed to refresh tickets');
                        });
                    }}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Refresh
                  </Button>
                )}
              </div>
            </div>
            
            {authLoading ? (
              <div className="py-6">
                <Skeleton active paragraph={{ rows: 8 }} />
              </div>
            ) : loading ? (
              <div className="py-6">
                <Skeleton active paragraph={{ rows: 8 }} />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <WarningOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                <div className="text-gray-400 mb-4">{error}</div>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setLoading(true);
                    getCurrentUserTickets()
                      .then(data => {
                        setTickets(data || []);
                        setLoading(false);
                      })
                      .catch(err => {
                        console.error(err);
                        setError('Failed to refresh tickets');
                        setLoading(false);
                      });
                  }}
                  className="border-0"
                >
                  Try Again
                </Button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-10">
                <Empty 
                  description={<span className="text-gray-400">You haven't submitted any support tickets yet.</span>} 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Link to="/support/ticket/new" className="mt-4 inline-block">
                  <Button type="primary" className="bg-green-500 hover:bg-green-600 border-0">
                    Create Your First Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop view: Table */}
                <div className="hidden md:block">
                  <Table 
                    columns={columns} 
                    dataSource={tickets.map(ticket => ({ ...ticket, key: ticket.id }))}
                    pagination={{ 
                      pageSize: 10,
                      position: ['bottomCenter'],
                      showSizeChanger: false,
                      showQuickJumper: true,
                      className: 'custom-dark-pagination'
                    }}
                    className="tickets-table"
                    scroll={{ x: 800 }}
                    onRow={(record) => ({
                      onClick: () => handleTicketClick(record)
                    })}
                  />
                </div>
                
                {/* Mobile view: Cards */}
                <div className="md:hidden">
                  {tickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </>
            )}
          </Card>
          
          {tickets.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-white text-lg font-medium mb-3">Need More Help?</h3>
              <p className="text-gray-400 mb-4">
                If you need to ask about a different issue or require further assistance, 
                please create a new ticket for better tracking and faster resolution.
              </p>
              <Link to="/support/ticket/new">
                <Button type="primary" className="bg-green-500 hover:bg-green-600 border-0">
                  Create New Ticket
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Ticket Details Modal */}
      <Modal
        title={<span className="text-white">Ticket Details</span>}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button 
            key="close" 
            onClick={handleCloseModal}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            Close
          </Button>
        ]}
        width={700}
        className="dark-modal"
        centered
      >
        {selectedTicket && (
          <div className="ticket-details text-white">
            <div className="ticket-header mb-4">
              <h3 className="text-white text-xl mb-4">{selectedTicket.subject}</h3>
              <div className="flex items-center text-gray-400">
                <FileTextOutlined className="mr-2" />
                <span className="mr-2">Ticket #{selectedTicket.ticketNumber}</span>
                <ClockCircleOutlined className="mx-2" />
                <span>{formatDate(selectedTicket.createdAt)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <UserOutlined className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-400 text-sm m-0">Submitted by</p>
                  <p className="text-white m-0">{selectedTicket.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MailOutlined className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-400 text-sm m-0">Email</p>
                  <p className="text-white m-0">{selectedTicket.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <TagOutlined className="text-gray-400 mr-2" />
                <div>
                  <p className="text-gray-400 text-sm m-0">Category</p>
                  <p className="text-white m-0">{formatCategory(selectedTicket.category)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2">
                  <p className="text-gray-400 text-sm m-0">Status</p>
                  <Tag color={getStatusColor(selectedTicket.status)} className="uppercase">
                    {selectedTicket.status}
                  </Tag>
                </div>
                <div>
                  <p className="text-gray-400 text-sm m-0">Priority</p>
                  <Tag color={getPriorityColor(selectedTicket.priority)} className="uppercase">
                    {selectedTicket.priority || 'Normal'}
                  </Tag>
                </div>
              </div>
            </div>
            
            <Divider className="bg-gray-800 my-3" />
            
            <div className="mb-4">
              <h4 className="text-white text-lg mb-2">Description</h4>
              <p className="text-gray-300 whitespace-pre-line bg-gray-800 p-4 rounded-lg">
                {selectedTicket.description}
              </p>
            </div>
            
            <Divider className="bg-gray-800 my-3" />
            
            <div className="info-box bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white mb-2">Ticket Updates</h4>
              <p className="text-gray-300 m-0">
                <InfoCircleOutlined className="mr-2" /> 
                Any updates to this ticket will be sent to your email address. 
                Please respond to those emails to continue the conversation with our support team.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketsPage;