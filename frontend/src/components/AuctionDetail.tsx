import React, { useEffect, useState, useParams } from 'react';
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

type AuctionDetails = AuctionItem & {
    bids: { userId: number; amount: number }[];
};

const { Title, Text } = Typography;

const AuctionDetail: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [auction, setAuction] = useState<AuctionDetails | null>(null);
    const [bidAmount, setBidAmount] = useState<number | null>(null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await axios.get<AuctionDetails>(`/items/${itemId}`);
                setAuction(response.data);
            } catch (error) {
                console.error('Error fetching auction details:', error);
            }
        };
        fetchAuctionDetails();
    }, [itemId]);

    const placeBid = async () => {
        if (!bidAmount || !auction) return;
        try {
            await axios.post('/bids', {
                itemId: Number(itemId),
                userId: 1,
                bidAmount,
            });
            alert('Bid placed successfully!');
        } catch (error) {
            alert('Error placing bid.');
        }
    };

    if (!auction) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>{auction.name}</Title>
            <Text>{auction.description}</Text>
            <br />
            <Text>
                <strong>Starting Price:</strong> ${auction.startingPrice}
            </Text>
            <br />
            <Text>
                <strong>Current Highest Bid:</strong> ${auction.highestBid}
            </Text>
            <br />
            <Text>
                <strong>Time Left:</strong> {new Date(auction.auctionEndTime) > new Date() ? `${Math.floor((new Date(auction.auctionEndTime).getTime() - new Date().getTime()) / 1000 / 60)} mins` : 'Ended'}
            </Text>
            <br />
            <input
                type="number"
                value={bidAmount ?? ''}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                placeholder="Enter your bid"
            />
            <Button type="primary" onClick={placeBid} disabled={!bidAmount}>
                Place Bid
            </Button>
        </div>
    );
};

export default AuctionDetail;