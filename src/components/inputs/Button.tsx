import type { ButtonHTMLAttributes, FC } from 'react';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button className="w-1/2 rounded-full bg-blue-400 p-4 hover:bg-blue-600 disabled:bg-red-900" {...props}>
    {children}
  </button>
);

export default Button;
