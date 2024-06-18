import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from 'types';
import { getToken } from '../../../lib/utils';
import { db } from '../../../lib/db';

type CreateFeedbackData = {
    productId: string;
    description?: string;
    rating?: number | null;
};

type FeedbackItem = {
    id: string;
    description?: string;
    userId: string;
    productId: string;
    rating: number | null;
    createdAt: Date;
    updatedAt: Date;
};

export const addFeedback = async (req: Request, res: Response) => {
    const { productId, description, rating }: CreateFeedbackData = req.body;
    // const accessToken = req.headers.authorization?.split(' ')[1];

    // if (!accessToken) {
    //     return res.status(401).json({ message: 'No access token provided' });
    // }

    const accessToken = getToken(req);

    if (!accessToken) {
        return res.sendStatus(401);
    }

    const tokenDecoded = jwtDecode(accessToken) as TokenDecoded;
    try {
        // const decodedToken = jwtDecode<TokenDecoded>(accessToken);
        // const userId = decodedToken.id;

        // Thêm feedback mới
        const newFeedback: FeedbackItem = await db.feedback.create({
            data: {
                userId: tokenDecoded.id,
                productId,
                description,
                rating: rating ?? null, // Đặt giá trị mặc định là null nếu không có rating
            },
        });

        return res.status(201).json({
            isOk: true,
            data: newFeedback,
            message: 'Feedback added successfully!',
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Internal Server Error', details: error });
    }
};
