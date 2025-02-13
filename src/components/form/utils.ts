import { sendGTMEvent } from '@next/third-parties/google';
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface LeadsResponseProps {
  count: number;
  next?: string | null;
  previous?: string | null;
  results?: Array<LeadProps> | null;
}

interface LeadProps {
  lead_id?: number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  date?: string | null;
  financially_unqualified?: null | null;
  move_in_date?: number | null;
  community_id?: number | null;
  community_name?: string | null;
  channel_source?: null | null;
  lead_submitted?: boolean | null;
  device?: null | null;
  traffic_source?: null | null;
  tours_count?: number | null;
  tour_date?: null | null;
  tour_scheduled?: boolean | null;
  tour_confirmed?: boolean | null;
  visitor_uuid?: string | null;
  external_lead_id?: string | null;
}

const contentTypeJSON = {
  'Content-Type': 'application/json',
};

const zapierHeader = {
  Authorization: `Api-Key ${process.env.ZAPIER_KEY}`,
  ...contentTypeJSON,
};

const buildResponse = (...args: string[]) => args.join('\n');

const isLeadsResponse = (object: object): object is LeadsResponseProps => 'next' in object && 'results' in object;

const isPhoneNumber = (phoneNumber: string) => phoneNumber?.length === 10 && Number.isInteger(Number(phoneNumber));

const createFormData = async ({ firstName, lastName, email, phoneNumber }: FormData) => {
  const form = new FormData();
  form.append('first_name', firstName);
  form.append('last_name', lastName);
  form.append('email', email);
  form.append('phone', phoneNumber);

  return form;
};

const getLeads = async (options: object) => {
  try {
    const response = await axios(options);

    return response.data as LeadsResponseProps;
  } catch (error) {
    return error;
  }
};

const foundDuplicatePhoneNumber = (results: Array<LeadProps>, phoneNumber: string) => {
  const found = results.find(lead => lead.phone === phoneNumber);

  return found?.email || false;
};

const checkForDuplicatePhoneNumber = async (phoneNumber: string) => {
  const options = {
    method: 'GET',
    headers: zapierHeader,
  };

  let response = (await getLeads({
    url: `https://api.talkfurther.com/api/v1/leads?community_id=${process.env.COMMUNITY_ID}`,
    ...options,
  })) as LeadsResponseProps;

  if (!isLeadsResponse(response as object)) {
    return response;
  }

  let foundDuplicate: string | boolean = false;
  while (!foundDuplicate && response?.count > 0 && !!response.results?.length) {
    foundDuplicate = foundDuplicatePhoneNumber(response.results, phoneNumber);
    response = (await getLeads({
      url: response.next,
      ...options,
    })) as LeadsResponseProps;
  }

  return foundDuplicate;
};

export const validateData = ({ firstName, lastName, email, phoneNumber }: FormData) =>
  !firstName || !lastName || !isEmail(email) || !isPhoneNumber(phoneNumber);

export const submit = async ({ ...props }: FormData) => {
  if (!process.env.COMMUNITY_ID || !process.env.ZAPIER_KEY) {
    return 'Missing environment variables';
  }

  sendGTMEvent({ event: 'form-submit', value: { props } });

  if (validateData({ ...props })) {
    if (!isEmail(props.email) || !isPhoneNumber(props.phoneNumber)) {
      const form = await createFormData({ ...props });
      const options = {
        method: 'POST',
        url: process.env.GOOGLE_SHEET_URL,
        data: form,
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      const response = 'Invalid email or phone\n';

      try {
        await axios(options);

        return buildResponse(response, 'Successfully submitted to Google Sheets');
      } catch (error) {
        return buildResponse(response, 'Error submitting to Google Sheets');
      }
    }

    return 'Missing data';
  }

  const isValidated = await checkForDuplicatePhoneNumber(props.phoneNumber);

  if (isValidated) {
    if (typeof isValidated === 'string') {
      const response = 'Duplicate phone number registered';

      const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
      };

      const options = {
        method: 'POST',
        url: 'https://api.emailjs.com/api/v1.0/email/send',
        data,
        headers: contentTypeJSON,
      };

      try {
        await axios(options);

        return buildResponse(response, 'An email notification was sent to the registered email');
      } catch (error) {
        return buildResponse(response, 'Failed to send email notification to registered email');
      }
    } else {
      return isValidated;
    }
  }

  const form = await createFormData({ ...props });
  form.append('community_id', process.env.COMMUNITY_ID);

  const options = {
    method: 'POST',
    url: 'https://api.talkfurther.com/api/chat/leads/ingestion/zapier-webhook',
    headers: zapierHeader,
    data: form,
  };

  try {
    const response = await axios(options);

    return response.data;
  } catch (error) {
    return { error };
  }
};
