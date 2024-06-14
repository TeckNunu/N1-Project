import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListPost = async (req: Request, res: Response) => {
    const { search } = req.query;

    try {
        const listPost = await db.post.findMany({
            where: {
                title: {
                    contains: String(search ?? ''),
                },
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                thumbnail: true,
                isShow: true,
            },
            orderBy: {
                title: 'asc',
            },
        });

        return res.status(201).json({
            isOk: true,
            data: listPost,
            message: 'Get list post successfully!',
            params: search,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await db.post.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return res.status(201).json({
            isOk: true,
            data: post,
            message: 'Get post successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
