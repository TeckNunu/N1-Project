export type OrderDetail = {
    quantity: number | null;
    originalPrice: number | null;
    discountPrice: number | null;
    totalPrice: number | null;

    thumbnail: string | null;
    brand: string | null;
    size: string | null;
    category: string | null;

    productId: string | null;
    productName: string | null;

    orderId: string | null;
};

export type Order = {
    id: string | null;
    status: string | null;
    totalAmount: string | null;
    paymentMethod: string | null;
    createdAt: string | null;
    orderDetail: OrderDetail[] | null;
    count: number | null;
};

export const orderStatus = {
    PENDING: 'Đang xử lí',
    CONFIRMED: 'Đã xác nhận',
    DELIVERING: 'Đang vận chuyển',
    DELIVERED: 'Giao hàng thành công',
    CANCELED: 'Đã huỷ',
};
