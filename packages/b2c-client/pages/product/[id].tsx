import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as request from 'common/utils/http-request';
import { useRouter } from 'next/router';
import { QueryResponseGetOneType } from 'common/types';
import { Product } from 'common/types/product';
import { Spin } from 'antd';
import LatestProductList from '~/components/common/latest-product';
import ProductDetail from '~/components/product/product-details';
import { NextPageWithLayout } from '../_app';

const ProductDetailPage: NextPageWithLayout = () => {
    const { query } = useRouter();

    const { data, isFetching } = useQuery<QueryResponseGetOneType<Product>>({
        queryKey: ['product-public-info', query?.id],
        queryFn: () =>
            request
                .get(`/productPublicInfo/${query?.id}`)
                .then((res) => res.data),
        enabled: !!query?.id,
    });
    return (
        <div className="mt-20 flex space-x-32 px-10">
            <div className="sticky top-10 h-[90vh] w-[350px] min-w-[350px]">
                <LatestProductList />
            </div>
            <div className="flex-1">
                <Spin spinning={isFetching}>
                    <ProductDetail data={data?.data} />
                </Spin>
            </div>
        </div>
    );
};

ProductDetailPage.title = 'Thông tin sản phẩm';

export default ProductDetailPage;
