import React, { useState } from 'react';
import { Form, DatePicker, Button, Card, Alert, Typography, Divider, Row, Col, Statistic } from 'antd';
import { CalculatorOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './style.css';

const { Title, Paragraph, Text } = Typography;

interface CalculationResult {
  canXuong: number;
  tinhLuong: number;
  tangMao: number;
  interpretation: string;
  personalityTraits: string[];
  lifeAdvice: string[];
}

const CanXuongCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: any) => {
    setLoading(true);
    
    // Extract day, month, year from the selected date
    const birthDate = values.birthDate;
    const day = birthDate.date();
    const month = birthDate.month() + 1; // Month is 0-indexed in dayjs
    const year = birthDate.year();
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate Cân Xương
      const canXuong = calculateCanXuong(day, month, year);
      
      // Calculate Tính Lượng
      const tinhLuong = calculateTinhLuong(day, month, year);
      
      // Calculate Tang Mão
      const tangMao = calculateTangMao(day, month, year);
      
      // Generate result interpretation based on the calculations
      const resultData = generateInterpretation(canXuong, tinhLuong, tangMao);
      
      setResult(resultData);
      setLoading(false);
    }, 1500);
  };
  
  // Formula for Cân Xương calculation (simplified for demonstration)
  const calculateCanXuong = (day: number, month: number, year: number): number => {
    // Sum all digits of day, month and year
    const sumDigits = (num: number): number => {
      return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    };
    
    const daySum = sumDigits(day);
    const monthSum = sumDigits(month);
    const yearSum = sumDigits(year);
    
    // Add these sums together
    let result = daySum + monthSum + yearSum;
    
    // If result is greater than 9, reduce to a single digit
    while (result > 9) {
      result = sumDigits(result);
    }
    
    return result;
  };
  
  // Formula for Tính Lượng calculation (simplified for demonstration)
  const calculateTinhLuong = (day: number, month: number, year: number): number => {
    // Different formula for Tính Lượng
    const yearString = year.toString();
    const lastTwoDigits = parseInt(yearString.slice(-2), 10);
    
    let result = (day + month + lastTwoDigits) % 9;
    if (result === 0) result = 9;
    
    return result;
  };
  
  // Formula for Tang Mão calculation (simplified for demonstration)
  const calculateTangMao = (day: number, month: number, year: number): number => {
    // Another formula for Tang Mão
    let result = (day * 2 + month * 3 + year % 100) % 10;
    if (result === 0) result = 10;
    
    return result;
  };
  
  // Generate interpretation based on calculations
  const generateInterpretation = (canXuong: number, tinhLuong: number, tangMao: number): CalculationResult => {
    // This is a simplified interpretation for demonstration
    const interpretations = [
      "Số 1: Người có tính lãnh đạo, độc lập và sáng tạo. Hành Thủy",
      "Số 2: Người hòa đồng, hợp tác và nhạy cảm. Hành Thổ",
      "Số 3: Người lạc quan, vui vẻ và có khả năng giao tiếp tốt. Hành Mộc",
      "Số 4: Người thực tế, đáng tin cậy và làm việc chăm chỉ. Hành Kim",
      "Số 5: Người năng động, thích tự do và thay đổi. Hành Thổ",
      "Số 6: Người có trách nhiệm, yêu thương và hài hòa. Hành Kim",
      "Số 7: Người trí tuệ, sâu sắc và khao khát kiến thức. Hành Thủy",
      "Số 8: Người có tham vọng, quyết đoán và thực tế. Hành Mộc",
      "Số 9: Người nhân ái, lý tưởng và sáng tạo. Hành Hỏa"
    ];
    
    // Personality traits based on Cân Xương
    const personalityTraits = [
      ["Quyết đoán", "Cá tính mạnh", "Sáng tạo", "Kiên trì"],
      ["Nhạy cảm", "Hợp tác", "Chu đáo", "Trung thành"],
      ["Vui vẻ", "Lạc quan", "Giao tiếp tốt", "Giàu trí tưởng tượng"],
      ["Thực tế", "Chăm chỉ", "Đáng tin cậy", "Kỷ luật"],
      ["Linh hoạt", "Thích phiêu lưu", "Thích tự do", "Trực quan"],
      ["Có trách nhiệm", "Yêu thương", "Hài hòa", "Đáng tin cậy"],
      ["Phân tích", "Thích học hỏi", "Nội tâm", "Sâu sắc"],
      ["Có tham vọng", "Tổ chức tốt", "Thực tế", "Quyết đoán"],
      ["Lý tưởng", "Nhân ái", "Rộng lượng", "Giàu cảm xúc"]
    ];
    
    // Life advice based on Tính Lượng
    const lifeAdvice = [
      ["Nên phát triển khả năng lãnh đạo", "Hạn chế áp đặt ý kiến cá nhân", "Cần kiên nhẫn hơn với người khác"],
      ["Nên cân bằng giữa công việc và cảm xúc", "Tránh quá phụ thuộc vào người khác", "Phát huy khả năng đồng cảm"],
      ["Nên tập trung vào một mục tiêu", "Tránh phân tán sức lực", "Phát huy óc sáng tạo"],
      ["Nên linh hoạt hơn trong suy nghĩ", "Tránh quá cứng nhắc", "Dành thời gian cho bản thân"],
      ["Nên ổn định hơn trong cuộc sống", "Tránh thay đổi quá nhiều", "Phát huy tính linh hoạt"],
      ["Nên cân bằng giữa cho và nhận", "Tránh quá hy sinh bản thân", "Học cách từ chối"],
      ["Nên thể hiện cảm xúc nhiều hơn", "Tránh quá khép kín", "Tham gia các hoạt động xã hội"],
      ["Nên cân bằng giữa vật chất và tinh thần", "Tránh quá chú trọng vào thành công", "Dành thời gian cho gia đình"],
      ["Nên thực tế hơn trong mục tiêu", "Tránh quá lý tưởng hóa", "Phát huy lòng trắc ẩn"]
    ];
    
    return {
      canXuong,
      tinhLuong,
      tangMao,
      interpretation: interpretations[canXuong - 1],
      personalityTraits: personalityTraits[canXuong - 1],
      lifeAdvice: lifeAdvice[tinhLuong - 1]
    };
  };

  const resetForm = () => {
    form.resetFields();
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Card className="calculator-form-card">
            <Title level={4}>Nhập thông tin</Title>
            <Form 
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="birthDate"
                label="Ngày tháng năm sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <DatePicker 
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<CalculatorOutlined />}
                  loading={loading}
                  block
                >
                  Tính toán
                </Button>
              </Form.Item>
              
              {result && (
                <Button type="default" onClick={resetForm} block>
                  Nhập lại
                </Button>
              )}
            </Form>
            
            <div className="calculator-note">
              <Alert
                message="Lưu ý"
                description="Kết quả tính toán chỉ mang tính chất tham khảo. Để có kết quả chính xác, vui lòng tham khảo ý kiến của chuyên gia phong thủy."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={14}>
          {result ? (
            <Card className="result-card">
              <Title level={4}>Kết quả tính toán</Title>
              <div className="result-numbers">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Statistic 
                      title="Cân Xương" 
                      value={result.canXuong} 
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Tính Lượng" 
                      value={result.tinhLuong} 
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Tang Mão" 
                      value={result.tangMao} 
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Col>
                </Row>
              </div>
              
              <Divider />
              
              <div className="result-interpretation">
                <Title level={5}>Ý nghĩa Số Cân Xương của bạn</Title>
                <Paragraph>
                  <Text strong>{result.interpretation}</Text>
                </Paragraph>
                
                <Title level={5} className="section-title">Đặc điểm tính cách</Title>
                <ul className="trait-list">
                  {result.personalityTraits.map((trait, idx) => (
                    <li key={idx}>{trait}</li>
                  ))}
                </ul>
                
                <Title level={5} className="section-title">Lời khuyên cuộc sống</Title>
                <ul className="advice-list">
                  {result.lifeAdvice.map((advice, idx) => (
                    <li key={idx}>{advice}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="placeholder-card">
              <div className="placeholder-content">
                <CalculatorOutlined className="placeholder-icon" />
                <Title level={4}>Nhập ngày sinh để xem kết quả</Title>
                <Paragraph>
                  Hệ thống sẽ tính toán và cung cấp phân tích chi tiết về Cân Xương Tính Lượng dựa trên ngày sinh của bạn.
                </Paragraph>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CanXuongCalculator; 