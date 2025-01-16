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
    const [remainingTime, setRemainingTime] = useState<string>('Calculating...');

    const calculateRemainingTime = (endTime: number | null) => {
        if (!endTime) return 'Auction Ended';

        const currentTime = Date.now();
        const timeDiff = endTime - currentTime;

        if (timeDiff <= 0) return 'Auction Ended';

        const minutes = Math.floor(timeDiff / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);

        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    };

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
                if (auctionResponse.data?.endTime) {
                    setRemainingTime(calculateRemainingTime(auctionResponse.data.endTime));
                }
            } catch (err) {
                setError('Failed to fetch auction details.');
                message.error('Failed to fetch auction details.');
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
            console.log('Received real-time update:', update);
            if (update) {
                setAuction((prevAuction: any) => ({
                    ...prevAuction,
                    highestBid: update.highestBid,
                    endTime: update.endTime,
                }));
                if (update.endTime) {
                    setRemainingTime(calculateRemainingTime(update.endTime));
                }
            }
        });

        const interval = setInterval(() => {
            if (auction?.endTime) {
                setRemainingTime(calculateRemainingTime(auction.endTime));
            }
        }, 10000);

        return () => {
            socketInstance.disconnect();
            clearInterval(interval);
        };
    }, [itemId, auction?.endTime]);

    const placeBid = async () => {
        if (!bidAmount || !auction || !selectedUserId) {
            message.error('Please enter a bid amount and select a user.');
            return;
        }
        if (auction?.endTime && auction.endTime <= Date.now()) {
            message.error('The auction has ended. You cannot place a bid.');
            return;
        }
        if (bidAmount <= auction.highestBid) {
            message.error('Your bid must be higher than the current highest bid.');
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
                            <strong>Time Left:</strong> {remainingTime}
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
                        value={bidAmount}
                        onChange={(value) => setBidAmount(value || null)}
                        placeholder="Enter your bid"
                    />
                    <Button
                        type="primary"
                        onClick={placeBid}
                        block
                        style={{
                            backgroundColor: '#1890ff',
                            borderRadius: '8px',
                            fontWeight: 'bold'
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
