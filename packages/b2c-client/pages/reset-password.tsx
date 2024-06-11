import React, { useState } from 'react';
import { Form, Input } from 'antd';
import Button from 'common/components/button';
import { useRouter } from 'next/router';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import * as request from 'common/utils/http-request';
import { useMutation } from '@tanstack/react-query';

const ResetPasswordForm: React.FC = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { email } = router.query;

    const { mutate: resetPassword, isPending: resetPasswordIsPending } =
        useMutation({
            mutationFn: async (data: { email: string; password: string }) => {
                return request
                    .post('/auth/change-password', data)
                    .then((res) => res.data);
            },
            onSuccess: (res) => {
                toast.success(res.message);
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            },
            onError: (
                error: AxiosError<AxiosResponse<{ message: string }>>
            ) => {
                toast.error(
                    (error.response?.data as unknown as { message: string })
                        .message
                );
            },
        });

    const onFinish = (values: {
        password: string;
        confirmPassword: string;
    }) => {
        const emailString = Array.isArray(email) ? email[0] : email;

        if (emailString) {
            setLoading(true);
            resetPassword({ email: emailString, password: values.password });
            setLoading(false);
        }
    };

    const onSubmit = () => {
        form.submit();
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
            <div className="max-w-lg rounded-lg bg-white p-8 text-center shadow-md">
                <h2 className="mb-8 text-3xl font-bold">Reset Password</h2>
                <Form
                    className="no-scrollbar min-w-[400px] overflow-auto"
                    disabled={loading || resetPasswordIsPending}
                    form={form}
                    layout="vertical"
                    name="reset_password"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your new password!',
                            },
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                        dependencies={['password']}
                        hasFeedback
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'The two passwords that you entered do not match!'
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button label="Reset password" onClick={onSubmit} />
                    </Form.Item>
                </Form>
                {/* <div className="flex w-full justify-center">
                    <div className="w-1/2">
                        <Button
                            label="Back to home"
                            onClick={() => {
                                router.push('/');
                            }}
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ResetPasswordForm;
