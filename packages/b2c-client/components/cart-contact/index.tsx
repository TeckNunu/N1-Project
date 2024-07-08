import { useQuery } from '@tanstack/react-query';
import type { RadioChangeEvent } from 'antd';
import { Button, Card, Col, Layout, Radio, Row, Space, Spin } from 'antd';
import { QueryResponseType } from 'common/types';
import { Cart } from 'common/types/cart';
import { currencyFormatter } from 'common/utils/formatter';
import request from 'common/utils/http-request';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import useCartStore from '~/hooks/useCartStore';
import CartContactItem from './cart-contact-list';
import UserDetailAll from './user-contact';

const { Content } = Layout;

const CartContact = () => {
    const auth = useAuth();
    const [value, setValue] = useState(1);
    const router = useRouter();
    const itemKeysQuery = router.query.itemKeys as string;

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };
    const [cartItems, setCartItems] = useState<Cart[]>([]);

    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const { data: cartStorage } = useCartStore();

    const { data: listProductCart } = useQuery<
        QueryResponseType<{
            id: string;
            discount_price: number;
            original_price: number;
        }>
    >({
        queryKey: ['list_product_cart'],
        queryFn: async () => {
            return request
                .get('/list-product-cart', {
                    params: {
                        listProductId: cartStorage.map(
                            (cart) => cart.productId
                        ),
                    },
                })
                .then((res) => res.data);
        },
        enabled: cartStorage.length > 0,
    });

    const { data: cartData, isLoading: isCartLoading } = useQuery<
        QueryResponseType<Cart>
    >({
        queryKey: ['cart'],
        queryFn: () => {
            if (auth) {
                return request.get('cart').then((res) => res.data);
            }
            return Promise.resolve({ data: null }); // Return a dummy response or handle as needed
        },
        enabled: !!auth, // Only fetch data when auth is true
    });

    useEffect(() => {
        if (itemKeysQuery) {
            const productIds = itemKeysQuery.split(',');
            if (auth) {
                if (cartData?.data) {
                    const filteredCartItems = cartData?.data.filter((item) => {
                        return productIds.includes(item.product?.id as string);
                    });

                    setCartItems(filteredCartItems);
                }
            } else {
                const filteredCartItems = cartStorage.filter((item) =>
                    productIds.includes(item.productId as string)
                );

                const total = listProductCart?.data?.reduce((acc, cur) => {
                    const cartItem = filteredCartItems.find(
                        (item) => item.productId === cur.id
                    );
                    if (cartItem) {
                        const price =
                            cur.discount_price ?? cur.original_price ?? 0;
                        // eslint-disable-next-line no-param-reassign
                        acc += price * (cartItem?.quantity ?? 0);
                    }
                    return acc;
                }, 0);
                setTotalCartPrice(total ?? 0);
                setCartItems(filteredCartItems);
            }
        }
    }, [cartData, cartStorage, auth]);

    const totalPrice = cartItems.reduce(
        (total, item) =>
            total +
            (item.quantity ?? 0) *
                (item.product?.discount_price ??
                    item.product?.original_price ??
                    0),
        0
    );

    if (!auth) {
        return (
            <Layout>
                <Content style={{ padding: '0 48px' }}>
                    <Layout style={{ padding: '24px 0' }}>
                        <Content>
                            <Row gutter={16}>
                                <Col span={10}>
                                    <UserDetailAll />
                                </Col>
                                <Col span={6}>
                                    <Card
                                        bordered={false}
                                        title={
                                            <div className="font-bold">
                                                Hình thức thanh toán
                                            </div>
                                        }
                                    >
                                        <Radio.Group
                                            onChange={onChange}
                                            value={value}
                                        >
                                            <Space direction="vertical">
                                                <Radio
                                                    className="mb-2"
                                                    value={1}
                                                >
                                                    <div className="font-semibold ">
                                                        Thanh toán khi nhận
                                                        hàng(COD)
                                                    </div>
                                                </Radio>
                                                <Radio value={2}>
                                                    <div className="font-semibold">
                                                        Thanh toán qua VNPAY-QR
                                                    </div>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        bordered={false}
                                        title={
                                            <div className="font-bold">
                                                Đơn hàng
                                            </div>
                                        }
                                    >
                                        {cartItems?.map((item) => (
                                            <CartContactItem
                                                key={item?.productId}
                                                productId={item.productId ?? ''}
                                                quantity={item.quantity ?? 0}
                                            />
                                        ))}

                                        <div className="text-end text-xl font-bold">
                                            Tổng đơn hàng:{' '}
                                            {currencyFormatter(totalCartPrice)}
                                        </div>
                                        <div className="m-10 flex justify-evenly">
                                            <div>
                                                <Link href="/cart-details">
                                                    <Button
                                                        block
                                                        size="large"
                                                        style={{
                                                            marginBottom: 20,
                                                        }}
                                                        type="primary"
                                                    >
                                                        Quay về giỏ hàng
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div>
                                                <Link href="/cart-completion">
                                                    <Button
                                                        block
                                                        size="large"
                                                        type="primary"
                                                    >
                                                        Thanh toán
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }
    return (
        <Layout>
            <Content style={{ padding: '0 48px' }}>
                <Layout style={{ padding: '24px 0' }}>
                    <Content>
                        <Row gutter={16}>
                            <Col span={10}>
                                <UserDetailAll />
                            </Col>
                            <Col span={6}>
                                <Card
                                    bordered={false}
                                    title={
                                        <div className="font-bold">
                                            Hình thức thanh toán
                                        </div>
                                    }
                                >
                                    <Radio.Group
                                        onChange={onChange}
                                        value={value}
                                    >
                                        <Space direction="vertical">
                                            <Radio className="mb-2" value={1}>
                                                <div className="font-semibold ">
                                                    Thanh toán khi nhận
                                                    hàng(COD)
                                                </div>
                                            </Radio>
                                            <Radio value={2}>
                                                <div className="font-semibold">
                                                    Thanh toán qua VNPAY-QR
                                                </div>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    bordered={false}
                                    title={
                                        <div className="font-bold">
                                            Đơn hàng
                                        </div>
                                    }
                                >
                                    <Spin spinning={isCartLoading}>
                                        {cartItems?.map((item) => (
                                            <Card className="m-2">
                                                <Content>
                                                    <Row gutter={16}>
                                                        <Col span={6}>
                                                            <div
                                                                style={{
                                                                    height: 50,
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
                                                        <Col span={6}>
                                                            <div className="text-lg font-semibold">
                                                                {
                                                                    item.product
                                                                        ?.name
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="font-semibol mx-6 text-lg">
                                                                x{item.quantity}
                                                            </div>
                                                        </Col>
                                                        <Col span={6}>
                                                            <div className="font-semibol text-lg">
                                                                {currencyFormatter(
                                                                    item.product
                                                                        ?.discount_price ??
                                                                        item
                                                                            .product
                                                                            ?.original_price ??
                                                                        0
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Content>
                                            </Card>
                                        ))}
                                    </Spin>

                                    <div className="text-end text-xl font-bold">
                                        Tổng đơn hàng:{' '}
                                        {currencyFormatter(totalPrice)}
                                    </div>
                                    <div className="m-10 flex justify-evenly">
                                        <div>
                                            <Link href="/cart-details">
                                                <Button
                                                    block
                                                    size="large"
                                                    style={{
                                                        marginBottom: 20,
                                                    }}
                                                    type="primary"
                                                >
                                                    Quay về giỏ hàng
                                                </Button>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="/cart-completion">
                                                <Button
                                                    block
                                                    size="large"
                                                    type="primary"
                                                >
                                                    Thanh toán
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
};

export default CartContact;
