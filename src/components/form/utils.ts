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
    console.log('missing form data');

    return;
  }

  console.log({ ...props });
};
