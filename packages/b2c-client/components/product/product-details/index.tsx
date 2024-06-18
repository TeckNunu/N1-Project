import React from 'react';
import { Product } from 'common/types/product';
import { Button } from 'antd';
import ProductImageSlider from './product-image-slider';
import useCartStore from '~/hooks/useCartStore';

type Props = {
    data?: Product;
};

const ProductDetail: React.FC<Props> = ({ data }) => {
    const { data: cartStorage, addProduct, deleteProduct } = useCartStore();

    if (!data) {
        return <div>Sản phẩm này không tồn tại</div>;
    }

    return (
        <div>
            <div className="flex">
                <ProductImageSlider listImage={data?.product_image ?? []} />
                <div>
                    <div>
                        <Button
                            onClick={() => {
                                if (data?.id) {
                                    addProduct({
                                        productId: data?.id,
                                        quantity: 1,
                                    });
                                }
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div>
                        {cartStorage?.map((item) => (
                            <div key={item?.productId}>
                                <Button
                                    danger
                                    onClick={() => {
                                        if (item?.productId) {
                                            deleteProduct(item.productId);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                                <div>{item?.productId}</div>
                                <div>{item?.quantity}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductDetail.defaultProps = {
    data: undefined,
};

export default ProductDetail;
