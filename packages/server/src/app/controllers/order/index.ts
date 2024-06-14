import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { ORDER_STATUS, Prisma } from '@prisma/client';
import { PAGE_SIZE } from '../../../constant';
import { db } from '../../../lib/db';
import { getToken } from '../../../lib/utils';
import { TokenDecoded } from '../../../types';

export const getListOrder = async (req: Request, res: Response) => {
    const { pageSize, currentPage, status, search } = req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
        take: Number(pageSize ?? PAGE_SIZE),
    };

    const accessToken = getToken(req);

    if (!accessToken) {
        return res.sendStatus(401);
    }

    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;

    const whereClause: Prisma.OrderWhereInput = {
        userId: tokenDecoded.id,
        ...(status && { status: status as ORDER_STATUS }), // Search by status if provided
        AND: search
            ? [
                  {
                      OR: [
                          { id: { contains: search as string } }, // Search by order ID
                          {
                              orderDetail: {
                                  some: {
                                      productName: {
                                          contains: search as string,
                                      },
                                  },
                              },
                          },
                      ],
                  },
              ]
            : [],
    };

    try {
        const total = await db.order.count({
            where: whereClause,
        });

        let orders = await db.order.findMany({
            where: {
                ...whereClause,
            },
            select: {
                id: true,
                totalAmount: true,
                paymentMethod: true,
                status: true,
                createdAt: true,
                _count: {
                    select: { orderDetail: true },
                },
                orderDetail: {
                    take: 1,
                    orderBy: {
                        totalPrice: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...pagination,
        });

        orders = orders.map((order) => ({
            ...order,
            // eslint-disable-next-line no-underscore-dangle
            count: order._count.orderDetail - 1,
            _count: undefined,
        }));

        return res.status(201).json({
            isOk: true,
            data: orders,

            pagination: {
                total,
            },
            message: 'Get order successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
