import { MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { get } from 'common/utils/http-request';
import { getImageUrl } from 'common/utils/getImageUrl';
import { useAuth } from '~/hooks/useAuth';
import useLoginModal from '~/hooks/useLoginModal';
import useRegisterModal from '~/hooks/useRegisterModal';
import Search from './search';
import CartIcon from './cart-icon';
import EditProfilePopup from '../../my-page/EditProfilePopup';
import ChangePasswordPopup from '~/components/my-page/ChangePasswordPopup';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string | null;
    address: string;
}

const Header = () => {
    const auth = useAuth();
    const router = useRouter();
    const { onOpen: openLoginModal } = useLoginModal();
    const { onOpen: openRegisterModal } = useRegisterModal();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isChangePasswordPopupVisible, setIsChangePasswordPopupVisible] =
        useState(false);

    const fetchUserImage = async () => {
        try {
            const response = await get('/user-image');
            const imageUrl = getImageUrl(response.data.data.image);
            setUserImage(imageUrl);
        } catch (error) {
            //
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await get('/user-profile');
            setUserProfile(response.data.data);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if (auth) {
            fetchUserImage();
            fetchUserProfile();
        } else {
            setUserImage(null);
            setUserProfile(null);
        }
    }, [auth]);

    const logOut = () => {
        Cookies.remove('accessTokenClient');
        setTimeout(() => {
            router.reload();
        }, 200);
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    onClick={() => setIsProfilePopupVisible(true)}
                    role="presentation"
                >
                    Thông tin
                </div>
            ),
        },
        {
            key: '5',
            label: (
                <div
                    onClick={() => setIsChangePasswordPopupVisible(true)}
                    role="presentation"
                >
                    Đổi mật khẩu
                </div>
            ),
        },
        {
            key: 'myOrder',
            label: (
                <div
                    onClick={() => router.push('/my-page/my-order')}
                    role="presentation"
                >
                    Đơn mua
                </div>
            ),
        },
        {
            key: '4',
            label: (
                <div
                    className="text-rose-500"
                    onClick={logOut}
                    role="presentation"
                >
                    Đăng xuất
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="container flex h-[76px] w-full items-center justify-between">
                <Link href="/">
                    <div className="flex select-none flex-col items-center gap-0 uppercase">
                        <div className="text-lg leading-4 text-rose-600">
                            The
                        </div>
                        <div className="text-2xl font-bold">Perfume</div>
                    </div>
                </Link>
                <div>
                    <Search />
                </div>
                <div className="flex items-center gap-8">
                    <CartIcon />
                    {auth ? (
                        <div>
                            <Dropdown
                                menu={{ items }}
                                overlayStyle={{
                                    width: 250,
                                }}
                                placement="bottomRight"
                            >
                                <div
                                    className="flex cursor-pointer space-x-3 rounded-full border px-3 py-1"
                                    onClick={() => router.push('/my-page')}
                                    role="presentation"
                                >
                                    {userImage ? (
                                        <Image
                                            alt="avatar"
                                            className="rounded-full"
                                            height={40}
                                            src={userImage}
                                            width={40}
                                        />
                                    ) : (
                                        <Image
                                            alt="avatar"
                                            className="rounded-full"
                                            height={40}
                                            src="/images/placeholder.jpg"
                                            width={40}
                                        />
                                    )}
                                    <MenuOutlined />
                                </div>
                            </Dropdown>
                            {userProfile && (
                                <EditProfilePopup
                                    onClose={() =>
                                        setIsProfilePopupVisible(false)
                                    }
                                    visible={isProfilePopupVisible}
                                />
                            )}
                            {userProfile && (
                                <ChangePasswordPopup
                                    onClose={() =>
                                        setIsChangePasswordPopupVisible(false)
                                    }
                                    visible={isChangePasswordPopupVisible}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-3">
                            <Button onClick={openLoginModal} type="primary">
                                Đăng nhập
                            </Button>
                            <Button onClick={openRegisterModal} type="default">
                                Đăng ký
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
