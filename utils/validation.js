import * as Yup from "yup";

export const validateContact = async (data) => {
  const schema = Yup.object().shape({
    userId: Yup.number().required("User ID is required"),
    name: Yup.string()
      .required("Name is required")
      .max(100, "Name is too long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().optional(),
    timezone: Yup.string().required("Timezone is required"),
  });

  await schema.validate(data, { abortEarly: false });
};
