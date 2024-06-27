import React from 'react';

import type { FC } from 'react';

interface TextProperties {
    label: string;
    id: string;
    name: string;
}

const TextInput: FC<TextProperties> = ({ label, id, name }) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input type="text" id={id} name={name} />
    </div>
  );

export default TextInput;
