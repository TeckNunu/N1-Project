import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { MenuOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { get } from 'common/utils/http-request';
import { getImageUrl } from 'common/utils/getImageUrl';
import EditProfilePopup from '../my-page/EditProfilePopup';
import ChangePasswordPopup from '~/components/my-page/ChangePasswordPopup';

type Props = {
    title: string;
};

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string | null;
    address: string;
}

const Header: React.FC<Props> = ({ title }) => {
    const router = useRouter();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);
    const [isChangePasswordPopupVisible, setIsChangePasswordPopupVisible] =
        useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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
        fetchUserImage();
        fetchUserProfile();
    }, []);

    const logOut = () => {
        Cookies.remove('cmsUser');
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
                    Profile
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div
                    onClick={() => setIsChangePasswordPopupVisible(true)}
                    role="presentation"
                >
                    Change Password
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div
                    onClick={() => router.push('/my-page')}
                    role="presentation"
                >
                    My Orders
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
                    Log out
                </div>
            ),
        },
    ];

    return (
        <div className="flex h-[76px] w-full items-center justify-between px-5 shadow-md">
            <div className="text-2xl font-bold uppercase">{title}</div>
            <div>
                <Dropdown
                    menu={{ items }}
                    overlayStyle={{
                        width: 200,
                    }}
                    placement="bottomLeft"
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
                        onClose={() => setIsProfilePopupVisible(false)}
                        visible={isProfilePopupVisible}
                    />
                )}
                {userProfile && (
                    <ChangePasswordPopup
                        onClose={() => setIsChangePasswordPopupVisible(false)}
                        visible={isChangePasswordPopupVisible}
                    />
                )}
            </div>
        </div>
    );
};

export default Header;
