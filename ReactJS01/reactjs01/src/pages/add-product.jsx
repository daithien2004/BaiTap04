import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Select, message } from 'antd';
import { createProductApi, getCategoriesApi } from '../util/api';

const AddProductPage = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await getCategoriesApi();
      setCategories(res || []);
    };
    fetch();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await createProductApi({
      name: values.name,
      price: values.price,
      thumbnail: values.thumbnail,
      category: values.category, // slug
    });
    setLoading(false);
    if (res?.EC === 0) {
      message.success('Tạo sản phẩm thành công');
      form.resetFields();
    } else {
      message.error(res?.EM || 'Tạo sản phẩm thất bại');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <Card title="Thêm sản phẩm">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* Slug sẽ tự sinh từ tên, không cần nhập */}
          <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="Ảnh (URL)" name="thumbnail">
            <Input />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories.map((c) => ({
                value: c.slug,
                label: c.name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductPage;
