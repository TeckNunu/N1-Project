import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, Layout, Menu } from 'antd';
import LatestProductCard from './LatestProductCard';
import styles from '../../styles/Sidebar.module.css';

const { Sider } = Layout;
const { Search } = Input;

type SidebarProps = {
    categories: {
        id: string;
        name: string;
    }[];
    brands: {
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
    setBrand: (brand: string) => void;
    handleResetFilters: () => void;
    handleSearch: (
        page: number,
        sort?: string,
        sortOrder?: string,
        category?: string,
        searchTerm?: string,
        pageSize?: number,
        brand?: string
    ) => void;
    currentSort?: string;
    currentSortOrder?: string;
    currentCategory?: string;
    currentBrand?: string;
};

const Sidebar: React.FC<SidebarProps> = ({
    categories = [],
    brands = [],
    latestProducts = [],
    setCategory,
    setBrand,
    handleResetFilters,
    handleSearch,
    currentSort,
    currentSortOrder,
    currentCategory,
    currentBrand,
}) => {
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [expandedBrands, setExpandedBrands] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(currentCategory);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
        currentBrand
    );

    useEffect(() => {
        setSelectedCategory(currentCategory);
    }, [currentCategory]);

    useEffect(() => {
        setSelectedBrand(currentBrand);
    }, [currentBrand]);

    const handleCategoryChange = (category: string) => {
        setCategory(category);
        setSelectedCategory(category);
        handleSearch(
            1,
            currentSort,
            currentSortOrder,
            category,
            undefined,
            undefined,
            selectedBrand
        );
    };

    const handleBrandChange = (brand: string) => {
        setBrand(brand);
        setSelectedBrand(brand);
        handleSearch(
            1,
            currentSort,
            currentSortOrder,
            selectedCategory,
            undefined,
            undefined,
            brand
        );
    };

    const onSearch = (value: string) => {
        handleSearch(
            1,
            currentSort,
            currentSortOrder,
            selectedCategory,
            value,
            undefined,
            selectedBrand
        );
    };

    const visibleCategories = expandedCategories
        ? categories
        : categories.slice(0, 3);
    const visibleBrands = expandedBrands ? brands : brands.slice(0, 3);

    return (
        <Sider className={styles.sidebar} width={240}>
            <div className={styles.searchSection}>
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
            <div className={styles.menuSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>Thương Hiệu</span>
                </div>
                <div className={styles.checkboxGroup}>
                    {visibleBrands.map((brand) => (
                        <Checkbox
                            checked={selectedBrand === brand.id}
                            className={styles.checkbox}
                            key={brand.id}
                            onChange={() => handleBrandChange(brand.id)}
                        >
                            {brand.name}
                        </Checkbox>
                    ))}
                    {brands.length > 3 && (
                        <div key="toggle">
                            <Button
                                className={styles.toggleButton}
                                onClick={() =>
                                    setExpandedBrands(!expandedBrands)
                                }
                                type="link"
                            >
                                {expandedBrands ? 'Rút gọn' : 'Thêm'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Button
                className={styles.resetButton}
                onClick={handleResetFilters}
                type="link"
            >
                Xóa bộ lọc
            </Button>
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
            <div className={styles.contactsSection}>
                <div className={styles.menuTitle}>
                    <span className={styles.menuTitleText}>Liên hệ</span>
                </div>
                <ul className={styles.contactList}>
                    <li>Email: contact@example.com</li>
                    <li>Phone: +123 456 789</li>
                    <li>Address: 123 Main Street</li>
                </ul>
            </div>
        </Sider>
    );
};

Sidebar.defaultProps = {
    currentSort: '',
    currentSortOrder: '',
    currentCategory: '',
    currentBrand: '',
};

export default Sidebar;
