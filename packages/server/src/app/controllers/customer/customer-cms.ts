import { Request, Response } from 'express';
import { SortOrder } from '../../../types';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type UserStatus = 'NEWLY_REGISTER' | 'NEWLY_BOUGHT' | 'BANNED';

type WhereClause = {
    role: 'USER';
    isVerified: boolean;
    status?: UserStatus;
    OR?: Record<string, Record<string, string | undefined>>[];
};

export const getCustomerCms = async (req: Request, res: Response) => {
    const { currentPage, pageSize, search, order, orderName, status } =
        req.query;

    try {
        let orderBy:
            | Record<string, SortOrder | Record<string, SortOrder>>
            | undefined;

        if (orderName && order) {
            orderBy = {
                [String(orderName)]: order as SortOrder,
            };
        }

        const whereClause: WhereClause = {
            role: 'USER',
            isVerified: true,
            status: (status as UserStatus) || undefined,
            OR: [
                {
                    name: {
                        contains: String(search || ''),
                    },
                },
                {
                    email: {
                        contains: String(search || ''),
                    },
                },
                {
                    phone: {
                        contains: String(search || ''),
                    },
                },
            ],
        };

        const total = await db.user.count({
            where: {
                ...whereClause,
            },
        });

        const orderList = await db.user.findMany({
            skip:
                (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
            take: Number(pageSize ?? PAGE_SIZE),
            where: { ...whereClause },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                phone: true,
                dob: true,
                gender: true,
                image: true,
                status: true,
            },
            orderBy: orderBy ?? { createdAt: 'desc' },
        });

        return res.status(200).json({
            isOk: true,
            data: orderList,
            pagination: { total },
            message: 'Get order list successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
