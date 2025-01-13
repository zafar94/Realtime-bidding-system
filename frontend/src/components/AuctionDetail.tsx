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

type AuctionDetails = AuctionItem & {
    bids: { userId: number; amount: number }[];
};

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
    const [auctions, setAuctions] = useState < AuctionItem[] > ([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get < AuctionItem[] > ('/items');
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

export const AuctionDetail: React.FC = () => {
    const { itemId } = useParams < { itemId: string } > ();
    const [auction, setAuction] = useState < AuctionDetails | null > (null);
    const [bidAmount, setBidAmount] = useState < number | null > (null);

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const response = await axios.get < AuctionDetails > (`/items/${itemId}`);
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
                userId: 1, // Replace with dynamic user ID if needed
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

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auction/:itemId" element={<AuctionDetail />} />
            </Routes>
        </Router>
    );
};
