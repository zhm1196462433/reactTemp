import React from 'react';

import logo from '@/assets/img/logo.svg';
import styles from './PassportLayout.css';

export default function PassportLayout({ children }) {
  const title = process.env.TITLE;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" />
        <h1 title="Web Management System">{title}</h1>
      </div>
      <div className={styles.slogan}>{title}是一个中后台管理系统通用的样板项目</div>
      {children}
    </div>
  );
}
