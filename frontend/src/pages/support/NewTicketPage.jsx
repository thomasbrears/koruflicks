import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  message, 
  Card, 
  Alert, 
  Modal, 
  Avatar, 
  Skeleton,
  Typography,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SendOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  MailOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import { submitSupportTicket } from '../../api/ContactAPI';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

// Define max lengths for input fields
const MAX_SUBJECT_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

const NewTicketPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [subjectCount, setSubjectCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  
  // Use the auth hook for user data
  const { user, loading, profileData, getFullName } = useAuth();
  
  const navigate = useNavigate();
  
  // Ticket categories
  const ticketCategories = [
    { value: 'account', label: 'Account Issues' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'playback', label: 'Playback Problems' },
    { value: 'content', label: 'Content Availability' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' },
  ];
  
  // Update form when user data changes
  useEffect(() => {
    if (!loading && user) {
      // Set form values based on user data
      const fullName = getFullName() || user.fullName || user.email.split('@')[0];
      form.setFieldsValue({
        name: fullName,
        email: user.email || ''
      });
    }
  }, [form, user, loading, getFullName]);

  // Handle subject input change to track character count
  const handleSubjectChange = (e) => {
    setSubjectCount(e.target.value.length);
  };

  // Handle description input change to track character count
  const handleDescriptionChange = (e) => {
    setDescriptionCount(e.target.value.length);
  };

  // Form submission handler
  const onFinish = async (values) => {
    setSubmitting(true);
    setError(null);
    setErrorDetails(null);
    
    try {
      // For authenticated users, ensure name and email are properly set
      let submissionData = { ...values };
      
      if (user) {
        // Use the full name from useAuth hook
        const fullName = getFullName() || user.fullName || user.email.split('@')[0];
        
        submissionData = {
          ...submissionData,
          userId: user.uid,
          name: fullName,
          email: user.email
        };
      }
      
      const validationErrors = [];
      
      if (!submissionData.name) validationErrors.push('Name is required');
      if (!submissionData.email) validationErrors.push('Email is required');
      else if (!/\S+@\S+\.\S+/.test(submissionData.email)) validationErrors.push('Email format is invalid');
      
      if (!submissionData.subject) validationErrors.push('Subject is required');
      else if (submissionData.subject.length > MAX_SUBJECT_LENGTH) 
        validationErrors.push(`Subject exceeds maximum length of ${MAX_SUBJECT_LENGTH} characters`);
      
      if (!submissionData.category) validationErrors.push('Category selection is required');
      
      if (!submissionData.description) validationErrors.push('Description is required');
      else if (submissionData.description.length > MAX_DESCRIPTION_LENGTH) 
        validationErrors.push(`Description exceeds maximum length of ${MAX_DESCRIPTION_LENGTH} characters`);
      
      if (validationErrors.length > 0) {
        setError('Please correct the following errors:');
        setErrorDetails(validationErrors);
        message.error('Please fill in all required fields correctly');
        setSubmitting(false);
        return;
      }
      
      // Submit to API
      const response = await submitSupportTicket(submissionData);
            
      // Show success message and store ticket number
      setTicketNumber(response.ticketNumber);
      setSuccessModalVisible(true);
      
      // Reset form and counters
      form.resetFields();
      setSubjectCount(0);
      setDescriptionCount(0);
      
    } catch (error) {
      console.error('Error submitting ticket:', error);
      
      // Handle different types of errors with specific messages
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorDetailsList = [];
      
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        if (statusCode === 400) {
          errorMessage = 'Invalid data submitted. Please check your form.';
          
          // Extract specific field errors if available in response
          if (responseData && responseData.errors) {
            errorDetailsList = Object.entries(responseData.errors).map(
              ([field, msg]) => `${field}: ${msg}`
            );
          }
        } else if (statusCode === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (statusCode === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (statusCode >= 500) {
          errorMessage = 'Server error. Our team has been notified.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      if (errorDetailsList.length > 0) {
        setErrorDetails(errorDetailsList);
      }
      
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle success modal close
  const handleModalClose = () => {
    setSuccessModalVisible(false);
    navigate('/support');
  };
  
  // Get display name from multiple sources
  const getDisplayName = () => {
    if (profileData && (profileData.firstName || profileData.lastName)) {
      return `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
    }
    return user ? (user.fullName || user.email) : '';
  };
  
  const isLoggedIn = !!user;
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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
          
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <h1 className="text-white mb-2 text-3xl text-center">
              Submit a Support Ticket
            </h1>
            
            <p className="text-gray-400 mb-8 text-center">
              Please fill out the form below with details about your issue. 
              Our team will respond as soon as possible.
            </p>
            
            {/* Loading state with Skeleton loaders */}
            {loading && (
              <div className="py-6">
                <Skeleton.Avatar 
                  active 
                  size={48} 
                  className="mb-4"
                  style={{ backgroundColor: '#333' }}
                />
                <Skeleton 
                  active 
                  paragraph={{ rows: 1 }} 
                  className="mb-6" 
                  style={{ backgroundColor: '#333' }}
                />
                <Skeleton 
                  active 
                  paragraph={{ rows: 4 }} 
                  style={{ backgroundColor: '#333' }}
                />
              </div>
            )}
            
            {/* Error message with details */}
            {error && (
              <Alert
                message={error}
                description={
                  errorDetails ? (
                    <ul className="list-disc pl-5 mt-2">
                      {errorDetails.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  ) : null
                }
                type="error"
                showIcon
                className="mb-6"
              />
            )}
            
            {/* User Information Card (when logged in) */}
            {!loading && isLoggedIn && (
              <div className="mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <Avatar 
                        size={48} 
                        src={user.photoURL} 
                        icon={!user.photoURL && <UserOutlined />}
                        className="bg-green-500"
                      />
                      <div className="ml-4">
                        <h3 className="text-white text-lg">
                          {getDisplayName()}
                        </h3>
                        <div className="flex items-center text-gray-400">
                          <MailOutlined className="mr-2" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {!loading && (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="support-form"
                requiredMark={false}
              >
                {/* Only show name/email fields if not logged in */}
                {!isLoggedIn && (
                  <>
                    <Form.Item
                      label={<span className="text-gray-300">Name</span>}
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input 
                        placeholder="Your full name" 
                        className="dark-input"
                        maxLength={50}
                        suffix={
                          <Tooltip title="Your full name is required for us to address you properly">
                            <InfoCircleOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />
                          </Tooltip>
                        }
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label={<span className="text-gray-300">Email</span>}
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                      extra={
                        <Text className="text-gray-500">
                          We'll send ticket updates to this email address.
                        </Text>
                      }
                    >
                      <Input 
                        placeholder="Your email address" 
                        className="dark-input"
                      />
                    </Form.Item>
                  </>
                )}
                
                {/* Hidden form fields for logged-in user info */}
                {isLoggedIn && (
                  <>
                    <Form.Item
                      name="name"
                      initialValue={getFullName() || user?.fullName || user?.email?.split('@')[0] || ''}
                      noStyle
                    >
                      <Input type="hidden" />
                    </Form.Item>
                    
                    <Form.Item
                      name="email"
                      initialValue={user?.email || ''}
                      noStyle
                    >
                      <Input type="hidden" />
                    </Form.Item>
                  </>
                )}
                
                <Form.Item
                  label={<span className="text-gray-300">Category</span>}
                  name="category"
                  rules={[{ required: true, message: 'Please select a category' }]}
                  tooltip="Select the category that best describes your issue"
                >
                  <Select 
                    placeholder="Select issue category" 
                    className="dark-select"
                    popupClassName="dark-select-dropdown"
                    dropdownStyle={{ backgroundColor: '#1F2937', color: 'white' }}
                  >
                    {ticketCategories.map(cat => (
                      <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label={
                    <div className="flex justify-between w-full">
                      <span className="text-gray-300">Subject</span>
                      <span className="text-gray-500 text-sm">
                        {subjectCount}/{MAX_SUBJECT_LENGTH}
                      </span>
                    </div>
                  }
                  name="subject"
                  rules={[
                    { required: true, message: 'Please enter a subject' },
                    { max: MAX_SUBJECT_LENGTH, message: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters` }
                  ]}
                >
                  <Input 
                    placeholder="Brief description of your issue" 
                    className="dark-input"
                    maxLength={MAX_SUBJECT_LENGTH}
                    onChange={handleSubjectChange}
                    showCount={false}
                  />
                </Form.Item>
                
                <Form.Item
                  label={
                    <div className="flex justify-between w-full">
                      <span className="text-gray-300">Description</span>
                      <span className="text-gray-500 text-sm">
                        {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                  }
                  name="description"
                  rules={[
                    { required: true, message: 'Please describe your issue' },
                    { max: MAX_DESCRIPTION_LENGTH, message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters` }
                  ]}
                  tooltip="Be as specific as possible to help us resolve your issue quickly"
                >
                  <TextArea 
                    rows={6} 
                    placeholder="Please provide as much detail as possible about the issue you're experiencing"
                    className="dark-textarea resize-none"
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={handleDescriptionChange}
                    showCount={false}
                  />
                </Form.Item>
                
                <Form.Item className="text-center mt-8">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    icon={<SendOutlined />}
                    className=" border-0 min-w-[200px]"
                    size="large"
                  >
                    Submit Ticket
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </div>
      </div>
      
      {/* Success Modal */}
      <Modal
        title={<span className="text-white font-medium">Ticket Submitted Successfully</span>}
        open={successModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button 
            key="view" 
            type="primary" 
            onClick={() => {
              setSuccessModalVisible(false);
              navigate('/support/tickets');
            }}
            className=" border-0 mr-2"
          >
            View My Tickets
          </Button>,
          <Button 
            key="back" 
            onClick={handleModalClose}
            className="bg-gray-800 border-gray-700 text-white"
          >
            Back to Support
          </Button>
        ]}
        centered
        closable={true}
        className="success-modal"
      >
        <div className="text-center py-4">
          <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
          <h3 className="text-white text-lg mb-2">Your ticket has been submitted</h3>
          <p className="text-gray-400 mb-4">
            We've received your support request and will respond as soon as possible.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-300">Ticket Number: <span className="text-green-500 font-medium">{ticketNumber}</span></p>
            <p className="text-gray-400 text-sm">Please save this number for your reference.</p>
          </div>
          <p className="text-gray-400">
            You'll receive a confirmation email with the details of your support request sortly.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default NewTicketPage;