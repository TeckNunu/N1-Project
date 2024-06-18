import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Checkbox, Col, Layout, Row, Spin } from 'antd';
import { QueryResponseType } from 'common/types';
import { Cart } from 'common/types/cart';
import * as request from 'common/utils/http-request';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { currencyFormatter } from 'common/utils/formatter';
import { useRouter } from 'next/router';
import DeleteCartProductFormModal from './delete-cart-product';

const { Content, Sider } = Layout;

const CartDetails = () => {
    const { query } = useRouter();

    const itemKeysQuery = query.itemKeys as string;
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const { data, isLoading, refetch } = useQuery<QueryResponseType<Cart>>({
        queryKey: ['cart'],
        queryFn: () => request.get('cart').then((res) => res.data),
    });

    const { mutate: updateCartTrigger } = useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) => {
            return request
                .put(`cart/updateQuantity/${id}`, { quantity })
                .then((res) => res.data);
        },
    });

    // Initialize cartItems from localStorage or default to empty array
    const [cartItems, setCartItems] = useState<Cart[]>([]);

    useEffect(() => {
        if (data?.data) {
            setCartItems(data.data);
        }
    }, [data]);

    const updateCartQuantity = (id: string, type: 'plus' | 'minus') => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === id) {
                let newQuantity =
                    type === 'plus'
                        ? (item.quantity ?? 0) + 1
                        : (item.quantity ?? 0) - 1;
                // Ensure quantity doesn't go below 1
                newQuantity = Math.max(newQuantity, 1);
                updateCartTrigger({
                    id: id || '',
                    quantity: newQuantity,
                });
                return { ...item, quantity: newQuantity };
            }

            return item;
        });

        setCartItems(updatedCartItems); // Update state
        // localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Update localStorage
    };

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + (item.quantity ?? 0) * (item.product?.discount_price ?? 0),
        0
    );

    useEffect(() => {
        if (itemKeysQuery) {
            const ids = itemKeysQuery.split(',');
            setSelectedItems(ids);
        }
    }, [itemKeysQuery]);

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedItems((prevSelectedItems) =>
            checked
                ? [...prevSelectedItems, id]
                : prevSelectedItems.filter((itemId) => itemId !== id)
        );
    };

    return (
        <Spin spinning={isLoading}>
            <Layout>
                <Content style={{ padding: '0 48px' }}>
                    <Layout style={{ padding: '24px 0' }}>
                        <Sider width={200}>
                            <p>Sider</p>
                        </Sider>
                        <Content>
                            <Row gutter={16}>
                                <Col span={16}>
                                    {cartItems.map((item) => (
                                        <Layout key={item.id}>
                                            <Card
                                                bordered={false}
                                                extra={
                                                    <DeleteCartProductFormModal
                                                        cartId={item.id ?? ''}
                                                        productId={
                                                            item.product?.id ??
                                                            ''
                                                        }
                                                        reload={refetch}
                                                    />
                                                }
                                                style={{
                                                    marginBottom: 10,
                                                    marginLeft: 10,
                                                }}
                                                title={
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={selectedItems.some(
                                                                (e) =>
                                                                    e ===
                                                                    item.product
                                                                        ?.id
                                                            )}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    item.product
                                                                        ?.id ??
                                                                        '',
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                            value={
                                                                item.product?.id
                                                            }
                                                        />
                                                        {` Product ID: ${item.product?.id}`}
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
                                                                    item.product
                                                                        ?.name
                                                                }
                                                            </div>
                                                            <div className="relative top-2 flex justify-center">
                                                                <div>
                                                                    <div className="text-center">
                                                                        Quantity
                                                                    </div>
                                                                    <div
                                                                        className="max-sm: relative top-1 flex border-spacing-2 justify-evenly backdrop-brightness-90"
                                                                        style={{
                                                                            borderRadius: 10,
                                                                            width: 100,
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            block
                                                                            icon={
                                                                                <MinusOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                updateCartQuantity(
                                                                                    item.id ??
                                                                                        '',
                                                                                    'minus'
                                                                                )
                                                                            }
                                                                        />
                                                                        <span className="mx-2 flex items-center">
                                                                            {item.quantity ??
                                                                                0}
                                                                        </span>
                                                                        <Button
                                                                            block
                                                                            icon={
                                                                                <PlusOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                updateCartQuantity(
                                                                                    item.id ??
                                                                                        '',
                                                                                    'plus'
                                                                                )
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
                                                                <div className="flex justify-evenly">
                                                                    <div>
                                                                        <div>
                                                                            Price
                                                                        </div>
                                                                        <div className="text-lg font-semibold">
                                                                            {currencyFormatter(
                                                                                item
                                                                                    .product
                                                                                    ?.discount_price ??
                                                                                    0
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            Total
                                                                        </div>
                                                                        <div className="text-lg font-semibold">
                                                                            {currencyFormatter(
                                                                                (item.quantity ??
                                                                                    0) *
                                                                                    (item
                                                                                        .product
                                                                                        ?.discount_price ??
                                                                                        0)
                                                                            )}
                                                                        </div>
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
                                        title={
                                            <div>
                                                Total Price:
                                                <span>
                                                    {currencyFormatter(
                                                        totalPrice
                                                    )}
                                                </span>
                                            </div>
                                        }
                                    >
                                        <Link href="/product">
                                            <Button
                                                block
                                                size="large"
                                                style={{ marginBottom: 20 }}
                                                type="primary"
                                            >
                                                Continue
                                            </Button>
                                        </Link>
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
        </Spin>
    );
};

export default CartDetails;
