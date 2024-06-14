import React from 'react';
import type { ProductFeatured } from 'common/types/product';
import { getImageUrl } from 'common/utils/getImageUrl';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    data: Partial<ProductFeatured>;
};

const ProductCardItem: React.FC<Props> = ({ data }) => {
    return (
        <Link className="cursor-pointer" href={`/product/${data?.id}`}>
            <div>
                <Image
                    alt={data?.name ?? ''}
                    className="rounded-t-2xl"
                    height={270}
                    objectFit="cover"
                    src={getImageUrl(data?.thumbnail ?? '')}
                    style={{
                        height: 270,
                        objectFit: 'cover',
                    }}
                    width={430}
                />
            </div>
            <div className="space-y-5 p-8">
                <div className="text-2xl font-bold">{data?.name}</div>
                <div className="line-clamp-3 text-lg text-slate-500">
                    {data?.description}
                </div>
            </div>
        </Link>
    );
};

export default ProductCardItem;
