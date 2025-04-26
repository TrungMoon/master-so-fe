import React from 'react';
import StoryModerationComponent from '../../../components/Admin/StoryModeration';
import { Typography } from 'antd';

const { Title } = Typography;

const StoryModerationPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Quản lý bài viết</Title>
      <StoryModerationComponent />
    </div>
  );
};

export default StoryModerationPage; 