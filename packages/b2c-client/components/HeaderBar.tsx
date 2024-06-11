import React, { useState } from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from '../styles/HeaderBar.module.css';

const { Header } = Layout;

type HeaderBarProps = {
    setSort: (sort: string) => void;
    setSortOrder: (sortOrder: string) => void;
    handleSearch: (
        page: number,
        sort?: string,
        sortOrder?: string,
        category?: string,
        searchTerm?: string
    ) => void;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
    setSort,
    setSortOrder,
    handleSearch,
}) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSortChange = (sort: string, sortOrder: string) => {
        setSort(sort);
        setSortOrder(sortOrder);
        handleSearch(1, sort, sortOrder);
    };

    const toggleSelectItem = (key: string) => {
        if (selectedItems.includes(key)) {
            setSelectedItems(selectedItems.filter((item) => item !== key));
        } else {
            setSelectedItems([...selectedItems, key]);
        }
    };

    return (
        <Header className={styles.header}>
            <div className={styles.sortSection}>
                <span className={styles.sortText}>Sắp xếp theo</span>
                <Menu
                    className={styles.menu}
                    mode="horizontal"
                    overflowedIndicator={null}
                >
                    <Menu.Item
                        className={`${styles.menuItem} ${selectedItems.includes('2') ? styles.active : ''}`}
                        key="2"
                        onClick={() => {
                            toggleSelectItem('2');
                            handleSortChange('updatedAt', 'desc');
                        }}
                    >
                        Mới Nhất
                    </Menu.Item>
                    <Menu.Item
                        className={`${styles.menuItem} ${selectedItems.includes('1') ? styles.active : ''}`}
                        key="1"
                        onClick={() => {
                            toggleSelectItem('1');
                            handleSortChange('name', 'asc');
                        }}
                    >
                        Phổ Biến
                    </Menu.Item>
                    <Menu.Item
                        className={`${styles.menuItem} ${selectedItems.includes('3') ? styles.active : ''}`}
                        key="3"
                        onClick={() => {
                            toggleSelectItem('3');
                            handleSortChange('name', 'desc');
                        }}
                    >
                        Bán Chạy
                    </Menu.Item>
                    <Dropdown
                        overlay={
                            <Menu
                                onClick={(e) => {
                                    const sortOrder = e.key as string;
                                    handleSortChange(
                                        'discount_price',
                                        sortOrder
                                    );
                                    toggleSelectItem(
                                        `discount_price-${sortOrder}`
                                    );
                                }}
                            >
                                <Menu.Item key="asc">
                                    Giá thấp đến cao
                                </Menu.Item>
                                <Menu.Item key="desc">
                                    Giá cao đến thấp
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <Menu.Item className={styles.menuItem} key="4">
                            Giá <DownOutlined />
                        </Menu.Item>
                    </Dropdown>
                </Menu>
            </div>
        </Header>
    );
};

export default HeaderBar;
