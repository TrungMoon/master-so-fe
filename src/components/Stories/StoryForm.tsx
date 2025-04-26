import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, message, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAuth } from '../../contexts/AuthContext';
import './StoryForm.less';

const { Title, Text } = Typography;
const { Option } = Select;

interface StoryFormValues {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  image?: File;
}

interface StoryFormProps {
  onSubmit: (values: StoryFormValues) => void;
  initialValues?: StoryFormValues;
  loading?: boolean;
}

// Tiptap Toolbar Component
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      <Button
        type={editor.isActive('bold') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        type={editor.isActive('italic') ? 'primary' : 'default'} 
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Bullet List
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        Ordered List
      </Button>
    </div>
  );
};

const StoryForm: React.FC<StoryFormProps> = ({
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const { user, authToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialValues?.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      formik.setFieldValue('content', html);
    }
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Tiêu đề là bắt buộc')
      .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
      .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
    content: Yup.string()
      .required('Nội dung là bắt buộc')
      .min(100, 'Nội dung phải có ít nhất 100 ký tự'),
    summary: Yup.string()
      .required('Tóm tắt là bắt buộc')
      .min(20, 'Tóm tắt phải có ít nhất 20 ký tự')
      .max(300, 'Tóm tắt không được vượt quá 300 ký tự'),
    tags: Yup.array()
      .of(Yup.string())
      .min(1, 'Vui lòng chọn ít nhất 1 thẻ')
      .max(5, 'Không được chọn quá 5 thẻ'),
  });

  const formik = useFormik<StoryFormValues>({
    initialValues: {
      title: '',
      content: '',
      summary: '',
      tags: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('summary', values.summary);
        values.tags.forEach(tag => {
          formData.append('tags', tag);
        });
        
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
        
        const data = await response.json();
        
        if (response.ok) {
          message.success('Câu chuyện của bạn đã được gửi và đang chờ phê duyệt');
          formik.resetForm();
          setPreviewImage(null);
          editor?.commands.setContent('');
        } else {
          message.error(data.message || 'Đã xảy ra lỗi khi gửi câu chuyện');
        }
      } catch (error) {
        console.error('Error submitting story:', error);
        message.error('Đã xảy ra lỗi khi gửi câu chuyện');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      // Get the uploaded file
      const file = info.file.originFileObj;
      formik.setFieldValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = /image\/(jpeg|jpg|png|gif)/.test(file.type);
      const isSizeValid = file.size / 1024 / 1024 < 2;
      
      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)!');
      }
      
      if (!isSizeValid) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
      }
      
      return isImage && isSizeValid;
    },
    customRequest: ({ onSuccess }: any) => {
      setTimeout(() => {
        onSuccess('ok');
      }, 0);
    },
  };

  // Mock tags for demo
  const availableTags = [
    { id: '1', name: 'Phong Thủy' },
    { id: '2', name: 'Tử Vi' },
    { id: '3', name: 'Nhân Tướng' },
    { id: '4', name: 'Vạn Vật' },
    { id: '5', name: 'Tâm Linh' },
    { id: '6', name: 'Trải Nghiệm' },
    { id: '7', name: 'Thực Hành' },
  ];

  const handleSubmit = (values: any) => {
    // Make sure we're getting editor content
    const formData = {
      ...values,
      content: editor?.getHTML() || '',
      image: fileList[0]?.originFileObj,
    };
    onSubmit(formData);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isImage && isLt5M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setFileList([info.file]);
      return;
    }
    if (info.file.status === 'done') {
      setFileList([info.file]);
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Card className="story-form-card">
      <Title level={2}>Chia sẻ câu chuyện của bạn</Title>
      <Text type="secondary" className="form-subtitle">
        Chia sẻ trải nghiệm, kiến thức và câu chuyện của bạn về Phong Thủy. 
        Bài viết sẽ được kiểm duyệt trước khi xuất bản.
      </Text>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="story-form"
      >
        <Form.Item 
          label="Tiêu đề" 
          validateStatus={formik.touched.title && formik.errors.title ? 'error' : ''}
          help={formik.touched.title && formik.errors.title}
        >
          <Input 
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Nhập tiêu đề câu chuyện"
          />
        </Form.Item>
        
        <Form.Item 
          label="Tóm tắt" 
          validateStatus={formik.touched.summary && formik.errors.summary ? 'error' : ''}
          help={formik.touched.summary && formik.errors.summary}
        >
          <Input.TextArea 
            name="summary"
            value={formik.values.summary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tóm tắt ngắn gọn về câu chuyện của bạn"
            rows={3}
          />
        </Form.Item>
        
        <Form.Item 
          label="Nội dung" 
          validateStatus={formik.touched.content && formik.errors.content ? 'error' : ''}
          help={formik.touched.content && formik.errors.content}
        >
          <div className="tiptap-editor">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} className="editor-content" />
          </div>
        </Form.Item>
        
        <Form.Item 
          label="Thẻ" 
          validateStatus={formik.touched.tags && formik.errors.tags ? 'error' : ''}
          help={formik.touched.tags && formik.errors.tags}
        >
          <Select
            mode="multiple"
            placeholder="Chọn thẻ cho câu chuyện"
            value={formik.values.tags}
            onChange={(values) => formik.setFieldValue('tags', values)}
            onBlur={() => formik.setFieldTouched('tags', true)}
            style={{ width: '100%' }}
          >
            {availableTags.map(tag => (
              <Option key={tag.id} value={tag.id}>{tag.name}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          label="Cover Image"
          className="story-image-upload"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={fileList}
            className="story-image-uploader"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        
        <Form.Item className="submit-button-container">
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            loading={submitting}
            disabled={!user}
            block
          >
            Gửi câu chuyện
          </Button>
          {!user && <Text type="danger">Bạn cần đăng nhập để gửi câu chuyện</Text>}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StoryForm; 