import React, { useEffect, useState } from 'react';
import { Card, Typography, InputNumber, Button, Alert, Space, Spin, Select, message } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AuctionDetail: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [auction, setAuction] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState<number | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const [auctionResponse, usersResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/items/${itemId}`),
                    axios.get(`${BASE_URL}/users`)
                ]);

                setAuction(auctionResponse.data);
                setUsers(usersResponse.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch auction or users details.');
                message.error('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAuctionDetails();

        const socketInstance = io(BASE_URL);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket');
            socketInstance.emit('joinAuction', { itemId });
        });

        socketInstance.on('auctionUpdate', (update: any) => {
            console.log('Received update:', update);
            if (update) {
                setAuction((prevAuction: any) => ({
                    ...prevAuction,
                    highestBid: update.highestBid,
                    duration: update.remainingTime,
                }));
            }
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [itemId]);


    useEffect(() => {
        if (!auction?.endTime) return;

        const interval = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000); // Current UNIX time
            const remaining = auction.endTime - currentTime;

            if (remaining <= 0) {
                setAuction((prev: any) => ({ ...prev, duration: 0 }));
                clearInterval(interval);
            } else {
                setAuction((prev: any) => ({ ...prev, duration: remaining }));
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [auction?.endTime]);

    const placeBid = async () => {
        if (!bidAmount || !auction || !selectedUserId) {
            message.error('Please enter a bid amount and select a user.');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/bids`, {
                itemId: Number(itemId),
                userId: selectedUserId,
                bidAmount,
            });
            setAuction({ ...auction, highestBid: bidAmount });
            setBidAmount(null);
            message.success('Bid placed successfully!');
            // navigate('/');
        } catch (error: any) {
            message.error(error.message || 'Error placing bid.');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert message={error} type="error" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Card
                bordered={true}
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    background: '#fafafa',
                }}
            >
                <Title level={3} style={{ marginBottom: '10px' }}>
                    {auction?.name}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                    {auction?.description}
                </Text>
                <div style={{ marginBottom: '20px' }}>
                    <Space direction="vertical" size="small">
                        <Text>
                            <strong>Starting Price:</strong> ${auction?.startingPrice}
                        </Text>
                        <Text>
                            <strong>Current Highest Bid:</strong> ${auction?.highestBid}
                        </Text>
                        <Text>
                            <strong>Minutes Left:</strong>{' '}
                            {auction?.duration > 0 ? `${Math.ceil(auction.duration / 60)} mins` : 'Ended'}
                        </Text>
                    </Space>
                </div>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a user"
                        onChange={(value) => setSelectedUserId(value)}
                    >
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                    <InputNumber
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                        }}
                        min={auction?.highestBid + 1 || auction?.startingPrice || 1}
                        value={bidAmount}
                        onChange={(value) => setBidAmount(value || null)}
                        placeholder="Enter your bid"
                    />
                    <Button
                        type="primary"
                        onClick={placeBid}
                        disabled={!bidAmount || bidAmount <= auction?.highestBid || !selectedUserId}
                        block
                        style={{
                            backgroundColor: '#1890ff',
                            borderRadius: '8px',
                        }}
                    >
                        Place Bid
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default AuctionDetail;
