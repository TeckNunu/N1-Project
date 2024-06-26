import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Spin, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { get } from 'common/utils/http-request';
import { getImageUrl } from 'common/utils/getImageUrl';
import moment from 'moment';
import EditProfilePopup from './EditProfilePopup';
import styles from '~/styles/my-page/ProfileForm.module.css';

const { Title, Text } = Typography;

const ProfileForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const mapGender = (gender: string) => {
        if (gender === 'MALE') return 'Nam';
        if (gender === 'FEMALE') return 'Nữ';
        return 'Khác';
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await get('/user-profile');
            const userData = response.data.data;

            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                gender: mapGender(userData.gender),
                dob: userData.dob
                    ? moment(userData.dob).format('DD/MM/YYYY')
                    : '',
                address: userData.address,
            });

            if (userData.image) {
                setAvatarUrl(getImageUrl(userData.image));
            }
        } catch (error) {
            message.error('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [form]);

    const handlePopupClose = () => {
        setIsModalVisible(false);
        fetchUserProfile();
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    return (
        <Spin spinning={loading}>
            <div className={styles.profileFormContainer}>
                <Title level={3}>Hồ Sơ Của Tôi</Title>
                <Text>Quản lý thông tin hồ sơ để bảo mật tài khoản</Text>
                <Form
                    form={form}
                    initialValues={{
                        name: '',
                        email: '',
                        phone: '',
                        gender: 'Khác',
                        dob: '',
                        address: '',
                    }}
                    layout="horizontal"
                    name="profile"
                    style={{ marginTop: '20px' }}
                >
                    <div className={styles.formContent}>
                        <div className={styles.formLeft}>
                            <Form.Item
                                {...formItemLayout}
                                label="Name"
                                name="name"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Email"
                                name="email"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Số điện thoại"
                                name="phone"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Giới tính"
                                name="gender"
                            >
                                <Input
                                    readOnly
                                    value={form.getFieldValue('gender')}
                                />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Ngày sinh"
                                name="dob"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Địa chỉ"
                                name="address"
                            >
                                <Input readOnly />
                            </Form.Item>
                        </div>
                        <div className={styles.verticalDivider} />
                        <div className={styles.formRight}>
                            {avatarUrl ? (
                                <img
                                    alt="Avatar"
                                    className={styles.avatarImage}
                                    src={avatarUrl}
                                />
                            ) : (
                                <UserOutlined className={styles.profileIcon} />
                            )}
                            <div>Avatar</div>
                        </div>
                    </div>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            onClick={() => setIsModalVisible(true)}
                            type="primary"
                        >
                            Sửa hồ sơ
                        </Button>
                    </Form.Item>
                </Form>
                <EditProfilePopup
                    avatarUrl={avatarUrl}
                    initialValues={form.getFieldsValue()}
                    onClose={handlePopupClose}
                    visible={isModalVisible}
                />
            </div>
        </Spin>
    );
};

export default ProfileForm;
