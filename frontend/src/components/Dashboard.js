import React, { useEffect, useState } from 'react';
import { Table, Button, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Dashboard = () => {
    const [auctions, setAuctions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            const response = await axios.get('/items');
            setAuctions(response.data);
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
            render: (price) => `$${price}`,
        },
        {
            title: 'Current Highest Bid',
            dataIndex: 'highestBid',
            key: 'highestBid',
            render: (bid) => `$${bid}`,
        },
        {
            title: 'Time Left',
            dataIndex: 'auctionEndTime',
            key: 'auctionEndTime',
            render: (endTime) => {
                const timeLeft = new Date(endTime) - new Date();
                const minutes = Math.floor(timeLeft / 1000 / 60);
                return minutes > 0 ? `${minutes} mins` : 'Ended';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
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
