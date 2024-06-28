import React from 'react';
import { Layout } from 'antd';
import Sidebar from '~/components/my-page/Sidebar';
import ProfileForm from '~/components/my-page/ProfileForm';

const { Sider, Content } = Layout;

const MyPage = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider className="site-layout-background" width={300}>
                <Sidebar />
            </Sider>
            <Layout style={{ padding: '24px' }}>
                <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                    <ProfileForm />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MyPage;
