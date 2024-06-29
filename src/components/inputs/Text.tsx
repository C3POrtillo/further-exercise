'use client';
import React, { useState } from 'react';

import type { FC, InputHTMLAttributes } from 'react';

import { getBorderColor } from '@/components/inputs/utils';

interface TextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const Text: FC<TextProps> = ({ type, label, id, name, value, setState, ...props }) => {
  const [borderColor, setBorderColor] = useState('border-slate-900');

  return (
    <div className="flex flex-col gap-1">
      <label className="text-lg" htmlFor={id}>
        {label}
        {props.required && '*'}
      </label>
      <input
        className={`rounded border-2 ${borderColor} p-4 text-slate-900`}
        type={type || 'text'}
        id={id}
        name={name}
        value={value}
        onChange={e => {
          setState(e.target.value);
          if (props.required) {
            setBorderColor(getBorderColor(e.target.value, type));
          }
        }}
        onClick={() => {
          if (props.required) {
            setBorderColor(getBorderColor(value as string, type));
          }
        }}
        {...props}
      />
    </div>
  );
};

export default Text;
