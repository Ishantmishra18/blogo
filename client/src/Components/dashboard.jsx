import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'antd'; 
import api from '../utils/api';

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's upload history
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await api.post('/post' , {uploads}); // that's how the to send req to backend firstly you need to upload the api from utils/api
        setUploads(res.data);
      } catch (err) {
        console.error('Failed to fetch uploads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  const columns = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Upload Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleView(record._id)}
        >
          View Charts
        </Button>
      ),
    },
  ];

  const handleView = (uploadId) => {
    // Navigate to chart view (implement with React Router)
    console.log('View upload:', uploadId);
  };

  return (
    <div className="dashboard">
      <h2>Your Upload History</h2>
      <Table 
        columns={columns} 
        dataSource={uploads} 
        loading={loading} 
        rowKey="_id" 
      />
    </div>
  );
};

export default Dashboard;