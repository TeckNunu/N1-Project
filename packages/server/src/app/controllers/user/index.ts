import { Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from 'types';
import { getToken } from '../../../lib/utils';
import { db } from '../../../lib/db';

export const getProfileUser = async (req: Request, res: Response) => {
    const accessToken = getToken(req);

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token provided' });
    }

    try {
        const tokenDecoded = (await jwtDecode(accessToken)) as TokenDecoded;
        const userId = tokenDecoded.id;

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                image: true,
                gender: true,
                dob: true,
                phone: true,
                address: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                isOk: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            isOk: true,
            data: user,
            message: 'Get user profile successfully!',
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Internal Server Error', details: error });
    }
};

export const updateProfileUser = async (req: Request, res: Response) => {
    const accessToken = getToken(req);

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token provided' });
    }

    try {
        const tokenDecoded = (await jwtDecode(accessToken)) as TokenDecoded;
        const userId = tokenDecoded.id;

        const { name, gender, dob, phone, address, image } = req.body;

        const user = await db.user.update({
            where: { id: userId },
            data: {
                name,
                gender,
                dob: dob ? new Date(dob) : null,
                phone,
                address,
                image,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: user,
            message: 'User profile updated successfully!',
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: 'Internal Server Error', details: error.message });
    }
};
