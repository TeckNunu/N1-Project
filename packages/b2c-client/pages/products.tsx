import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import type { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import { get } from 'common/utils/http-request';
import { PAGE_SIZE_CLIENT_PRODUCT } from 'common/constant';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';
import ProductContent from '../components/ProductContent';
import styles from '../styles/Products.module.css';

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
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_CLIENT_PRODUCT);

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

    const {
        data: productsData,
        isLoading: productLoading,
        refetch: refetchProducts,
    } = useQuery({
        queryKey: [
            'products',
            currentPage,
            sort,
            sortOrder,
            category,
            searchTerm,
            pageSize,
        ],
        queryFn: () => {
            const params: SearchParams = {
                page: currentPage,
                pageSize,
                sortBy: sort,
                sortOrder,
                categoryId: category,
                search: searchTerm,
            };
            return get('product/search', { params }).then((res) => res.data);
        },
    });

    useEffect(() => {
        if (productsData) {
            setProducts(productsData.data);
            setTotalProducts(productsData.total);
            setTotalPageCount(productsData.totalPages);
        }
    }, [productsData]);

    const handleSearch = (
        page = 1,
        sortParam?: string,
        sortOrderParam?: string,
        categoryParam?: string,
        searchParam?: string,
        pageSizeParam?: number
    ) => {
        setCurrentPage(page);
        setSort(sortParam || sort);
        setSortOrder(sortOrderParam || sortOrder);
        setCategory(categoryParam || category);
        setSearchTerm(searchParam || searchTerm);
        if (pageSizeParam) {
            setPageSize(pageSizeParam);
        }
        refetchProducts();
    };

    return (
        <Spin
            spinning={
                categoryLoading || latestProductsLoading || productLoading
            }
        >
            <Layout className={styles.container}>
                <Sidebar
                    categories={categories}
                    currentSort={sort}
                    currentSortOrder={sortOrder}
                    handleSearch={handleSearch}
                    latestProducts={latestProducts}
                    setCategory={(cat) => {
                        setCategory(cat);
                        handleSearch(1, sort, sortOrder, category, searchTerm);
                    }}
                />
                <Layout className={styles.mainLayout}>
                    <HeaderBar
                        handleSearch={handleSearch}
                        setSort={(newSort) => {
                            setSort(newSort);
                            handleSearch(
                                1,
                                newSort,
                                sortOrder,
                                category,
                                searchTerm
                            );
                        }}
                        setSortOrder={(newSortOrder) => {
                            setSortOrder(newSortOrder);
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
                            totalPages={totalPageCount}
                        />
                    </Content>
                </Layout>
            </Layout>
        </Spin>
    );
};

export default Products;
