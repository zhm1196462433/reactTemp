import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, Menu, Icon, Avatar, Spin, Badge, Card, List
} from 'antd';

import styles from './index.css';

const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

function renderUserNotices(notices) {
  return (
    <Fragment>
      <Card title="通知" size="small" className={styles.notices} bodyStyle={{ padding: 0 }}>
        <List>
          {notices.map((notice, i) => (
            <List.Item key={notice.id || i} className={styles.noticeItem}>
              <List.Item.Meta
                avatar={<Avatar icon="user" style={{ backgroundColor: '#4082fa' }} />}
                title={<div className={styles.noticeTitle}>{notice.title}</div>}
                description={<div>{notice.humanizeTime}</div>}
              />
            </List.Item>
          ))}
        </List>
      </Card>
    </Fragment>
  );
}

function renderUserMenu(onMenuClick) {
  return (
    <Menu onClick={onMenuClick}>
      <MenuItem key="userCenter">
        <Icon type="user" />
        <span>个人中心</span>
      </MenuItem>
      <MenuItem key="changePassword">
        <Icon type="lock" />
        <span>修改密码</span>
      </MenuItem>
      <MenuDivider />
      <MenuItem key="logout">
        <Icon type="logout" />
        <span>退出登录</span>
      </MenuItem>
    </Menu>
  );
}

function UserNav({
  notices = [
    { id: '1', title: '君子博学而日参省乎己，则知明而行无过矣。', humanizeTime: '2天前' },
    { id: '2', title: 'From small beginnings comes great things. ', humanizeTime: '1天前' },
    { id: '3', title: 'While there is life, there is hope.', humanizeTime: '3小时前' },
    { id: '4', title: '吾尝终日而思矣，不如须臾之所学也。', humanizeTime: '1分钟前' }
  ],
  profile = {},
  onMenuClick = () => {}
}) {
  return (
    <div className={styles.userNav}>
      <Dropdown overlay={renderUserNotices(notices)} trigger={['click']}>
        <div className={styles.navItem}>
          <Badge count={99} offset={[2, 2]}>
            <Icon type="bell" size="large" className={styles.bell} />
          </Badge>
        </div>
      </Dropdown>
      {profile.name ? (
        <Dropdown overlay={renderUserMenu(onMenuClick)}>
          <div className={styles.navItem}>
            <Avatar
              icon="user"
              src={profile.avatar}
              alt="头像"
              style={{ backgroundColor: '#1890ff' }}
            />
            <span className={styles.name}>{profile.name}</span>
          </div>
        </Dropdown>
      ) : (
        <Spin style={{ margin: '0 10px' }} />
      )}
    </div>
  );
}

UserNav.propTypes = {
  notices: PropTypes.array,
  profile: PropTypes.object,
  onMenuClick: PropTypes.func
};

export default React.memo(UserNav);
