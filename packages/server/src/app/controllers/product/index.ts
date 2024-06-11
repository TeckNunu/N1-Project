import { Request, Response } from 'express';
import { db } from '../../../lib/db';

export const getListProductSelect = async (req: Request, res: Response) => {
    const { search } = req.query;

    try {
        const listProduct = await db.product.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return res.status(201).json({
            isOk: true,
            data: listProduct,
            message: 'Get list product successfully!',
            params: search,
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

type ProductConditions = {
    categoryId?: string;
    name?: {
        contains: string;
    };
};

type SortCondition = {
    [key: string]: 'asc' | 'desc';
};

export const searchProducts = async (req: Request, res: Response) => {
    const { categoryId, search, sortBy, sortOrder } = req.query;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 4; // Số sản phẩm trên mỗi trang, mặc định là 4

    try {
        // Xây dựng điều kiện tìm kiếm
        const conditions: ProductConditions = {};
        if (categoryId) {
            conditions.categoryId = String(categoryId);
        }
        if (search) {
            conditions.name = {
                contains: String(search),
            };
        }

        // Xây dựng điều kiện sắp xếp
        const validSortFields = ['discount_price', 'name', 'updatedAt'];
        const orderBy: SortCondition[] = [];
        if (sortBy && validSortFields.includes(sortBy as string)) {
            const sortCondition: SortCondition = {};
            sortCondition[sortBy as string] =
                sortOrder === 'desc' ? 'desc' : 'asc';
            orderBy.push(sortCondition);
        }

        // Tính toán phân trang
        const skip = (page - 1) * pageSize;

        // Đếm tổng số sản phẩm thỏa mãn điều kiện tìm kiếm
        const totalProducts = await db.product.count({
            where: conditions,
        });

        // Truy vấn cơ sở dữ liệu với các điều kiện và phân trang
        const products = await db.product.findMany({
            where: { ...conditions, isShow: true },
            orderBy: orderBy.length ? orderBy : undefined,
            skip,
            take: pageSize,
            select: {
                id: true,
                name: true,
                discount_price: true,
                original_price: true,
                description: true,
                thumbnail: true,
                updatedAt: true,
            },
        });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalProducts / pageSize);

        return res.status(200).json({
            isOk: true,
            data: products,
            total: totalProducts,
            currentPage: page,
            totalPages,
            message: 'Search products successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const getLatestProducts = async (req: Request, res: Response) => {
    const { limit } = req.query;
    const productLimit = limit ? parseInt(limit as string, 10) : 4; // Default to 4 if no limit is provided

    try {
        const latestProducts = await db.product.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            take: productLimit,
            select: {
                id: true,
                name: true,
                discount_price: true,
                original_price: true,
                description: true,
                thumbnail: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: latestProducts,
            message: 'Get latest products successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
