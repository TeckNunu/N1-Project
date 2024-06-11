import MainBanner from '~/components/home-page/main-banner';
import { NextPageWithLayout } from './_app';

const HomePage: NextPageWithLayout = () => {
    return (
        <div>
            <MainBanner />
        </div>
    );
};

export default HomePage;

HomePage.title = 'Trang chủ';
