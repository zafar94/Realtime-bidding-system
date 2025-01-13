import React, { useEffect, useState } from 'react';
import { Button, Table, Space } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard: React.FC = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        setAuctions(response.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchAuctions();
  }, []);

  const handleCreateAuction = () => {
    navigate('/create-auction');
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Starting Price',
      dataIndex: 'startingPrice',
      key: 'startingPrice',
    },
    {
      title: 'Highest Bid',
      dataIndex: 'highestBid',
      key: 'highestBid',
    },
    {
      title: 'Time Remaining',
      dataIndex: 'timeRemaining',
      key: 'timeRemaining',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Antique Vase',
      description: 'A beautiful antique vase.',
      startingPrice: '$100',
      highestBid: '$150',
      timeRemaining: '10 minutes',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={handleCreateAuction}>
          Create New Auction
        </Button>
        <Table columns={columns} dataSource={data} />
      </Space>
    </div>
  );
};

export default Dashboard;
