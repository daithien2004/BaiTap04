import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { forgotPasswordApi } from '../util/api';

const { Paragraph } = Typography;

const ForgotPasswordPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email } = values;
    const res = await forgotPasswordApi(email);
    if (res && res.EC === 0) {
      notification.success({ message: 'FORGOT PASSWORD', description: 'Vui lòng kiểm tra email (demo trả token)' });
      if (res.token) {
        notification.info({ message: 'Demo Token', description: res.token });
        // Điều hướng thẳng sang trang đặt lại mật khẩu với token demo
        navigate(`/reset-password?token=${res.token}`);
      }
      form.resetFields();
    } else {
      notification.error({ message: 'FORGOT PASSWORD', description: res?.EM ?? 'Error' });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: '15px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <legend>Quên Mật Khẩu</legend>

          <Paragraph type="secondary">Nhập email để nhận liên kết đặt lại mật khẩu.</Paragraph>

          <Form name="forgot" onFinish={onFinish} autoComplete="off" layout="vertical" form={form}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}> 
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
            </Form.Item>
          </Form>

          <Link to="/login">
            <ArrowLeftOutlined /> Quay lại đăng nhập
          </Link>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;


