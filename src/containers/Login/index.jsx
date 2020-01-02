import React, { useState } from 'react';
import {
  Form, Input, Button, Icon
} from 'antd';

import useActions from '@/shared/hooks/actions';
import PassportLayout from '@/containers/Layout/PassportLayout';
import Ribbon from './Ribbon';
import { actions as userActions } from '@/store/user';
import styles from './index.css';

const FormItem = Form.Item;

function Login({ form }) {
  const { getFieldDecorator } = form;
  const [submitting, setSubmitting] = useState(false);
  const actions = useActions(userActions);

  const handleSubmit = (e) => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;

      setSubmitting(true);
      actions.login({ ...values }).catch(() => {
        setSubmitting(false);
      });
    });
  };

  return (
    <PassportLayout>
      <Ribbon waves={3} fps={false} debug={false} rotation={35} background width={200} />
      <div className={styles.login}>
        <Form onSubmit={handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '请输入用户名' }
              ]
            })(
              <Input
                prefix={<Icon type="user" />}
                size="large"
                placeholder="用户名"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码' }
              ]
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                size="large"
                placeholder="密码"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              loading={submitting}
              htmlType="submit"
              type="primary"
              size="large"
              style={{ width: '100%' }}
            >
              {submitting ? '登录中...' : '登录'}
            </Button>
          </FormItem>
        </Form>
      </div>
    </PassportLayout>
  );
}

export default Form.create()(Login);
