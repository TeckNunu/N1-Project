import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Input,
    message,
    Spin,
    Typography,
    Upload,
    UploadFile,
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import request, { get } from 'common/utils/http-request';

import { useMutation } from '@tanstack/react-query';
import { getImageUrl } from 'common/utils/getImageUrl';
import moment from 'moment';
import { RcFile } from 'antd/es/upload';
import { toast } from 'react-toastify';
import EditProfilePopup from './EditProfilePopup';
import styles from '~/styles/my-page/ProfileForm.module.css';

const { Title, Text } = Typography;

const ProfileForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadedImageName, setUploadedImageName] = useState(avatarUrl);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [checkUpdateImg, setCheckUpdateImg] = useState(false);
    const [checkHideImg, setCheckHideImg] = useState(false);

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
        setCheckUpdateImg(false);
    }, [form, checkUpdateImg]);

    const handlePopupClose = () => {
        setIsModalVisible(false);
        fetchUserProfile();
    };

    const { mutateAsync: uploadFileTrigger } = useMutation({
        mutationFn: (files: RcFile[]) => {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            return request.post('upload', formData).then((res) => res.data);
        },
        onError: () => {
            toast.error('Upload file failed!');
        },
    });

    const { mutateAsync: updateUserImage } = useMutation({
        mutationFn: (image: string) => {
            return request.put('/user-profile/update-image', { image });
        },
        onSuccess: () => {
            message.success('Profile updated successfully');
            setFileList([]);
            setUploadedImageName('');
            setCheckUpdateImg(true);
            setCheckHideImg(false);
        },
        onError: (err) => {
            const error = err as Error;
            message.error(error.message || 'Failed to update profile');
        },
    });

    const beforeUpload = (file: UploadFile) => {
        const isImage = file.type && file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return Upload.LIST_IGNORE;
        }
        return isImage;
    };

    const handleChange = ({
        fileList: newFileList,
    }: {
        fileList: UploadFile[];
    }) => setFileList(newFileList);

    const normFile = (e: { fileList: UploadFile[] }) => {
        return e?.fileList;
    };

    const handleUpdateImage = async () => {
        try {
            let newUploadedImageName = uploadedImageName;

            if (fileList.length > 0) {
                const fileListToUpload = fileList.map(
                    (file) => file.originFileObj as RcFile
                );

                if (fileListToUpload.length > 0) {
                    const uploadResponse =
                        await uploadFileTrigger(fileListToUpload);
                    const { imageUrls } = uploadResponse;

                    if (imageUrls && imageUrls.length > 0) {
                        [newUploadedImageName] = imageUrls;
                        setUploadedImageName(newUploadedImageName);
                    } else {
                        throw new Error(
                            'Image upload failed, no image URLs returned'
                        );
                    }
                }
            }

            // Loại bỏ phần URL khỏi tên ảnh, chỉ lưu tên ảnh
            const imageName = `${newUploadedImageName.split('/').pop()}`;

            await updateUserImage(imageName);
        } catch (err) {
            const error = err as Error;
            message.error(error.message || 'Failed to update profile');
        }
    };

    const handleDisplayImg = () => {
        setCheckHideImg(true);
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
                            <Form.Item
                                getValueFromEvent={normFile}
                                name="avatar"
                                valuePropName="fileList"
                            >
                                <Upload
                                    beforeUpload={beforeUpload}
                                    className={styles.uploadContainer}
                                    fileList={fileList}
                                    listType="picture"
                                    maxCount={1}
                                    onChange={handleChange}
                                    showUploadList={checkHideImg}
                                >
                                    <Button
                                        className={styles.btnUpdateImg}
                                        icon={<UploadOutlined />}
                                        onClick={handleDisplayImg}
                                    >
                                        Chọn Ảnh
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Button
                                className={styles.btnUpdateImg}
                                icon={<UploadOutlined />}
                                onClick={handleUpdateImage}
                                style={{
                                    display:
                                        fileList.length > 0 ? 'block' : 'none',
                                }}
                            >
                                Cập nhật
                            </Button>
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
