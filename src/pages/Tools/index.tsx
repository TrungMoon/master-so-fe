import React, { useState } from 'react';
import { Typography, Card, Tabs, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import CanXuongCalculator from '../../components/Calculator/CanXuongCalculator';
import './style.css';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('canxuong');

  return (
    <div className="tools-page">
      <div className="tools-header">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Công cụ</Breadcrumb.Item>
        </Breadcrumb>
        
        <Title level={2}>Công Cụ Tính Tướng Số</Title>
        <Paragraph className="subtitle">
          Các công cụ giúp bạn tính toán và khám phá vận mệnh, tướng số dựa trên các phương pháp cổ truyền
        </Paragraph>
      </div>

      <Card className="tools-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          size="large"
          className="custom-tabs"
        >
          <TabPane tab="Cân Xương Tính Lượng" key="canxuong">
            <div className="tab-content">
              <div className="tab-intro">
                <Title level={3}>Cân Xương Tính Lượng</Title>
                <Paragraph>
                  Cân Xương Tính Lượng là phương pháp tính toán dựa trên ngày tháng năm sinh 
                  để đoán vận mệnh và tính cách của con người. Nhập thông tin ngày sinh của bạn 
                  và khám phá những điều thú vị về cuộc đời của bạn.
                </Paragraph>
              </div>
              
              <CanXuongCalculator />
            </div>
          </TabPane>
          
          <TabPane tab="Chọn Ngày Tốt" key="chonngay">
            <div className="tab-content">
              <div className="tab-intro">
                <Title level={3}>Chọn Ngày Tốt</Title>
                <Paragraph>
                  Tính toán và chọn lựa ngày tốt cho các sự kiện quan trọng như cưới hỏi, 
                  khai trương, động thổ, nhập trạch, xuất hành dựa trên các yếu tố phong thủy.
                </Paragraph>
              </div>
              
              <Card className="coming-soon">
                <Title level={4}>Tính năng đang phát triển</Title>
                <Paragraph>
                  Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau!
                </Paragraph>
              </Card>
            </div>
          </TabPane>
          
          <TabPane tab="Tử Vi Hàng Ngày" key="tuvi">
            <div className="tab-content">
              <div className="tab-intro">
                <Title level={3}>Tử Vi Hàng Ngày</Title>
                <Paragraph>
                  Xem tử vi hàng ngày theo cung mệnh và ngày sinh của bạn. 
                  Nhận lời khuyên và dự đoán về vận may, sự nghiệp, tình duyên và sức khỏe.
                </Paragraph>
              </div>
              
              <Card className="coming-soon">
                <Title level={4}>Tính năng đang phát triển</Title>
                <Paragraph>
                  Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau!
                </Paragraph>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Tools; 