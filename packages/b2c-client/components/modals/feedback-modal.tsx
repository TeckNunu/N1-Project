import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as request from 'common/utils/http-request';
import styles from '../../styles/feedback-modal.module.css';
import { useAuth } from '~/hooks/useAuth';

type FeedbackModalProps = {
    visible: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    visible,
    onClose,
    productId,
    productName,
}) => {
    const [form] = Form.useForm();
    const auth = useAuth('client');

    const addFeedback = useMutation({
        mutationFn: async (data: {
            productId: string;
            description: string;
        }) => {
            if (!auth || !(auth as { access_token: string }).access_token) {
                throw new Error('No access token available');
            }

            const token = (auth as { access_token: string }).access_token;

            return request.post('/feedback/add', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Feedback added successfully!');
            onClose();
        },
        onError: () => {
            toast.error('Failed to add feedback.');
        },
    });

    const handleFinish = (values: { description: string }) => {
        addFeedback.mutate({
            productId,
            description: values.description,
        });
    };

    return (
        <Modal
            footer={null}
            onCancel={onClose}
            title="Submit Feedback"
            visible={visible}
        >
            <Form
                className={styles.feedbackForm}
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item label="Product">
                    <Input
                        className={styles.productNameInput}
                        // disabled
                        value={productName}
                    />
                </Form.Item>
                <Form.Item
                    label="Feedback"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your feedback',
                        },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter your feedback"
                        rows={4}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        className={styles.submitButton}
                        htmlType="submit"
                        type="primary"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FeedbackModal;
