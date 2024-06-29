import isEmail from 'validator/lib/isEmail';

const error = 'border-red-900';
const valid = 'border-slate-900';

export const getBorderColor = (value?: string, type?: string) => {
  if (type === 'tel' && value?.length !== 10) {
    return error;
  }

  if (value && type === 'email' && !isEmail(value)) {
    return error;
  }

  return value ? valid : error;
};
