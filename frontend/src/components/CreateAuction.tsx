import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateAuction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Auction created successfully!');
        navigate('/');
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to create auction');
      }
    } catch (error) {
      message.error('Error creating auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Item Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the item name' }]}
        >
          <Input placeholder="Enter item name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Please enter the item description' },
          ]}
        >
          <Input.TextArea placeholder="Enter item description" />
        </Form.Item>
        <Form.Item
          label="Starting Price"
          name="startingPrice"
          rules={[
            { required: true, message: 'Please enter the starting price' },
          ]}
        >
          <InputNumber
            min={1}
            formatter={(value) => `$ ${value}`}
            // parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Duration (minutes)"
          name="duration"
          rules={[
            { required: true, message: 'Please enter the auction duration' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Auction
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAuction;
