import React, { useEffect, useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Radio,
    Upload,
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { UploadFile } from 'antd/es/upload';
import { dropListFiles } from 'common/utils/dropListFiles';
import request from 'common/utils/http-request';
import styles from '~/styles/my-page/EditProfilePopup.module.css';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string | null;
    address: string;
}

interface EditProfilePopupProps {
    visible: boolean;
    onClose: () => void;
    initialValues: UserProfile;
    avatarUrl: string;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
    visible,
    onClose,
    initialValues,
    avatarUrl,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedImageName, setUploadedImageName] = useState(avatarUrl);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                dob: initialValues.dob ? moment(initialValues.dob) : null,
            });
            setUploadedImageName(avatarUrl);
        }
    }, [initialValues, avatarUrl, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { fileNotUpload } = dropListFiles(fileList);

            let newUploadedImageName = uploadedImageName;

            if (fileNotUpload.length > 0) {
                const formData = new FormData();
                fileNotUpload.forEach((file) => formData.append('files', file));

                const uploadResponse = await request.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const [imageUrl] = uploadResponse.data.imageUrls || [];

                if (imageUrl) {
                    // Extract the image name from the URL
                    const imageName = imageUrl.split('/').pop();
                    if (imageName) {
                        newUploadedImageName = imageName;
                        setUploadedImageName(newUploadedImageName);
                    } else {
                        throw new Error(
                            'Failed to extract image name from URL'
                        );
                    }
                } else {
                    throw new Error(
                        'Image upload failed, no image URLs returned'
                    );
                }
            } else {
                const imageName = uploadedImageName.split('/').pop();
                newUploadedImageName = imageName || uploadedImageName;
            }

            const updateData = {
                ...values,
                gender: values.gender === 'Nam' ? 'MALE' : 'FEMALE',
                image: newUploadedImageName,
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
            };

            await request.put('/user-profile/update', updateData);

            message.success('Profile updated successfully');
            form.resetFields();
            setFileList([]);
            setUploadedImageName('');
            onClose();
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const handleChange = ({
        fileList: newFileList,
    }: {
        fileList: UploadFile[];
    }) => setFileList(newFileList);

    const beforeUpload = (file: UploadFile) => {
        const isImage = file.type && file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size && file.size / 1024 / 1024 < 3;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        return isImage && isLt2M;
    };

    return (
        <Modal
            className={styles.editProfilePopup}
            onCancel={onClose}
            onOk={handleOk}
            open={visible}
            title="Edit Profile"
        >
            <Form
                form={form}
                initialValues={initialValues}
                layout="vertical"
                name="edit_profile"
            >
                <div className={styles.formContent}>
                    <div className={styles.formLeft}>
                        <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Giới tính" name="gender">
                            <Radio.Group>
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Ngày sinh" name="dob">
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className={styles.verticalDivider} />
                    <div className={styles.formRight}>
                        {uploadedImageName ? (
                            <img
                                alt="Avatar"
                                className={styles.avatarImage}
                                src={
                                    uploadedImageName.startsWith('http')
                                        ? uploadedImageName
                                        : `/images/${uploadedImageName}`
                                }
                            />
                        ) : (
                            <UserOutlined className={styles.profileIcon} />
                        )}
                        <Form.Item name="avatar">
                            <Upload
                                beforeUpload={beforeUpload}
                                fileList={fileList}
                                listType="picture"
                                maxCount={1}
                                onChange={handleChange}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Chọn Ảnh
                                </Button>
                            </Upload>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default EditProfilePopup;
