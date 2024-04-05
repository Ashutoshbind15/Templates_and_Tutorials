"use client";

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { z } from "zod";
import axios from "axios";

// Define the Zod schema for validation
const onboardingSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be at least 10 digits" }),
  type: z.string(),
  reference_id: z.string(),
  legal_business_name: z.string(),
  business_type: z.enum(["partnership"]),
  contact_name: z.string(),
  profile: z.object({
    category: z.string(),
    subcategory: z.string(),
    addresses: z.object({
      registered: z.object({
        street1: z.string(),
        street2: z.string(),
        city: z.string(),
        state: z.string(),
        postal_code: z.string(),
        country: z
          .string()
          .length(2, { message: "Country code should be 2 characters" }),
      }),
    }),
  }),
});

// Convert Zod errors to a shape Formik can use
const toFormikValidationSchema = (schema) => {
  return (values) => {
    try {
      schema.parse(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten();
        // Convert Zod's error map to Formik's
        const formikErrors = {};
        Object.keys(errors.fieldErrors).forEach((key) => {
          formikErrors[key] = errors.fieldErrors[key].join(", ");
        });
        return formikErrors;
      }
    }
    return {};
  };
};

const OnboardingForm = () => (
  <div className="min-h-screen flex justify-center items-center bg-slate-100 p-5">
    <Formik
      initialValues={{
        email: "",
        phone: "",
        type: "",
        reference_id: "",
        legal_business_name: "",
        business_type: "",
        contact_name: "",
        profile: {
          category: "",
          subcategory: "",
          addresses: {
            registered: {
              street1: "",
              street2: "",
              city: "",
              state: "",
              postal_code: "",
              country: "",
            },
          },
        },
      }}
      validate={toFormikValidationSchema(onboardingSchema)}
      onSubmit={async (values) => {
        console.log(values);
        await axios.post(`/api/paymentacc`, values);
      }}
    >
      {() => (
        <Form className="w-full max-w-3xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="block text-gray-700 text-lg font-bold mb-2">
            Business Onboarding Form
          </h2>

          {/* Repeat this structure for each input field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <Field
              name="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Additional fields would follow here */}
          {/* Remember to nest `Field` names for `profile` and `addresses` */}
          <div className="mb-4">
            <label
              htmlFor="profile.category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category
            </label>
            <Field
              name="profile.category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="profile.category"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Include all other fields similarly, taking care to structure the name attribute correctly for nested values */}

          {/* Phone Number */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone Number
            </label>
            <Field
              name="phone"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Type
            </label>
            <Field
              as="select"
              name="type"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a type</option>
              {/* Define your types here */}
              <option value="route">Route</option>
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Reference ID */}
          <div className="mb-4">
            <label
              htmlFor="reference_id"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Reference ID
            </label>
            <Field
              name="reference_id"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="reference_id"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Legal Business Name */}
          <div className="mb-4">
            <label
              htmlFor="legal_business_name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Legal Business Name
            </label>
            <Field
              name="legal_business_name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="legal_business_name"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Business Type */}
          <div className="mb-4">
            <label
              htmlFor="business_type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Business Type
            </label>
            <Field
              as="select"
              name="business_type"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a business type</option>
              <option value="partnership">Partnership</option>
              {/* Add more options as necessary */}
            </Field>
            <ErrorMessage
              name="business_type"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Contact Name */}
          <div className="mb-4">
            <label
              htmlFor="contact_name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Contact Name
            </label>
            <Field
              name="contact_name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="contact_name"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Subcategory */}
          <div className="mb-4">
            <label
              htmlFor="profile.subcategory"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Subcategory
            </label>
            <Field
              name="profile.subcategory"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage
              name="profile.subcategory"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>

          {/* Addresses */}
          <div className="mb-4">
            <fieldset>
              <legend className="block text-gray-700 text-sm font-bold mb-2">
                Registered Address
              </legend>
              {/* Street1 */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.street1"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Street 1
                </label>
                <Field
                  name="profile.addresses.registered.street1"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.street1"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              {/* Street2 */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.street2"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Street 2
                </label>
                <Field
                  name="profile.addresses.registered.street2"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.street2"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Additional address fields (City, State, Postal Code, Country) follow the same pattern */}

              {/* City */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.city"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  City
                </label>
                <Field
                  name="profile.addresses.registered.city"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.city"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* State */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.state"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  State
                </label>
                <Field
                  name="profile.addresses.registered.state"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.state"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Postal Code */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.postal_code"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Postal Code
                </label>
                <Field
                  name="profile.addresses.registered.postal_code"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.postal_code"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label
                  htmlFor="profile.addresses.registered.country"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Country
                </label>
                <Field
                  name="profile.addresses.registered.country"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="profile.addresses.registered.country"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

export default OnboardingForm;
