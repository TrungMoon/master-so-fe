import React, { useEffect, useState, useContext } from 'react';
import { 
  Table, 
  Badge, 
  Button, 
  Tag, 
  Card, 
  Drawer, 
  Space, 
  Tabs, 
  message, 
  Modal, 
  Input, 
  Typography 
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './StoryModeration.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  tags: string[];
  imageUrl?: string;
  rejectionReason?: string;
}

const StoryModeration: React.FC = () => {
  const { authToken } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);

  const contentEditor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: selectedStory?.content || '',
    editable: false,
  });

  useEffect(() => {
    if (selectedStory) {
      contentEditor?.commands.setContent(selectedStory.content);
    }
  }, [selectedStory, contentEditor]);

  useEffect(() => {
    fetchStories(activeTab);
  }, [activeTab]);

  const fetchStories = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stories?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      message.error('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const showStoryDetails = (story: Story) => {
    setSelectedStory(story);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedStory(null);
  };

  const showRejectionModal = (story: Story) => {
    setSelectedStory(story);
    setRejectionReason('');
    setRejectionModalVisible(true);
  };

  const handleReject = async () => {
    if (!selectedStory || !rejectionReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch(`/api/admin/stories/${selectedStory.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ rejectionReason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject story');
      }

      message.success('Story has been rejected');
      setRejectionModalVisible(false);
      
      // Update the stories list
      setStories(stories.filter(s => s.id !== selectedStory.id));
      if (drawerVisible) {
        closeDrawer();
      }
    } catch (error) {
      console.error('Error rejecting story:', error);
      message.error('Failed to reject story. Please try again.');
    }
  };

  const handleApprove = (storyId: string) => {
    Modal.confirm({
      title: 'Approve Story',
      content: 'Are you sure you want to approve this story? It will be published immediately.',
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/stories/${storyId}/approve`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to approve story');
          }

          message.success('Story has been approved and published');
          
          // Update the stories list
          setStories(stories.filter(s => s.id !== storyId));
          if (drawerVisible && selectedStory?.id === storyId) {
            closeDrawer();
          }
        } catch (error) {
          console.error('Error approving story:', error);
          message.error('Failed to approve story. Please try again.');
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge status="processing" text="Pending Review" />;
      case 'approved':
        return <Badge status="success" text="Approved" />;
      case 'rejected':
        return <Badge status="error" text="Rejected" />;
      default:
        return <Badge status="default" text="Unknown" />;
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Story) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showStoryDetails(record)}
            title="View Details"
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
                title="Approve Story"
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />}
                onClick={() => showRejectionModal(record)}
                title="Reject Story"
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="story-moderation-container">
      <Card className="story-moderation-card">
        <Title level={2}>Story Moderation</Title>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Pending Review" key="pending" />
          <TabPane tab="Approved" key="approved" />
          <TabPane tab="Rejected" key="rejected" />
        </Tabs>
        
        <Table 
          dataSource={stories} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={selectedStory?.title}
        placement="right"
        closable={true}
        onClose={closeDrawer}
        visible={drawerVisible}
        width={600}
      >
        {selectedStory && (
          <div className="story-details">
            <div className="story-meta">
              <Text type="secondary">Author: {selectedStory.authorName}</Text>
              <br />
              <Text type="secondary">Created: {new Date(selectedStory.createdAt).toLocaleString()}</Text>
              <br />
              <Text type="secondary">Status: {getStatusBadge(selectedStory.status)}</Text>
              <div className="story-tags">
                {selectedStory.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </div>
            </div>
            
            {selectedStory.imageUrl && (
              <div className="story-image">
                <img src={selectedStory.imageUrl} alt={selectedStory.title} />
              </div>
            )}
            
            <div className="story-summary">
              <Title level={4}>Summary</Title>
              <Text>{selectedStory.summary}</Text>
            </div>
            
            <div className="story-content">
              <Title level={4}>Content</Title>
              <div className="tiptap-editor">
                <EditorContent editor={contentEditor} className="editor-content" />
              </div>
            </div>
            
            {selectedStory.status === 'rejected' && selectedStory.rejectionReason && (
              <div className="rejection-reason">
                <Title level={4}>Rejection Reason</Title>
                <Text type="danger">{selectedStory.rejectionReason}</Text>
              </div>
            )}
            
            {selectedStory.status === 'pending' && (
              <div className="action-buttons">
                <Space>
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />}
                    onClick={() => handleApprove(selectedStory.id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    danger 
                    icon={<CloseOutlined />}
                    onClick={() => showRejectionModal(selectedStory)}
                  >
                    Reject
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        title="Reject Story"
        visible={rejectionModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectionModalVisible(false)}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <p>Please provide a reason for rejecting this story:</p>
        <TextArea 
          rows={4} 
          value={rejectionReason} 
          onChange={e => setRejectionReason(e.target.value)}
          placeholder="This story is being rejected because..."
        />
      </Modal>
    </div>
  );
};

export default StoryModeration; 