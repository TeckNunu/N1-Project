import React from 'react';
import { Card } from 'antd';
import { useRouter } from 'next/router';
import styles from '../../styles/blog/BlogCard.module.css';

type Blog = {
    id: string;
    title: string;
    briefInfo: string;
    thumbnail: string;
};

const BlogCard: React.FC<Blog> = ({ id, title, briefInfo, thumbnail }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/blog/${id}`);
    };

    return (
        <Card
            className={styles.blogCard}
            cover={
                <img alt={title} className={styles.blogImage} src={thumbnail} />
            }
            hoverable
            onClick={handleCardClick}
        >
            <Card.Meta description={briefInfo} title={title} />
        </Card>
    );
};

export default BlogCard;
