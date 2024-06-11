import React from 'react';
import { Button, Card, Typography } from 'antd';
import styles from '../styles/ProductCard.module.css';

type ProductCardProps = {
    // id: string;
    name: string;
    discount_price: number;
    original_price: number;
    description: string;
    thumbnail: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
    name,
    discount_price,
    original_price,
    description,
    thumbnail,
}) => {
    const imageUrl = thumbnail ? `/images/${thumbnail}` : '/images/sp1.jpg';

    return (
        <Card
            className={styles.productCard}
            cover={
                <img
                    alt={name}
                    className={styles.productImage}
                    src={imageUrl}
                />
            }
            hoverable
        >
            <Card.Meta
                description={
                    <div className={styles.metaDescription}>{description}</div>
                }
                title={<div className={styles.metaTitle}>{name}</div>}
            />
            <Typography.Paragraph className={styles.originalPrice}>
                <del>{original_price}đ</del>
            </Typography.Paragraph>
            <Typography.Paragraph className={styles.discountPrice}>
                {discount_price}đ
            </Typography.Paragraph>
            <div className={styles.buttonContainer}>
                <Button className={styles.buyButton} type="primary">
                    Mua
                </Button>
                <Button className={styles.feedbackButton} type="default">
                    Phản hồi
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
