import MainBanner from '~/components/home-page/main-banner';
import { NextPageWithLayout } from './_app';
import ListProductFeatured from '~/components/home-page/product-featured';

const HomePage: NextPageWithLayout = () => {
    return (
        <div className="space-y-10">
            <MainBanner />
            <div className="flex space-x-10 px-10">
                <div className="sticky top-10 h-[90vh] w-[350px] bg-rose-300">
                    sider
                </div>
                <div className="container flex-1">
                    <ListProductFeatured />
                </div>
            </div>
        </div>
    );
};

HomePage.title = 'Trang chủ';

export default HomePage;
