import React from 'react';
import { Menu } from 'antd';
import {
    IdcardOutlined,
    LockOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import styles from '~/styles/my-page/Sidebar.module.css';

const { SubMenu } = Menu;

const Sidebar = () => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.profileInfo}>
                <UserOutlined className={styles.profileIcon} />
                <div className={styles.profileText}>
                    <span className={styles.profileName}>User Profile</span>
                </div>
            </div>
            <Menu
                defaultOpenKeys={['sub1']}
                defaultSelectedKeys={['1']}
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
            >
                <SubMenu
                    icon={<UserOutlined />}
                    key="sub1"
                    title="Tài Khoản Của Tôi"
                >
                    <Menu.Item icon={<IdcardOutlined />} key="1">
                        Hồ Sơ
                    </Menu.Item>
                    <Menu.Item icon={<LockOutlined />} key="2">
                        Đổi Mật Khẩu
                    </Menu.Item>
                </SubMenu>
                <Menu.Item icon={<ShoppingCartOutlined />} key="3">
                    Đơn Mua
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;
