import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { get } from 'common/utils/http-request';
import { PAGE_SIZE_CLIENT_PRODUCT } from 'common/constant';
import Sidebar from '../../components/product/Sidebar';
import HeaderBar from '../../components/product/HeaderBar';
import ProductContent from '../../components/product/ProductContent';
import styles from '~/styles/Products.module.css';

const { Content } = Layout;

type SearchParams = {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: string;
    categoryId?: string;
    search?: string;
};

const Products: NextPage = () => {
    const router = useRouter();
    const { query: routerQuery } = router;

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState<number>(
        Number(routerQuery.page) || 1
    );
    const [sort, setSort] = useState<string | undefined>(
        routerQuery.sort as string
    );
    const [sortOrder, setSortOrder] = useState<string | undefined>(
        routerQuery.sortOrder as string
    );
    const [category, setCategory] = useState<string | undefined>(
        routerQuery.category as string
    );
    const [searchTerm, setSearchTerm] = useState<string | undefined>(
        routerQuery.search as string
    );
    const [totalProducts, setTotalProducts] = useState(0);
    const [pageSize, setPageSize] = useState<number>(
        Number(routerQuery.pageSize) || PAGE_SIZE_CLIENT_PRODUCT
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => get('category').then((res) => res.data.data),
    });

    const { data: latestProducts, isLoading: latestProductsLoading } = useQuery(
        {
            queryKey: ['latestProducts'],
            queryFn: () =>
                get('product/latest', {
                    params: { limit: 3 },
                }).then((res) => res.data.data),
        }
    );

    const fetchProducts = async () => {
        setIsLoading(true);
        const params: SearchParams = {
            page: currentPage,
            pageSize,
            sortBy: sort,
            sortOrder,
            categoryId: category,
            search: searchTerm,
        };

        try {
            const res = await get('product/search', { params });
            setTotalProducts(res.data.total);
            setProducts(res.data.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, sort, sortOrder, category, searchTerm, pageSize]);

    const handleSearch = (
        page = 1,
        sortParam?: string,
        sortOrderParam?: string,
        categoryParam?: string,
        searchParam?: string,
        pageSizeParam?: number
    ) => {
        setCurrentPage(page);
        setSort(sortParam !== undefined ? sortParam : sort);
        setSortOrder(sortOrderParam !== undefined ? sortOrderParam : sortOrder);
        setCategory(categoryParam !== undefined ? categoryParam : category);
        setSearchTerm(searchParam !== undefined ? searchParam : searchTerm);
        if (pageSizeParam) {
            setPageSize(pageSizeParam);
        }

        const updatedQuery: Record<string, string | number> = {
            page,
            pageSize: pageSizeParam ?? pageSize,
            sort: sortParam ?? sort ?? '',
            sortOrder: sortOrderParam ?? sortOrder ?? '',
            category: categoryParam ?? category ?? '',
            search: searchParam ?? searchTerm ?? '',
        };

        // Remove empty string values from query
        Object.keys(updatedQuery).forEach(
            (key) =>
                (updatedQuery[key] === '' || updatedQuery[key] === undefined) &&
                delete updatedQuery[key]
        );

        router.push(
            {
                pathname: '/product',
                query: updatedQuery,
            },
            undefined,
            { shallow: true }
        );
    };

    const handleResetFilters = () => {
        setCurrentPage(1);
        setSort(undefined);
        setSortOrder(undefined);
        setCategory(undefined);
        setSearchTerm(undefined);
        setPageSize(PAGE_SIZE_CLIENT_PRODUCT);

        // Gọi handleSearch với các giá trị mặc định và cập nhật URL
        const updatedQuery: Record<string, string | number> = {
            page: 1,
            pageSize: PAGE_SIZE_CLIENT_PRODUCT,
        };

        router.push(
            {
                pathname: '/product',
                query: updatedQuery,
            },
            undefined,
            { shallow: true }
        );
    };

    return (
        <Spin spinning={categoryLoading || latestProductsLoading || isLoading}>
            <Layout className={styles.container}>
                <Sidebar
                    categories={categories}
                    currentCategory={category}
                    currentSort={sort}
                    currentSortOrder={sortOrder}
                    handleResetFilters={handleResetFilters}
                    handleSearch={handleSearch}
                    latestProducts={latestProducts}
                    setCategory={(cat) => {
                        handleSearch(1, sort, sortOrder, cat, searchTerm);
                    }}
                />
                <Layout className={styles.mainLayout}>
                    <HeaderBar
                        handleSearch={handleSearch}
                        setSort={(newSort) => {
                            handleSearch(
                                1,
                                newSort,
                                sortOrder,
                                category,
                                searchTerm
                            );
                        }}
                        setSortOrder={(newSortOrder) => {
                            handleSearch(
                                1,
                                sort,
                                newSortOrder,
                                category,
                                searchTerm
                            );
                        }}
                    />
                    <Content className={styles.content}>
                        <ProductContent
                            currentPage={currentPage}
                            onPageChange={(page, newPageSize) =>
                                handleSearch(
                                    page,
                                    sort,
                                    sortOrder,
                                    category,
                                    searchTerm,
                                    newPageSize
                                )
                            }
                            pageSize={pageSize}
                            products={products}
                            total={totalProducts}
                        />
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
};

export default Products;
