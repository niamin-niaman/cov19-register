import React from "react";

import { CameraIcon } from "@heroicons/react/outline";

const Form = () => {
  return (
    <div className='flex flex-col align-center justify-center py-10'>
      <div className='flex flex-col md:flex-row items-center align-center'>
        <div className='flex flex-col justify-center items-center  h-full w-4/6'>
          <Input />
        </div>
        <div className='flex flex-col justify-center items-center text-center w-2/6 py-10'>
          {/* <CameraIcon className='w-10' />
        <p>upload image</p> */}
          <Upload />
        </div>
      </div>
      <div className='px-4 py-3 bg-gray-50 text-center sm:px-6'>
        <button
          type='submit'
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full'
        >
          Save
        </button>
      </div>
    </div>
  );
};

const Upload = () => {
  return (
    <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
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
        <div className='flex text-sm text-gray-600'>
          <label
            htmlFor='file-upload'
            className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
          >
            <span>Upload a file</span>
            <input
              id='file-upload'
              name='file-upload'
              type='file'
              className='sr-only'
            />
          </label>
          <p className='pl-1'>or drag and drop</p>
        </div>
        <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
};

const Input = () => {
  return (
    <div className='mt-5 md:mt-0 md:col-span-2 w-full py-10 px-2'>
      <form action='#' method='POST'>
        <div className='shadow sm:rounded-md sm:overflow-hidden'>
          <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
            {/* Firs name , Last name */}
            <div className='grid grid-cols-6 gap-4'>
              <div className='col-span-3 sm:col-span-3'>
                <label
                  htmlFor='first-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  First name
                </label>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>

              <div className='col-span-3 sm:col-span-3'>
                <label
                  htmlFor='last-name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last name
                </label>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>

              {/* Citizen ID */}

              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='citize-id'
                  className='block text-sm font-medium text-gray-700'
                >
                  Citizen ID
                </label>
                <input
                  type='text'
                  name='citize-id'
                  id='citize-id'
                  autoComplete='given-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>
              {/* Phone number */}

              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='phone-number'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone Number
                </label>
                <input
                  type='text'
                  name='phone-number'
                  id='phone-number'
                  autoComplete='given-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>
              {/* Origin  */}

              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='oring'
                  className='block text-sm font-medium text-gray-700'
                >
                  Origin
                </label>
                <input
                  type='text'
                  name='oring'
                  id='oring'
                  autoComplete='given-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>
              {/* Destination */}

              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='destination'
                  className='block text-sm font-medium text-gray-700'
                >
                  Destination
                </label>
                <input
                  type='text'
                  name='destination'
                  id='destination'
                  autoComplete='given-name'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>

              {/* ETC others */}
              <div className='col-span-6 sm:col-span-6'>
                <label
                  htmlFor='company-website'
                  className='block text-sm font-medium text-gray-700'
                >
                  Website
                </label>
                <div className='mt-1 flex rounded-md shadow-sm'>
                  <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                    ต้นทาง
                  </span>
                  <input
                    type='text'
                    name='company-website'
                    id='company-website'
                    className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
                    placeholder='www.example.com'
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-6'></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
