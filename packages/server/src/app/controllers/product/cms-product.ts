/* eslint-disable max-lines */
import { Request, Response } from 'express';
import { db } from '../../../lib/db';
import { PAGE_SIZE } from '../../../constant';

type ProductFilter = {
    brandId?: string;
    categoryId?: string;
    rating?: number;
    isShow?: boolean;
};

export const getListProductManage = async (req: Request, res: Response) => {
    const {
        search,
        pageSize,
        currentPage,
        sortBy,
        brandId,
        categoryId,
        rating,
        isShow,
    } = req.query;

    const pagination = {
        skip: (Number(currentPage ?? 1) - 1) * Number(pageSize ?? PAGE_SIZE),
        take: Number(pageSize ?? PAGE_SIZE),
    };

    try {
        const whereClause: ProductFilter = {};

        if (brandId) {
            whereClause.brandId = String(brandId);
        }
        if (categoryId) {
            whereClause.categoryId = String(categoryId);
        }
        if (rating) {
            whereClause.rating = Number(rating);
        }
        if (isShow) {
            whereClause.isShow = isShow === 'true';
        }

        const select = {
            id: true,
            name: true,
            brand: {
                select: {
                    name: true,
                },
            },
            category: {
                select: { name: true },
            },
            createdAt: true,
            isShow: true,
            original_price: true,
            quantity: true,
            rating: true,
            size: true,
            sold_quantity: true,
            discount_price: true,
        };

        const total = await db.product.count({
            where: {
                name: {
                    contains: String(search || ''),
                },
                ...whereClause,
            },
        });

        let listProduct;

        switch (sortBy) {
            case 'LATEST':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
                });
                break;
            case 'OLDEST':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select,
                });
                break;
            case 'NAME_A_TO_Z':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        name: 'asc',
                    },
                    select,
                });
                break;
            case 'NAME_Z_TO_A':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        name: 'desc',
                    },
                    select,
                });
                break;
            case 'RATE_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        rating: 'desc',
                    },
                    select,
                });
                break;
            case 'RATE_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        rating: 'asc',
                    },
                    select,
                });
                break;
            case 'PRICE_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        original_price: 'asc',
                    },
                    select,
                });
                break;
            case 'PRICE_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        original_price: 'desc',
                    },
                    select,
                });
                break;
            case 'DISCOUNT_PRICE_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        discount_price: 'asc',
                    },
                    select,
                });
                break;
            case 'DISCOUNT_PRICE_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        discount_price: 'desc',
                    },
                    select,
                });
                break;
            case 'QUANTITY_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        quantity: 'asc',
                    },
                    select,
                });
                break;
            case 'QUANTITY_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        quantity: 'desc',
                    },
                    select,
                });
                break;
            case 'SOLD_QUANTITY_LOW_TO_HIGHT':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        sold_quantity: 'asc',
                    },
                    select,
                });
                break;
            case 'SOLD_QUANTITY_HIGHT_TO_LOW':
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        sold_quantity: 'desc',
                    },
                    select,
                });
                break;
            default:
                listProduct = await db.product.findMany({
                    ...pagination,
                    where: {
                        name: {
                            contains: search ? String(search) : undefined,
                        },
                        ...whereClause,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    select,
                });
        }

        return res.status(200).json({
            isOk: true,
            data: listProduct,
            message: 'Get list product successfully!',
            pagination: {
                total,
            },
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const {
        name,
        brandId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_price,
        quantity,
        description,
        size,
        categoryId,
        thumbnail,
        isShow,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product_image,
    } = req.body;

    try {
        const product = await db.product.create({
            data: {
                name,
                brandId,
                original_price,
                discount_price,
                quantity,
                description,
                size,
                categoryId,
                thumbnail,
                isShow,
                product_image: {
                    createMany: {
                        data: product_image,
                    },
                },
            },
        });

        return res.status(201).json({
            isOk: true,
            data: product,
            message: 'Create new product successfully!',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        name,
        brandId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_price,
        quantity,
        description,
        size,
        categoryId,
        thumbnail,
        isShow,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product_image,
    } = req.body;

    try {
        await db.productImage.deleteMany({
            where: {
                productId: id,
            },
        });

        const product = await db.product.update({
            where: {
                id,
            },
            data: {
                name,
                brandId,
                original_price,
                discount_price,
                quantity,
                description,
                size,
                categoryId,
                thumbnail,
                isShow,
                product_image: {
                    createMany: {
                        data: product_image,
                    },
                },
            },
        });

        return res.status(200).json({
            isOk: true,
            data: product,
            message: 'Update new product successfully!',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await db.product.findUnique({
            where: {
                id,
            },
            include: {
                product_image: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
                brand: {
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

        if (!product) {
            return res.status(400).json({
                isOk: false,
                data: null,
                message: 'This product does not exist!',
            });
        }

        return res.status(200).json({
            isOk: true,
            data: product,
            message: 'Get product successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};

export const deleteProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await db.product.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            isOk: true,
            data: product,
            message: 'Delete product successfully!',
        });
    } catch (error) {
        return res.sendStatus(500);
    }
};
