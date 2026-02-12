import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  const buttonClass = className ? `${styles.button} ${variantClass} ${className}` : `${styles.button} ${variantClass}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
