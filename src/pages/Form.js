import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CloudUploadIcon } from "@heroicons/react/outline";
import Cleave from "cleave.js/react";
// https://nosir.github.io/cleave.js/

import { CameraIcon } from "@heroicons/react/outline";

import firebase from "../firebase";

function isValidCitizenId(id) {
  if (id.length != 13) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseFloat(id.charAt(i)) * (13 - i);
  }
  if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
  return true;
}

function isValidPhoneNo(input) {
  let regExp = /^0[0-9]{8,9}$/i;
  return regExp.test(input);
}

const Form = () => {
  const [process, setProcess] = useState(false);
  const [form, setForm] = useState({});
  const [formError, setformError] = useState({});
  const [imageError, setImageError] = useState("");
  const handleChange = ({ target: { name, value } }) => {
    // console.log("name : ", name);
    // console.log("value : ", value);
    // console.log(form);
    setForm((preForm) => ({ ...preForm, [name]: value }));
    // setformError((preFormError) => ({ ...preFormError, [name]: "" }));
    setformError((preFormError) => {
      delete preFormError[name];
      return { ...preFormError };
    });
  };

  const [image, setImage] = useState("");
  const [imageAsFile, setImageAsFile] = useState("");
  const handleFileChagne = (e) => {
    setImageError("");
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageAsFile((imageFile) => e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(form);
    // console.log(image);

    // TODO validate form empty
    const formList = [
      "first_name",
      "last_name",
      "citizen_id",
      "phone_number",
      "origin_country",
      "origin_province",
      "origin_district",
      "origin_sub_district",
      "destination_province",
      "destination_district",
      "destination_sub_district",
    ];
    // setformError((preFormError) => ({ ...preFormError, last_name: "error" }));

    formList.forEach((formdata) => {
      // console.log(formdata, " : ", !form[formdata], " : ", form[formdata]);
      if (!form[formdata]) {
        setformError((preFormError) => ({
          ...preFormError,
          [formdata]: "โปรดกรอกข้อมูล",
        }));
      }
    });
    // TODO validate form valid format
    if (form["citizen_id"]) {
      let citizenId = form["citizen_id"].replaceAll("-", "");
      // console.log(citizenId);
      let status = isValidCitizenId(citizenId);
      // console.log("status : ", status);
      if (!isValidCitizenId(citizenId)) {
        setformError((preFormError) => ({
          ...preFormError,
          citizen_id: "เลขประจำตัวประชาชนไม่ถูกต้อง",
        }));
      }
    }

    if (form["phone_number"]) {
      let phoneNumber = form["phone_number"].replaceAll(" ", "");
      // console.log(phoneNumber);
      let status = isValidPhoneNo(phoneNumber);
      // console.log("status : ", status);
      if (!isValidPhoneNo(phoneNumber)) {
        setformError((preFormError) => ({
          ...preFormError,
          phone_number: "เบอร์โทรศัพท์ไม่ถูกต้อง",
        }));
      }
    }

    formList.forEach((formdata) => {
      if (formError[formdata] === "") {
        setformError((preFormError) => {
          delete preFormError[formdata];
          return { ...preFormError };
        });
      }
    });
    console.log("formError :", formError);
    if (Object.keys(formError).length !== 0) {
      return;
    }

    // TODO validate image not emtpy
    if (!image) {
      setImageError("error");
      return;
    }
    // TODO uploade image
    const uniqFilename = new Date().getTime().toString(36);
    //stackoverflow.com/a/57593036/14697633

    console.log(uniqFilename);

    console.log(image);

    // TODO write data to firestore
    console.log("success");

    form["phone_number"] =
      form["phone_number"] && form["phone_number"].replaceAll(" ", "");
    form["citizen_id"] =
      form["citizen_id"] && form["citizen_id"].replaceAll("-", "");
    form["time_stamp"] = Date.now();
    console.log(form);

    // TODO modal processing
    setProcess(true);

    // TODO upload image to firebase
    const storage = firebase.storage();
    const uploadTask = storage
      .ref()
      .child(`citizenCard/${uniqFilename}.jpg`)
      .put(imageAsFile);

    // https://dev.to/itnext/how-to-do-image-upload-with-firebase-in-react-cpj
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref("citizenCard")
        // .child(file.name)
        .child(`${uniqFilename}.jpg`)
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          // setFile(null);
          // setURL(url);
          form["citizen_image"] = url;

          // TODO write to firestore
          const db = firebase.firestore();
          db.collection("people")
            .add(form)
            .then((people) => {
              console.log("Success");
              console.log(people);

              // TODO modal success

              // TODO clear form empty && set image empty
              // setForm("");
              window.location.reload();
              setImage("");
            });
        });
    });
  };
  return (
    <div className='flex flex-col align-center justify-center h-full w-full'>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className='flex flex-col md:flex-row items-center align-center'>
          <div className='flex flex-col justify-center items-center  h-full w-full md:w-3/6 px-10 pt-5 md:p-0'>
            <Input
              handleChange={handleChange}
              formError={formError}
              form={form}
            />
          </div>
          <div className='flex flex-col justify-center items-center text-center md:w-3/6 w-full px-10 pb-5 md:p-0 md:px-3'>
            {image && (
              <>
                <img className='h-full w-full' src={image} />{" "}
                <div className='px-4 py-3 bg-gray-50 text-center sm:px-6'>
                  <button
                    onClick={() => {
                      setImage("");
                    }}
                    type='submit'
                    className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full'
                  >
                    cancel
                  </button>
                </div>
              </>
            )}
            {!image && (
              <Upload
                handleFileChagne={handleFileChagne}
                imageError={imageError}
              />
            )}
          </div>
        </div>
        <div className='px-4 py-3 bg-gray-50 text-center sm:px-6'>
          <button
            type='submit'
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full'
          >
            {process && (
              <svg
                class='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  class='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  stroke-width='4'
                ></circle>
                <path
                  class='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const Upload = ({ handleFileChagne, imageError }) => {
  return (
    <>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
          imageError && "ring-2 ring-red-500"
        }`}
      >
        <label
          htmlFor='file-upload'
          className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
        >
          <div className='space-y-1 text-center'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              stroke='currentColor'
              fill='none'
              viewBox='0 0 48 48'
              aria-hidden='true'
            >
              <path
                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <div className='flex text-md font-kanit text-gray-600'>
              <span>ถ่ายรูปบัตรประชาชน</span>
              <input
                onChange={(e) => {
                  handleFileChagne(e);
                }}
                id='file-upload'
                name='file-upload'
                type='file'
                className='sr-only'
              />
            </div>
            {/* <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p> */}
          </div>
        </label>
      </div>
      {imageError && (
        <p className='font-kanit text-red-500 text-xs italic pt-3'>
          ถ่ายรูปบัตรประชาชน
        </p>
      )}
    </>
  );
};

const Input = ({ handleChange, formError, form }) => {
  return (
    <div className='mt-5 md:mt-0 md:col-span-2 w-full py-10 px-2'>
      <div className='shadow sm:rounded-md sm:overflow-hidden'>
        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
          {/* Firs name , Last name */}
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-span-3 sm:col-span-3'>
              <label
                htmlFor='first-name'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                ชื่อ
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["first_name"]}
                name='first_name'
                id='first_name'
                autoComplete='given_name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["first_name"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["first_name"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["first_name"]}
                </p>
              )}
            </div>

            <div className='col-span-3 sm:col-span-3'>
              <label
                htmlFor='last-name'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                นามสกุล
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["last_name"]}
                name='last_name'
                id='last_name'
                autoComplete='family_name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["last_name"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["last_name"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["last_name"]}
                </p>
              )}
            </div>

            {/* Citizen ID */}

            <div className='col-span-6 sm:col-span-6'>
              <label
                htmlFor='citizen-id'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                เลขประจำตัวประชาชน
              </label>
              <Cleave
                onChange={(e) => handleChange(e)}
                options={{
                  delimiters: ["-", "-", "-", "-"],
                  blocks: [1, 4, 5, 2, 1],
                  numericOnly: true,
                }}
                type='text'
                value={form["citizen_id"]}
                name='citizen_id'
                id='citizen_id'
                autoComplete='given_citizen_id'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["citizen_id"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["citizen_id"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["citizen_id"]}
                </p>
              )}
            </div>
            {/* Phone number */}

            <div className='col-span-6 sm:col-span-6'>
              <label
                htmlFor='phone-number'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                เบอร์โทรศัพท์
              </label>
              <Cleave
                onChange={(e) => handleChange(e)}
                options={{ blocks: [3, 3, 4], numericOnly: true }}
                type='text'
                value={form["phone_number"]}
                name='phone_number'
                id='phone_number'
                autoComplete='given_phone_number'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["phone_number"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["phone_number"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["phone_number"]}
                </p>
              )}
            </div>
            {/* Origin  */}

            <div className='col-span-full'>
              <p className='font-bold font-kanit'>เดินทางมาจาก</p>
            </div>

            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='origin_country'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                ประเทศ
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["origin_country"]}
                name='origin_country'
                id='origin_country'
                autoComplete='given-origin_country'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["origin_country"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["origin_country"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["origin_country"]}
                </p>
              )}
            </div>
            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='origin_province'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                จังหวัด
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["origin_province"]}
                name='origin_province'
                id='origin_province'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["origin_province"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["origin_province"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["origin_province"]}
                </p>
              )}
            </div>
            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='origin_district'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                อำเภอ
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["origin_district"]}
                name='origin_district'
                id='origin_district'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["origin_district"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["origin_district"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["origin_district"]}
                </p>
              )}
            </div>
            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='origin_sub_district'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                ตำบล
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["origin_sub_district"]}
                name='origin_sub_district'
                id='origin_sub_district'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["origin_sub_district"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["origin_sub_district"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["origin_sub_district"]}
                </p>
              )}
            </div>
            {/* Destination */}

            <div className='col-span-full'>
              <p className='font-bold font-kanit'>เดินทางไปยัง</p>
            </div>

            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='destination_province'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                จังหวัด
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["destination_province"]}
                name='destination_province'
                id='destination_province'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["destination_province"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["destination_province"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["destination_province"]}
                </p>
              )}
            </div>
            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='destination_district'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                อำเภอ
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["destination_district"]}
                name='destination_district'
                id='destination_district'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["destination_district"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["destination_district"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["destination_district"]}
                </p>
              )}
            </div>
            <div className='col-span-3 sm:col-span-2'>
              <label
                htmlFor='destination_sub_district'
                className='block text-sm font-kanit font-medium text-gray-700'
              >
                ตำบล
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type='text'
                value={form["destination_sub_district"]}
                name='destination_sub_district'
                id='destination_sub_district'
                autoComplete='given-name'
                className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  formError["destination_sub_district"] && "ring-1 ring-red-500"
                }`}
              />
              {formError["destination_sub_district"] && (
                <p className='font-kanit text-red-500 text-xs italic'>
                  {formError["destination_sub_district"]}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-3 gap-6'></div>
        </div>
      </div>
    </div>
  );
};

export default Form;
