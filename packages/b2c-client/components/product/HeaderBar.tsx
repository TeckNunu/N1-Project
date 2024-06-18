import React, { useEffect, useState } from 'react';
import { Dropdown, Layout, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from '../../styles/HeaderBar.module.css';

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
    currentSort: string;
    currentSortOrder: string;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
    setSort,
    setSortOrder,
    handleSearch,
    currentSort,
    currentSortOrder,
}) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        const selected: string[] = [];
        if (currentSort === 'updatedAt' && currentSortOrder === 'desc') {
            selected.push('2');
        }
        if (currentSort === 'discount_price') {
            selected.push(`discount_price-${currentSortOrder}`);
        }
        setSelectedItems(selected);
    }, [currentSort, currentSortOrder]);

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
