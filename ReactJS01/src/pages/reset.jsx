import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { resetPasswordApi } from '../util/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const onFinish = async (values) => {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      notification.error({ message: 'RESET PASSWORD', description: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    const res = await resetPasswordApi(token, password);
    if (res && res.EC === 0) {
      notification.success({ message: 'RESET PASSWORD', description: 'Đổi mật khẩu thành công' });
      navigate('/login');
    } else {
      notification.error({ message: 'RESET PASSWORD', description: res?.EM ?? 'Error' });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: '15px', margin: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <legend>Đặt Lại Mật Khẩu</legend>

          <Form name="reset" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item label="Mật khẩu mới" name="password" rules={[{ required: true, message: 'Nhập mật khẩu mới!' }]}> 
              <Input.Password />
            </Form.Item>

            <Form.Item label="Xác nhận mật khẩu" name="confirmPassword" rules={[{ required: true, message: 'Xác nhận mật khẩu!' }]}> 
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
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

export default ResetPasswordPage;


