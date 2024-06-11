import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Input, List, Menu, Pagination, Spin } from 'antd';
import Link from 'next/link';
import { PAGE_SIZE } from 'common/constant';
import moment from 'moment';
import * as request from 'common/utils/http-request';
import styles from './BlogPage.module.css'; // Import the CSS module

const { Search } = Input;

const BlogPage = () => {
    const [searchParams, setSearchParams] = useState({
        pageSize: PAGE_SIZE,
        currentPage: 1,
    });

    const {
        data: postsData,
        isLoading: postsLoading,
        refetch,
    } = useQuery({
        queryKey: ['posts', searchParams],
        queryFn: () =>
            request
                .get('manage/post', {
                    params: { ...searchParams, sortBy: 'updatedAt' },
                })
                .then((res) => res.data),
    });

    const { data: latestPosts, isLoading: latestPostsLoading } = useQuery({
        queryKey: ['latestPosts'],
        queryFn: () =>
            request
                .get('manage/post', {
                    params: { pageSize: 5, sortBy: 'updatedAt' },
                })
                .then((res) => res.data),
    });
    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => request.get('category').then((res) => res.data),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSearch = (value: any) => {
        setSearchParams((prev) => ({ ...prev, search: value, currentPage: 1 }));
        refetch();
    };

    return (
        <>
            <header className={styles.blogHeader}>
                <div className={styles.headerLogo}>
                    <h1>My Blog</h1>
                </div>
                <Menu mode="horizontal">
                    <Menu.Item key="home">
                        <Link href="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="about">
                        <Link href="/about">About</Link>
                    </Menu.Item>
                    <Menu.Item key="contact">
                        <Link href="/contact">Contact</Link>
                    </Menu.Item>
                </Menu>
            </header>
            <div className={styles.blogContainer}>
                <div className={styles.blogSidebar}>
                    <Search
                        enterButton
                        onSearch={onSearch}
                        placeholder="Search posts"
                    />
                    <div className={styles.blogCategories}>
                        <h3>Categories</h3>
                        <Spin spinning={categoryLoading}>
                            <List
                                dataSource={categories?.data}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <Link href={`/category/${item.id}`}>
                                            {item.name}
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        </Spin>
                    </div>
                    <div className={styles.blogLatestPosts}>
                        <h3>Latest Posts</h3>
                        <Spin spinning={latestPostsLoading}>
                            <List
                                dataSource={latestPosts?.data}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <Link
                                            href={`/marketer/post/${item.id}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </List.Item>
                                )}
                            />
                        </Spin>
                    </div>
                </div>
                <div className={styles.blogMain}>
                    <Spin spinning={postsLoading}>
                        <List
                            dataSource={postsData?.data}
                            grid={{ gutter: 16, column: 2 }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            renderItem={(item: any) => (
                                <List.Item>
                                    <Card
                                        cover={
                                            <img
                                                alt="thumbnail"
                                                src={item.thumbnail}
                                            />
                                        }
                                        extra={
                                            <Link
                                                href={`/marketer/post/${item.id}`}
                                            >
                                                Read more
                                            </Link>
                                        }
                                        title={item.title}
                                    >
                                        <p>{item.description}</p>
                                        <p>
                                            {moment(item.updatedAt).format(
                                                'YYYY-MM-DD'
                                            )}
                                        </p>
                                    </Card>
                                </List.Item>
                            )}
                        />
                        <Pagination
                            current={searchParams.currentPage}
                            onChange={(page, pageSize) => {
                                setSearchParams((prev) => ({
                                    ...prev,
                                    currentPage: page,
                                    pageSize,
                                }));
                                refetch();
                            }}
                            pageSize={searchParams.pageSize}
                            total={postsData?.pagination?.total}
                        />
                    </Spin>
                </div>
            </div>
            <footer className={styles.blogFooter}>
                <p>
                    &copy; {new Date().getFullYear()} My Blog. All rights
                    reserved.
                </p>
            </footer>
        </>
    );
};

export default BlogPage;
