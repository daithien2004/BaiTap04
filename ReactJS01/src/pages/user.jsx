import { notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';

const UserPage = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserApi();
      if (res && Array.isArray(res.DT)) {
        setDataSource(res.DT);
      } else if (!res?.message && Array.isArray(res)) {
        setDataSource(res);
      } else {
        notification.error({
          message: 'Unauthorized',
          description: res.message,
        });
      }
    };

    fetchUser();
  }, []);

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table dataSource={dataSource} columns={columns} rowKey="_id" bordered />
    </div>
  );
};

export default UserPage;
