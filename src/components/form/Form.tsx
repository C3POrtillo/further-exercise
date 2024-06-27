import React from 'react';

import type { FC } from 'react';

import TextInput from '@/components/inputs/TextInput';


const Form: FC = () => (
  <form>
    <div className="grid grid-cols-2 gap-8">
      <TextInput label="First Name" id="firstName" name="firstName"/>
      <TextInput label="Last Name" id="firstName" name="lastName"/>
      <TextInput label="Email" id="email" name="email"/>
      <TextInput label="Phone Number" id="phoneNumber" name="phoneNumber"/>
    </div>
  </form>
)

export default Form;
