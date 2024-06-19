import { Button, Popover } from 'antd';
import { Cart } from 'common/types/cart';
import { getImageUrl } from 'common/utils/getImageUrl';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { currencyFormatter } from 'common/utils/formatter';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
    children: React.ReactNode;
    data?: Cart[];
    total?: number;
};

const CartPopover: React.FC<Props> = ({ children, data, total }) => {
    const router = useRouter();

    const content = useMemo(() => {
        if (!total) {
            return (
                <div className="text-primary py-5 text-center text-lg">
                    Chưa có sản phẩm!
                </div>
            );
        }
        return (
            <div className="mt-5 grid grid-cols-1 gap-2">
                {data?.map((item) => (
                    <div
                        className="cursor-pointer"
                        key={item.id}
                        onClick={() =>
                            router.push(`/product/${item?.product?.id}`)
                        }
                        role="presentation"
                    >
                        <div className="flex gap-2">
                            <Image
                                alt=""
                                className="rounded-md border object-cover"
                                height={50}
                                src={getImageUrl(
                                    item?.product?.thumbnail ?? ''
                                )}
                                width={50}
                            />
                            <div className="line-clamp-1 flex-1">
                                {item?.product?.name}
                            </div>
                            <div className="text-primary w-[100px] text-end text-base">
                                {item?.product?.discount_price
                                    ? currencyFormatter(
                                          item?.product?.discount_price
                                      )
                                    : currencyFormatter(
                                          item?.product?.original_price ?? 0
                                      )}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end py-2">
                    <Link href="/my-page/cart-details">
                        <Button type="primary">Xem giỏ hàng</Button>
                    </Link>
                </div>
            </div>
        );
    }, [data, total]);

    return (
        <Popover
            content={<div className="w-[350px]">{content}</div>}
            title={
                <div className="font-normal text-slate-500">
                    Sản phẩm mới thêm
                </div>
            }
        >
            {children}
        </Popover>
    );
};

CartPopover.defaultProps = {
    data: undefined,
    total: undefined,
};

export default CartPopover;