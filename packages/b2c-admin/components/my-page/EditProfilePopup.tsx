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
import { RcFile, UploadFile } from 'antd/es/upload';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import request, { get } from 'common/utils/http-request';
import { getImageUrl } from 'common/utils/getImageUrl';
import styles from '~/styles/my-page/EditProfilePopup.module.css';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string | null;
    address: string;
    image: string;
}

interface EditProfilePopupProps {
    visible: boolean;
    onClose: () => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
    visible,
    onClose,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedImageName, setUploadedImageName] = useState('');
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
        useState(false);
    const [initialValues, setInitialValues] = useState<UserProfile | null>(
        null
    );

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

    const { mutateAsync: updateUserProfile } = useMutation({
        mutationFn: (data: Partial<UserProfile>) => {
            return request.put('/user-profile/update', data);
        },
        onSuccess: () => {
            message.success('Profile updated successfully');
            form.resetFields();
            setFileList([]);
            setUploadedImageName('');
            onClose();
        },
        onError: (err) => {
            const error = err as Error;
            message.error(error.message || 'Failed to update profile');
        },
    });

    useEffect(() => {
        if (visible) {
            const fetchUserProfile = async () => {
                try {
                    const response = await get('/user-profile');
                    const userData: UserProfile = response.data.data;
                    setInitialValues(userData);
                    form.setFieldsValue({
                        ...userData,
                        gender: userData.gender === 'MALE' ? 'Nam' : 'Nữ',
                        dob: userData.dob
                            ? moment(userData.dob, 'YYYY-MM-DD')
                            : null,
                    });
                    setUploadedImageName(getImageUrl(userData.image));
                    setFileList([]);
                } catch (error) {
                    message.error('Failed to load user profile');
                }
            };

            fetchUserProfile();
        }
    }, [visible, form]);

    const handleOk = async () => {
        setIsConfirmationModalVisible(true);
    };

    const handleConfirmOk = async () => {
        try {
            const values = await form.validateFields();

            // Trimming whitespace from string fields
            const trimmedValues = {
                ...values,
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                address: values.address.trim(),
            };

            let newUploadedImageName = uploadedImageName;

            const profileChanged = () => {
                if (!initialValues) return true;

                const initialValuesFormatted = {
                    ...initialValues,
                    dob: initialValues.dob
                        ? moment(initialValues.dob, 'YYYY-MM-DD')
                        : null,
                };

                return (
                    trimmedValues.name !== initialValuesFormatted.name ||
                    trimmedValues.phone !== initialValuesFormatted.phone ||
                    trimmedValues.gender !==
                        (initialValuesFormatted.gender === 'MALE'
                            ? 'Nam'
                            : 'Nữ') ||
                    (trimmedValues.dob &&
                        trimmedValues.dob.format('YYYY-MM-DD') !==
                            initialValuesFormatted.dob?.format('YYYY-MM-DD')) ||
                    trimmedValues.address !== initialValuesFormatted.address ||
                    fileList.length > 0
                );
            };

            if (!profileChanged()) {
                message.warning('No changes detected, update not required.');
                setIsConfirmationModalVisible(false);
                return;
            }

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

            const imageName = newUploadedImageName.split('/').pop();

            const updateData = {
                ...trimmedValues,
                gender: trimmedValues.gender === 'Nam' ? 'MALE' : 'FEMALE',
                image: imageName || '',
                dob: trimmedValues.dob
                    ? trimmedValues.dob.format('YYYY-MM-DD')
                    : null,
            };

            delete updateData.avatar;

            await updateUserProfile(updateData);
            setIsConfirmationModalVisible(false);
        } catch (err) {
            const error = err as Error;
            message.error(error.message || 'Failed to update profile');
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
        return isImage;
    };

    const normFile = (e: { fileList: UploadFile[] }) => {
        return e?.fileList;
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
        <>
            <Modal
                className={styles.editProfilePopup}
                onCancel={onClose}
                onOk={handleOk}
                open={visible}
                title="Edit Profile"
            >
                <Form form={form} layout="horizontal" name="edit_profile">
                    <div className={styles.formContent}>
                        <div className={styles.formLeft}>
                            <Form.Item
                                label="Name"
                                name="name"
                                {...formItemLayout}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <p className={styles.emailNote}>
                                Không được thay đổi Email
                            </p>
                            <Form.Item
                                label="Email"
                                name="email"
                                {...formItemLayout}
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                {...formItemLayout}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your phone number!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                {...formItemLayout}
                            >
                                <Radio.Group>
                                    <Radio value="Nam">Nam</Radio>
                                    <Radio value="Nữ">Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label="Ngày sinh"
                                name="dob"
                                {...formItemLayout}
                            >
                                <DatePicker
                                    disabledDate={(current) =>
                                        current &&
                                        current > moment().endOf('day')
                                    }
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                {...formItemLayout}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your address!',
                                    },
                                ]}
                            >
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
                            <Form.Item
                                getValueFromEvent={normFile}
                                name="avatar"
                            >
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
            <Modal
                className={styles.centeredModal}
                onCancel={() => setIsConfirmationModalVisible(false)}
                onOk={handleConfirmOk}
                open={isConfirmationModalVisible}
                title="Confirm Update"
            >
                <p>Bạn có chắc chắn muốn cập nhật thông tin không?</p>
            </Modal>
        </>
    );
};

export default EditProfilePopup;
