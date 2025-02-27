import React, { useEffect, useState } from 'react';
import { Button, Table, Space, message, Typography, Tag } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

const { Title } = Typography;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard: React.FC = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/items`);
        const auctionData = response.data.map((item: any) => ({
          ...item,
          duration: item.endTime - Math.floor(Date.now() / 1000),
        }));
        setAuctions(auctionData);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        message.error('Failed to load auctions.');
      }
    };

    fetchAuctions();

    const socketInstance = io(BASE_URL);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('auctionUpdate', (update: any) => {
      console.log('Received update:', update);
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) =>
          auction.id === update.itemId
            ? {
              ...auction,
              highestBid: update.highestBid,
              duration: update.remainingTime,
            }
            : auction
        )
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) => {
          if (auction.duration > 0) {
            return { ...auction, duration: auction.duration - 1 };
          }
          return { ...auction, duration: 0 };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  const handleCreateAuction = () => {
    navigate('/create-auction');
  };

  const navigatePlaceBid = (id: number) => {
    navigate('/auction/' + id);
  };

  const calculateRemainingTime = (endTime: number | null) => {
    if (!endTime) return 'Auction Ended';

    const currentTime = Date.now();
    const timeDiff = endTime - currentTime;

    if (timeDiff <= 0) return 'Auction Ended';

    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);

    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Starting Price',
      dataIndex: 'startingPrice',
      key: 'startingPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Highest Bid',
      dataIndex: 'highestBid',
      key: 'highestBid',
      render: (bid: number) => (
        <span style={{ fontWeight: 'bold', color: '#3f8600' }}>${bid.toFixed(2)}</span>
      ),
    },
    {
      title: 'Time Remaining',
      key: 'duration',
      render: (_: any, record: any) => {
        console.log('Record:', record);
        const currentTime = Date.now();
        const endTime = record.endTime;
        const timeDiff = endTime - currentTime;
        let color = '#3f8600';

        if (timeDiff <= 0) {
          color = '#ff4d4f';
        }

        return (
          <span style={{ color: color }}>
            {calculateRemainingTime(endTime)}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => navigatePlaceBid(record.id)}>
          Place Bid
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Auction Dashboard
      </Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={handleCreateAuction} style={{ marginBottom: '20px' }}>
          Create New Auction
        </Button>
        <Table
          columns={columns}
          dataSource={auctions}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </div>
  );
};

export default Dashboard;
