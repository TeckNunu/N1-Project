import React from 'react';
import { Layout, Pagination } from 'antd';
import ProductCard from './ProductCard';
import styles from '../styles/ProductContent.module.css';
import { Product } from '~/types/product';

const { Content } = Layout;

// type Product = {
//     id: string;
//     name: string;
//     discount_price: number;
//     original_price: number;
//     description: string;
//     thumbnail: string;
//     updatedAt: string;
// };

type ProductContentProps = {
    products: Product[];
    currentPage: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number, pageSize?: number) => void;
    pageSize: number;
};

const ProductContent: React.FC<ProductContentProps> = ({
    products = [],
    currentPage,
    // totalPages,
    total,
    onPageChange,
    pageSize,
}) => {
    return (
        <Layout style={{ padding: '0 24px 24px' }}>
            <Content className={styles.content}>
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <div className={styles.gridItem} key={product.id}>
                            <ProductCard {...product} />
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex justify-end">
                    {total ? (
                        <Pagination
                            current={currentPage}
                            defaultCurrent={1}
                            onChange={onPageChange}
                            pageSize={pageSize}
                            pageSizeOptions={[5, 10, 20, 50]}
                            showSizeChanger
                            total={total}
                        />
                    ) : null}
                </div>
            </Content>
        </Layout>
    );
};

export default ProductContent;
