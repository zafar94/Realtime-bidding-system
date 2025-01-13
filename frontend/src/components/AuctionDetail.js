import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Button, Typography, message } from 'antd';
import { joinAuction, listenForAuctionUpdates, disconnectSocket } from '../services/socketService';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const AuctionDetail = () => {
    const { itemId } = useParams();
    const [auction, setAuction] = useState({
        name: '',
        description: '',
        startingPrice: 0,
        highestBid: 0,
        auctionEndTime: '',
    });
    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        // Fetch auction details
        const fetchAuction = async () => {
            const response = await axios.get(`/items/${itemId}`);
            setAuction(response.data);
        };
        fetchAuction();

        // Join auction room for real-time updates
        joinAuction(itemId);
        listenForAuctionUpdates((data) => {
            setAuction((prev) => ({
                ...prev,
                highestBid: data.highestBid,
                auctionEndTime: data.auctionEndTime,
            }));
        });

        return () => {
            disconnectSocket();
        };
    }, [itemId]);

    const placeBid = async () => {
        try {
            await axios.post('/bids', {
                itemId,
                userId: 1, // Replace with actual user ID
                bidAmount,
            });
            message.success('Bid placed successfully!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to place bid');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={auction.name} bordered={false}>
                <Text>{auction.description}</Text>
                <br />
                <Text>
                    <strong>Starting Price:</strong> ${auction.startingPrice}
                </Text>
                <br />
                <Text>
                    <strong>Highest Bid:</strong> ${auction.highestBid}
                </Text>
                <br />
                <Text>
                    <strong>Time Left:</strong>{' '}
                    {new Date(auction.auctionEndTime) > new Date()
                        ? `${Math.floor((new Date(auction.auctionEndTime) - new Date()) / 1000 / 60)} mins`
                        : 'Ended'}
                </Text>
                <br />
                <InputNumber
                    min={auction.highestBid + 1}
                    placeholder="Enter your bid"
                    style={{ width: '200px', marginRight: '10px' }}
                    onChange={(value) => setBidAmount(value)}
                />
                <Button type="primary" onClick={placeBid}>
                    Place Bid
                </Button>
            </Card>
        </div>
    );
};

export default AuctionDetail;
