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

const isLeadsResponse = (object: object): object is LeadsResponseProps => 'next' in object && 'results' in object;

const isPhoneNumber = (phoneNumber: string) => phoneNumber?.length === 10 && Number.isInteger(Number(phoneNumber));

const createFormData = async ({ firstName, lastName, email, phoneNumber }: FormData, community_id: string) => {
  const form = new FormData();
  form.append('community_id', community_id);
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

const foundDuplicatePhoneNumber = (results: Array<LeadProps>, phoneNumber: string) =>
  !results.every(lead => lead.phone !== phoneNumber);

const checkForDuplicatePhoneNumber = async (phoneNumber: string, headers: object) => {
  const options = {
    method: 'GET',
    headers,
  };

  let response = (await getLeads({
    url: `https://api.talkfurther.com/api/v1/leads?community_id=${process.env.COMMUNITY_ID}`,
    ...options,
  })) as LeadsResponseProps;

  if (!isLeadsResponse(response as object)) {
    return response;
  }

  let foundDuplicate = false;
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

  if (validateData({ ...props })) {
    return 'Missing data';
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Api-Key ${process.env.ZAPIER_KEY}`,
  };

  const isValidated = await checkForDuplicatePhoneNumber(props.phoneNumber, headers);

  if (isValidated as unknown as boolean) {
    return 'Duplicate phone number found';
  }

  sendGTMEvent({ event: 'form-submit', value: { props } });
  const form = await createFormData({ ...props }, process.env.COMMUNITY_ID);

  const options = {
    method: 'POST',
    url: 'https://api.talkfurther.com/api/chat/leads/ingestion/zapier-webhook',
    headers,
    data: form,
  };

  try {
    const response = await axios(options);

    return response.data;
  } catch (error) {
    return { error };
  }
};
