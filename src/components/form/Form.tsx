'use client';

import React, { useState } from 'react';

import type { FC } from 'react';

import { submit, validateData } from '@/components/form/utils';
import Button from '@/components/inputs/Button';
import Text from '@/components/inputs/Text';

interface FormProps {
  id: string;
}

const Form: FC<FormProps> = ({ id, ...props }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <form
      className="flex w-1/2 flex-col gap-8 rounded-lg border-2 border-slate-900 bg-slate-500 p-8"
      id={id}
      {...props}
    >
      <div className="grid grid-cols-2 gap-8">
        <Text label="First Name" id="firstName" name="firstName" value={firstName} setState={setFirstName} required />
        <Text label="Last Name" id="firstName" name="lastName" value={lastName} setState={setLastName} required />
        <Text label="Email" id="email" name="email" value={email} setState={setEmail} required />
        <Text
          label="Phone Number"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          setState={setPhoneNumber}
          required
        />
      </div>
      <div className="flex content-center justify-center">
        <Button
          type="button"
          disabled={validateData({ firstName, lastName, email, phoneNumber })}
          onClick={() => {
            submit({ firstName, lastName, email, phoneNumber });
          }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Form;
