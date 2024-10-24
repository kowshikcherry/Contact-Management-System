import * as yup from 'yup';

export const validateAddContact = (contactData) => {
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    timezone: yup.string().required('Timezone is required'),
  });

  return schema.validate(contactData, { abortEarly: false });
};
