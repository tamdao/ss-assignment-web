import React, { ReactNode } from 'react';
import styles from './Button.module.css';

interface IProps {
  type?: 'primary' | 'secondary';
  size?: 'small' | 'normal';
  children: ReactNode;
  onClick?: () => void;
}

const Button: React.FC<IProps> = ({
  type = 'primary',
  size = 'normal',
  onClick,
  children,
}) => {
  const classNames = `${styles.Button} ${styles[type]} ${styles[size]}`;
  return (
    <button className={classNames} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
