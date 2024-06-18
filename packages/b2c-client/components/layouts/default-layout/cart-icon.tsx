import { ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { Badge } from 'antd';
import { useAuth } from '~/hooks/useAuth';
import CartPopover from './cart-popover';
import { useCartQuery } from '~/hooks/useCartQuery';

const CartIcon = () => {
    const router = useRouter();
    const auth = useAuth();

    const { data } = useCartQuery();

    return (
        <div>
            <CartPopover
                data={auth ? data?.data : []}
                total={data?.pagination?.total}
            >
                <Badge count={data?.pagination?.total}>
                    <ShoppingCartOutlined
                        className="cursor-pointer text-3xl text-slate-500"
                        onClick={() => router.push('/my-page/cart-details')}
                    />
                </Badge>
            </CartPopover>
        </div>
    );
};

export default CartIcon;
