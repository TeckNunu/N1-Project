import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import LatestBlogCard from './LatestBlogCard';
import styles from '../../styles/Sidebar.module.css';

const { Sider } = Layout;
const { Search } = Input;

type SidebarProps = {
    categories: {
        id: string;
        name: string;
    }[];
    latestBlogs: {
        id: string;
        title: string;
        thumbnail: string;
    }[];
    setCategory: (category: string) => void;
    handleResetFilters: () => void;
    handleSearch: (
        page: number,
        sort?: string,
        sortOrder?: string,
        category?: string,
        searchTerm?: string,
        pageSize?: number
    ) => void;
    currentCategory?: string;
};

const Sidebar: React.FC<SidebarProps> = ({
    categories = [],
    latestBlogs = [],
    setCategory,
    handleResetFilters,
    handleSearch,
    currentCategory,
}) => {
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [showAllBlogs, setShowAllBlogs] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(currentCategory);

    const router = useRouter();

    useEffect(() => {
        setSelectedCategory(currentCategory);
    }, [currentCategory]);

    const handleCategoryChange = (category: string) => {
        if (selectedCategory === category) {
            setCategory('');
            setSelectedCategory('');
            handleSearch(1, undefined, undefined, '');
        } else {
            setCategory(category);
            setSelectedCategory(category);
            handleSearch(1, undefined, undefined, category);
        }
    };

    const onSearch = (value: string) => {
        handleSearch(1, undefined, undefined, selectedCategory, value);
    };

    const visibleCategories = expandedCategories
        ? categories
        : categories.slice(0, 3);

    return (
        <Sider className={styles.sidebar} width={300}>
            <div className={styles.searchSection}>
                <Search
                    enterButton
                    onSearch={onSearch}
                    placeholder="Nhập tên blog để tìm kiếm..."
                />
            </div>
            <div className={styles.menuSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>
                        Tất Cả Danh Mục
                    </span>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedCategory || '']}
                    style={{ borderRight: 0 }}
                >
                    {visibleCategories.map((category) => (
                        <Menu.Item
                            className={styles.selectedItem}
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            {category.name}
                        </Menu.Item>
                    ))}
                    {categories.length > 3 && (
                        <Menu.Item className={styles.selectedItem} key="toggle">
                            <Button
                                className={styles.toggleButton}
                                onClick={() =>
                                    setExpandedCategories(!expandedCategories)
                                }
                                type="link"
                            >
                                {expandedCategories ? 'Rút gọn' : 'Thêm'}
                            </Button>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
            <Button
                className={styles.resetButton}
                onClick={handleResetFilters}
                type="link"
            >
                Xóa bộ lọc
            </Button>
            <div className={styles.divider} />
            <div className={styles.latestBlogsSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>Blog mới nhất</span>
                </div>
                {latestBlogs
                    .slice(0, showAllBlogs ? latestBlogs.length : 4)
                    .map((blog) => (
                        <LatestBlogCard key={blog.id} {...blog} />
                    ))}
                <Button
                    className={styles.toggleButton}
                    onClick={() => setShowAllBlogs(!showAllBlogs)}
                    type="link"
                >
                    {showAllBlogs ? 'Rút gọn' : 'Xem thêm'}
                </Button>
            </div>
            <div className={styles.contactsSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>Liên hệ</span>
                </div>
                <ul className={styles.contactList}>
                    <li>Email: blogcontact@example.com</li>
                    <li>Điện thoại: (123) 456-7890</li>
                    <li>Địa chỉ: 123 Đường Blog, Thành phố Blog, PC 12345</li>
                    <li>
                        <button
                            className={styles.contactDetailButton}
                            onClick={() => router.push('/contact')}
                            type="button"
                        >
                            Thông tin chi tiết
                        </button>
                    </li>
                </ul>
            </div>
        </Sider>
    );
};

Sidebar.defaultProps = {
    currentCategory: '',
};

export default Sidebar;