import { Card, Form, Input, Button, message } from 'antd';
import { createCategoryApi } from '../util/api';

const AddCategoryPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await createCategoryApi(values);
    if (res?.EC === 0) {
      message.success('Tạo danh mục thành công');
      form.resetFields();
    } else {
      message.error(res?.EM || 'Tạo danh mục thất bại');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <Card title="Thêm danh mục">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* Slug sẽ tự sinh từ tên, không cần nhập */}
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategoryPage;


