import React, { useEffect, useState } from 'react';
import { Card, Typography, InputNumber, Button, Alert, Space, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AuctionDetail: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [auction, setAuction] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/items/${itemId}`);
                setAuction(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch auction details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAuctionDetails();
    }, [itemId]);

    const placeBid = async () => {
        if (!bidAmount || !auction) return;
        try {
            await axios.post(`${BASE_URL}/bids`, {
                itemId: Number(itemId),
                userId: 1,
                bidAmount,
            });
            setAuction({ ...auction, highestBid: bidAmount });
            setBidAmount(null);
            alert('Bid placed successfully!');
        } catch {
            alert('Error placing bid.');
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
            <Card>
                <Title level={3}>{auction?.name}</Title>
                <Text type="secondary">{auction?.description}</Text>
                <div style={{ margin: '20px 0' }}>
                    <Space direction="vertical" size="small">
                        <Text>
                            <strong>Starting Price:</strong> ${auction?.startingPrice}
                        </Text>
                        <Text>
                            <strong>Current Highest Bid:</strong> ${auction?.highestBid}
                        </Text>
                        <Text>
                            <strong>Time Left:</strong>{' '}
                            {new Date(auction?.auctionEndTime) > new Date()
                                ? `${Math.floor(
                                    (new Date(auction.auctionEndTime).getTime() -
                                        new Date().getTime()) /
                                    1000 /
                                    60
                                )} mins`
                                : 'Ended'}
                        </Text>
                    </Space>
                </div>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={auction?.highestBid + 1 || auction?.startingPrice || 1}
                        value={bidAmount}
                        onChange={(value) => setBidAmount(value || null)}
                        placeholder="Enter your bid"
                    />
                    <Button
                        type="primary"
                        onClick={placeBid}
                        disabled={!bidAmount || bidAmount <= auction?.highestBid}
                        block
                    >
                        Place Bid
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default AuctionDetail;