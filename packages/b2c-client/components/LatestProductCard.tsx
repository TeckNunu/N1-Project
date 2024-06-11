import React from 'react';
import styles from '../styles/LatestProductCard.module.css';

type LatestProductCardProps = {
    name: string;
    discount_price: number;
    thumbnail: string;
};

const LatestProductCard: React.FC<LatestProductCardProps> = ({
    name,
    discount_price,
    thumbnail,
}) => {
    const imageUrl = thumbnail ? `/images/${thumbnail}` : '/images/sp1.jpg';

    return (
        <div className={styles.latestProductCard}>
            <div className={styles.productImageContainer}>
                <img
                    alt={name}
                    className={styles.productImage}
                    src={imageUrl}
                />
            </div>
            <div className={styles.productInfo}>
                <span className={styles.productName}>{name}</span>
                <span className={styles.discountPrice}>{discount_price}đ</span>
            </div>
        </div>
    );
};

export default LatestProductCard;
