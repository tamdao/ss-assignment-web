import React, { ReactNode } from 'react';
import styles from './Button.module.css';

interface IProps {
  type?: 'primary' | 'secondary';
  size?: 'small' | 'normal';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<IProps> = ({
  type = 'primary',
  size = 'normal',
  onClick,
  children,
  disabled,
}) => {
  const classNames = `${styles.Button} ${styles[type]} ${styles[size]}`;
  return (
    <button className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
