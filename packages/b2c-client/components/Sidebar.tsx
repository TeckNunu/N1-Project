import React, { useState } from 'react';
import { Button, Input, Layout, Menu } from 'antd';
import LatestProductCard from './LatestProductCard';
import styles from '../styles/Sidebar.module.css';

const { Sider } = Layout;
const { Search } = Input;

type SidebarProps = {
    categories: {
        id: string;
        name: string;
    }[];
    latestProducts: {
        id: string;
        name: string;
        discount_price: number;
        thumbnail: string;
    }[];
    setCategory: (category: string) => void;
    handleSearch: (
        page: number,
        sort?: string,
        sortOrder?: string,
        category?: string,
        searchTerm?: string
    ) => void;
    currentSort?: string;
    currentSortOrder?: string;
};

const Sidebar: React.FC<SidebarProps> = ({
    categories = [],
    latestProducts = [],
    setCategory,
    handleSearch,
    currentSort,
    currentSortOrder,
}) => {
    const [expanded, setExpanded] = useState(false);

    const handleCategoryChange = (category: string) => {
        setCategory(category);
        handleSearch(1, currentSort, currentSortOrder, category);
    };

    const onSearch = (value: string) => {
        handleSearch(1, currentSort, currentSortOrder, undefined, value);
    };

    const visibleCategories = expanded ? categories : categories.slice(0, 3);

    return (
        <Sider className={styles.sidebar} width={240}>
            <div
                className={`${styles.searchSection} ${styles.customEnterButton}`}
            >
                <Search
                    enterButton
                    onSearch={onSearch}
                    placeholder="Tìm kiếm..."
                />
            </div>
            <div className={styles.menuSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>
                        Tất Cả Danh Mục
                    </span>
                </div>
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
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
                                onClick={() => setExpanded(!expanded)}
                                type="link"
                            >
                                {expanded ? 'Rút gọn' : 'Thêm'}
                            </Button>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
            <div className={styles.divider} />
            <div className={styles.latestProductsSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>
                        Sản phẩm mới nhất
                    </span>
                </div>
                {latestProducts.map((product) => (
                    <LatestProductCard
                        discount_price={product.discount_price}
                        key={product.id}
                        name={product.name}
                        thumbnail={product.thumbnail}
                    />
                ))}
            </div>
        </Sider>
    );
};

Sidebar.defaultProps = {
    currentSort: '',
    currentSortOrder: '',
};

export default Sidebar;
