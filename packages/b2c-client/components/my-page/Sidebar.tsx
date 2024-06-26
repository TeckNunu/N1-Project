import React from 'react';
import { Menu } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import styles from '~/styles/my-page/Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.profileInfo}>
                <UserOutlined className={styles.profileIcon} />
                <span>campuslukhn</span>
            </div>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item icon={<UserOutlined />} key="1">
                    Hồ Sơ
                </Menu.Item>
                <Menu.Item icon={<ShoppingCartOutlined />} key="2">
                    Đơn Mua
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;
