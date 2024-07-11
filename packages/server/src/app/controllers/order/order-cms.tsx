import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

export const getListOrderCms = async (req: Request, res: Response) => {
    const { currentPage, pageSize } = req.query;

    try {
        const orderList = await db.order.findMany({
            skip:
                (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
            take: Number(pageSize ?? PAGE_SIZE),

            select: {
                id: true,
                name: true,
                totalAmount: true,
                status: true,
                paymentMethod: true,
                createdAt: true,
                seller: {
                    select: {
                        id: true,
                        role: true,
                        name: true,
                        image: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        return res.status(200).json({
            isOk: true,
            data: orderList,
            message: 'Get order list successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const getOrderDetailCms = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const orderDetail = await db.order.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                createdAt: true,
                name: true,
                orderDetail: {
                    select: {
                        productId: true,
                        productName: true,
                        thumbnail: true,
                        quantity: true,
                        originalPrice: true,
                        discountPrice: true,
                        size: true,
                    },
                },
                totalAmount: true,
                status: true,
            },
        });

        if (!orderDetail) {
            return res.status(400).json({
                isOk: false,
                message: 'Order not found!',
            });
        }

        return res.status(200).json({
            isOk: true,
            data: orderDetail,
            message: 'Get order detail successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
