import React, { ReactNode } from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styles from './Panel.module.css';

interface IProps {
  header: ReactNode;
  children: ReactNode;
}

const Panel: React.FC<IProps> = ({ header, children }) => (
  <div className={styles.Panel}>
    <div className={styles.Header}>
      {header}
      <ExpandLessIcon fontSize="large" />
    </div>
    <div className={styles.Content}>{children}</div>
  </div>
);

export default Panel;
