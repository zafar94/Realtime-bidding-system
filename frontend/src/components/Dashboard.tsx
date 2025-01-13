import React, { useEffect, useState } from 'react';
import { Table, Button, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type AuctionItem = {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  highestBid: number;
  auctionEndTime: string;
};

const { Title } = Typography;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get<AuctionItem[]>(`${BASE_URL}/items`);
        setAuctions(response.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchAuctions();
  }, []);

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
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Current Highest Bid',
      dataIndex: 'highestBid',
      key: 'highestBid',
      render: (bid: number) => `$${bid}`,
    },
    {
      title: 'Time Left',
      dataIndex: 'auctionEndTime',
      key: 'auctionEndTime',
      render: (endTime: string) => {
        const timeLeft = new Date(endTime).getTime() - new Date().getTime();
        const minutes = Math.floor(timeLeft / 1000 / 60);
        return minutes > 0 ? `${minutes} mins` : 'Ended';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AuctionItem) => (
        <Button type="primary" onClick={() => navigate(`/auction/${record.id}`)}>
          View Auction
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Live Auctions</Title>
      <Table
        dataSource={auctions}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Dashboard;
