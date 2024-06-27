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
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
        useState(false);

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
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                dob: initialValues.dob ? moment(initialValues.dob) : null,
            });
            setUploadedImageName(avatarUrl);
        }
    }, [initialValues, avatarUrl, form]);

    const handleOk = async () => {
        setIsConfirmationModalVisible(true);
    };

    const handleConfirmOk = async () => {
        try {
            const values = await form.validateFields();
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
            const imageName = newUploadedImageName.split('/').pop();

            const updateData = {
                ...values,
                gender: values.gender === 'Nam' ? 'MALE' : 'FEMALE',
                image: imageName || '',
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
            };

            // Loại bỏ dữ liệu ảnh từ values trước khi gửi yêu cầu PUT, ko gửi ảnh cùng Put
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
                <Form
                    form={form}
                    initialValues={{
                        ...initialValues,
                        dob: initialValues.dob
                            ? moment(initialValues.dob)
                            : null,
                    }}
                    layout="horizontal" // Set the form layout to horizontal
                    name="edit_profile"
                >
                    <div className={styles.formContent}>
                        <div className={styles.formLeft}>
                            <Form.Item
                                label="Name"
                                name="name"
                                {...formItemLayout}
                            >
                                <Input />
                            </Form.Item>
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
                                valuePropName="fileList"
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
