import { sendGTMEvent } from '@next/third-parties/google';
import isEmail from 'validator/lib/isEmail';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const validateData = ({ firstName, lastName, email, phoneNumber }: FormData) =>
  !firstName || !lastName || !email || !phoneNumber;

export const submit = ({ ...props }: FormData) => {
  if (validateData({ ...props })) {
    alert('Missing Data')

    return;
  }
  if( !isEmail(props.email)) {
    alert('Invalid Email')

    return;
  }

  if (props.phoneNumber.length !== 10 && Number.isInteger(Number(props.phoneNumber))) {
    alert('Invalid Phone Number')

    return; 
  }

  sendGTMEvent({ event: 'form-submit', value: { props } })
};
