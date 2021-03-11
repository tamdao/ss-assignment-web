import React from 'react';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import styles from '../SendByEmailSms.module.css';

export const SendByEmailSmsHeader = () => {
  return (
    <div className={styles.Header}>
      <MailOutlineOutlinedIcon fontSize="large" className={styles.HeaderIcon} />{' '}
      Send by email / sms
    </div>
  );
};
