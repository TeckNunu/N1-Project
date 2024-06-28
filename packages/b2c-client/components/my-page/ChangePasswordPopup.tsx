import React from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import request from 'common/utils/http-request';

interface ChangePasswordPopupProps {
    visible: boolean;
    onClose: () => void;
}

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({
    visible,
    onClose,
}) => {
    const [form] = Form.useForm();

    const { mutateAsync: changePassword } = useMutation({
        mutationFn: (data: { oldPassword: string; newPassword: string }) => {
            return request.put('/user-profile/change-password', data);
        },
        onSuccess: () => {
            message.success('Password changed successfully');
            form.resetFields();
            onClose();
        },
        onError: (error: ErrorResponse) => {
            message.error(
                error.response?.data?.message || 'Failed to change password'
            );
        },
    });

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                message.error('Mật khẩu mới không khớp!');
                return;
            }
            await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
        } catch (error) {
            // xử lý khác
        }
    };

    return (
        <Modal
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" onClick={handleOk} type="primary">
                    Submit
                </Button>,
            ]}
            onCancel={onClose}
            onOk={handleOk}
            title="Change Password"
            visible={visible}
        >
            <Form form={form} layout="vertical" name="change_password">
                <Form.Item
                    label="Current Password"
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your current password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your new password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordPopup;
