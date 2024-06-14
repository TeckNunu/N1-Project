/* eslint-disable @typescript-eslint/no-explicit-any */
import '~/styles/globals.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Spin } from 'common/components/spin';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import { ConfigProvider } from 'antd';
import { DefaultLayout } from '~/components/layouts/default-layout';
import LoginModal from '~/components/modals/login-modal';
import RegisterModal from '~/components/modals/register-modal';

const queryClient = new QueryClient();

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
    P,
    IP
> & {
    getLayout?: (page: ReactElement) => JSX.Element;
    title?: string;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();

    const loadingRef = useRef<unknown | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const start = () => {
            if (loadingRef.current) {
                clearTimeout(loadingRef.current as number);
            }
            loadingRef.current = setTimeout(() => {
                setLoading(true);
            }, 200);
        };
        const end = () => {
            if (loadingRef.current) {
                clearTimeout(loadingRef.current as number);
            }
            setLoading(false);
        };
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', end);
        router.events.on('routeChangeError', end);
        window.addEventListener('showLoading', start);
        window.addEventListener('hideLoading', end);
        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', end);
            router.events.off('routeChangeError', end);
            window.removeEventListener('showLoading', start);
            window.removeEventListener('hideLoading', end);
        };
    }, []);

    const getLayout =
        Component.getLayout ||
        ((page) => <DefaultLayout>{page}</DefaultLayout>);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#F43F5E',
                        algorithm: true,
                    },
                    Spin: {
                        colorPrimary: '#F43F5E',
                    },
                    Pagination: {
                        colorPrimary: '#F43F5E',
                        algorithm: true,
                    },
                },
                token: {
                    fontSize: 12,
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <Spin spinning={loading} />
                <Head>
                    <title>
                        {Component.title ? Component.title : 'Perfume Shop'}
                    </title>
                </Head>
                <ToastContainer />
                <LoginModal />
                <RegisterModal />
                {getLayout(<Component {...pageProps} />)}
            </QueryClientProvider>
        </ConfigProvider>
    );
}
