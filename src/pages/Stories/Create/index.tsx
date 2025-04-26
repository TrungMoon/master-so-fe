import React, { useState } from 'react';
import { Card, Typography, Row, Col, Breadcrumb, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { StoryForm } from '../../../components/Stories';
import { useAuth } from '../../../contexts/AuthContext';
import './style.css';

const { Title, Text } = Typography;

interface StoryFormValues {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  image?: File;
}

const CreateStory: React.FC = () => {
  const { authToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: StoryFormValues) => {
    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('summary', values.summary);
      
      if (values.tags) {
        values.tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }
      
      if (values.image) {
        formData.append('image', values.image);
      }
      
      // Submit to API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        message.success('Câu chuyện của bạn đã được gửi và đang chờ phê duyệt');
        // Redirect back to stories list after successful submission
        navigate('/stories');
      } else {
        const data = await response.json();
        message.error(data.message || 'Đã xảy ra lỗi khi gửi câu chuyện');
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      message.error('Đã xảy ra lỗi khi gửi câu chuyện');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-story-container">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Trang chủ
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/stories">
            <FileTextOutlined /> Chuyện Linh Tinh
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Tạo câu chuyện mới</Breadcrumb.Item>
      </Breadcrumb>

      <Row justify="center">
        <Col xs={24} sm={24} md={20} lg={18}>
          <StoryForm 
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CreateStory; 