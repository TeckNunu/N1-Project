import React from 'react';

import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { Cart } from 'common/types/cart';
import { QueryResponseType } from 'common/types';
import Image from 'next/image';

const { Content, Sider } = Layout;

const CartDetails = () => {
    const { data, isLoading } = useQuery<QueryResponseType<Cart>>({
        queryKey: ['cart'],
        queryFn: () => request.get('cart').then((res) => res.data),
    });

    return (
        <Spin spinning={isLoading}>
            <div>
                <Layout>
                    <Content style={{ padding: '0 48px' }}>
                        <Layout
                            style={{
                                padding: '24px 0',
                            }}
                        >
                            <Sider width={200}>
                                <p>Sider</p>
                            </Sider>
                            <Content>
                                <Row gutter={16}>
                                    <Col span={16}>
                                        {data?.data?.map((item) => (
                                            <Layout>
                                                <Card
                                                    bordered={false}
                                                    extra={
                                                        <Button
                                                            danger
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            type="text"
                                                        />
                                                    }
                                                    style={{
                                                        marginBottom: 10,
                                                        marginLeft: 10,
                                                    }}
                                                    title={
                                                        <div>
                                                            Product ID:
                                                            {item.product?.id}
                                                        </div>
                                                    }
                                                >
                                                    <Content>
                                                        <Row gutter={16}>
                                                            <Col span={6}>
                                                                <div
                                                                    style={{
                                                                        height: 150,
                                                                    }}
                                                                >
                                                                    <Image
                                                                        alt={
                                                                            item.id ??
                                                                            ''
                                                                        }
                                                                        className="shadow-lg"
                                                                        layout="fill"
                                                                        objectFit="cover"
                                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.product?.thumbnail}`}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div className="relative flex justify-center text-xl font-semibold">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.name
                                                                    }
                                                                </div>
                                                                <div className="relative top-2 flex justify-center">
                                                                    <div>
                                                                        <div className="text-center">
                                                                            <p>
                                                                                Quantity
                                                                            </p>
                                                                        </div>
                                                                        <div
                                                                            className="max-sm: relative top-1 flex border-spacing-2 justify-evenly backdrop-brightness-90"
                                                                            style={{
                                                                                borderRadius: 10,
                                                                                width: 100,
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                icon={
                                                                                    <MinusOutlined />
                                                                                }
                                                                            />

                                                                            {
                                                                                item.quantity
                                                                            }
                                                                            <Button
                                                                                icon={
                                                                                    <PlusOutlined />
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col span={8}>
                                                                <div
                                                                    style={{
                                                                        marginTop: 38,
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <div>
                                                                            Price
                                                                        </div>
                                                                        <div className="text-lg font-semibold">
                                                                            {
                                                                                item
                                                                                    .product
                                                                                    ?.discount_price
                                                                            }
                                                                            $
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Content>
                                                </Card>
                                            </Layout>
                                        ))}
                                    </Col>
                                    <Col span={8}>
                                        <Card
                                            bordered={false}
                                            title="Total Price"
                                        >
                                            <Button
                                                block
                                                size="large"
                                                style={{
                                                    marginBottom: 20,
                                                }}
                                                type="primary"
                                            >
                                                Continue
                                            </Button>
                                            <Button
                                                block
                                                size="large"
                                                type="primary"
                                            >
                                                Checkout
                                            </Button>
                                        </Card>
                                    </Col>
                                </Row>
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
            </div>
        </Spin>
    );
};

export default CartDetails;
