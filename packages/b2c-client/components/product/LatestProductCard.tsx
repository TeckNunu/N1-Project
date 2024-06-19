import React from 'react';
import { useRouter } from 'next/router';
import { getImageUrl } from '~/../common/utils/getImageUrl';
import styles from '../../styles/LatestProductCard.module.css';

type LatestProductCardProps = {
    id: string;
    name: string;
    discount_price: number;
    thumbnail: string;
};

const LatestProductCard: React.FC<LatestProductCardProps> = ({
    id,
    name,
    discount_price,
    thumbnail,
}) => {
    const router = useRouter();
    const imageUrl = thumbnail ? getImageUrl(thumbnail) : '/images/sp1.jpg';

    const handleCardClick = () => {
        router.push(`/product/${id}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleCardClick();
        }
    };

    return (
        <div
            className={styles.latestProductCard}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
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
