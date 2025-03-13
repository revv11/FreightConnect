
"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { useRouter } from 'next/navigation';


interface DataType{
    userType?: string;
    name?: string;
    contactNumber?: string;
   
    licenseNo? : string 
    truckAge?: number
    minSalary?: number
    maxDistance? : number
    licenseFile? : any

    companyName? : string
    companyType?: string
    
    
}

const SignupForm = () => {
  // Form state management
  const router  = useRouter()
  const {currentUser, setSubmitData} = useUserContext()
  console.log("currentuser---------------------", currentUser)
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    
    // Trucker specific fields
    licenseNo: '',
    truckAge: '',
    minSalary: '',
    maxDistance: '',
    licenseFile: null,
    // Shipper specific fields
    companyName: '',
    companyType: '',
  
  });

  // Handle input changes
  const handleInputChange = (e:any) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    // Create the data object to send
    const dataToSubmit: DataType = {
      userType,
      name: formData.name,
      contactNumber: formData.contactNumber,
      
    };
    
    if (userType === 'TRUCKER') {
      dataToSubmit.licenseNo = formData.licenseNo;
      dataToSubmit.truckAge = Number(formData.truckAge);
      dataToSubmit.minSalary = Number(formData.minSalary);
      dataToSubmit.maxDistance = Number(formData.maxDistance);
      dataToSubmit.licenseFile = formData.licenseFile;
    } else if (userType === 'SHIPPER') {
      dataToSubmit.companyName = formData.companyName;
      dataToSubmit.companyType = formData.companyType;
   
    }
    // Add type-specific fields

    // Call API function to submit the form
    submitFormData(dataToSubmit);
  };

  // Function to submit form data to API
  const submitFormData = async (data:DataType) => {
    console.log('Submitting form data:', data);
    try{
        
        const res = await axios.post('/api/user/details', data)
        setSubmitData(true)
        
        router.push('/dashboard')
    }
    catch(e:any){
        console.log(e)
    }
  };
  
  
  return (
    <div className="min-h-screen flex rmd:flex-col-reverse text-black bg-[#FAFAFA]">
      {/* Sidebar */}
      <div className="bg-white w-1/4 rmd:w-full flex flex-col p-8 rmd:p-4 items-center shadow-md">
        <div className="flex flex-col rmd:flex-row rmd:justify-between justify-center pt-72 rmd:pt-0">
          <p className="text-black text-opacity-20 flex flex-row mb-8 me-8">
            Sign Up
          </p>
          <p className="text-[#005EFE] font-bold flex flex-row">
            <span className="bg-[#005EFE] text-white w-6 h-6 rounded-full text-center mr-2 flex items-center justify-center">2</span>{" "}
            Personal Info
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#FAFAFA] w-3/4 rmd:w-full flex flex-col p-8">
        <div>
          <div className="flex flex-row items-end mb-4">
            <a href="/signup" className="absolute top-8 right-6">
              <button
                className="px-4 py-2 border border-black border-opacity-20 text-black text-opacity-60 text-sm items-center justify-center flex rounded hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </a>
          </div>
        </div>
        {1 > 2 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005EFE]"></div>
          </div>
        ) : (
          <div className="rmd:px-2 rmd:py-5">
            <div className="flex-col justify-center mb-8">
              <h1 className="text-3xl font-bold rmd:text-2xl text-gray-800">Personal Info</h1>
              <p className="mt-2 text-gray-600">
                Fill out your personal information so that we can get to know you better.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="me-24 rmd:me-0 bg-white p-6 rounded-lg shadow-sm">
              {/* User Type Selection */}
              <div className="w-full mb-8">
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  I am a:
                </label>
                <div className="flex space-x-8">
                  <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="userType"
                      value="TRUCKER"
                      className="mr-2 h-4 w-4 text-[#005EFE] focus:ring-[#005EFE]"
                      onChange={() => setUserType('TRUCKER')}
                      checked={userType === 'TRUCKER'}
                    />
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Trucker
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="userType"
                      value="SHIPPER"
                      className="mr-2 h-4 w-4 text-[#005EFE] focus:ring-[#005EFE]"
                      onChange={() => setUserType('SHIPPER')}
                      checked={userType === 'SHIPPER'}
                    />
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      SHIPPER
                    </span>
                  </label>
                </div>
                {!userType && (
                  <p className="text-xs text-gray-500 mt-2">Please select your role to continue</p>
                )}
              </div>

              {userType && (
                <>
                  {/* Common Fields for Both */}
                  <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-full px-2 mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 mb-1 text-sm font-medium"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="w-full px-2 mb-4">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-gray-700 mb-1 text-sm font-medium"
                      >
                        Phone Number (WhatsApp Active)
                      </label>
                      <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                        placeholder="e.g. +1 234 567 8900"
                      />
                    </div>
                  </div>

                  {/* Conditional Fields for Trucker */}
                  {userType === 'TRUCKER' && (
                    <div className="flex flex-wrap -mx-2 mb-4">
                      <div className="w-full px-2 mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Trucker Details</h3>
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="licenseNo"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          License Number
                        </label>
                        <input
                          required
                          type="text"
                          id="licenseNo"
                          name="licenseNo"
                          value={formData.licenseNo}
                          onChange={handleInputChange}
                         
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                          placeholder="Enter your license number"
                        />
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="truckAge"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Truck Age (in years)
                        </label>
                        <input
                          type="number"
                          id="truckAge"
                          name="truckAge"
                          value={formData.truckAge}
                          onChange={handleInputChange}
                            required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                          placeholder="e.g. 5"
                        />
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="minSalary"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Minimum Salary Expected
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="minSalary"
                            name="minSalary"
                            value={formData.minSalary}
                            onChange={handleInputChange}
                           
                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="maxDistance"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Maximum Distance (km)
                        </label>
                        <input
                          type="number"
                          id="maxDistance"
                          name="maxDistance"
                          value={formData.maxDistance}
                          onChange={handleInputChange}
                        
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                          placeholder="e.g. 500"
                        />
                      </div>
                      <div className="w-full px-2 mb-4">
                        <label
                          htmlFor="licenseFile"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Upload License Document
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="licenseFile" className="relative cursor-pointer bg-white rounded-md font-medium text-[#005EFE] hover:text-[#0045be] focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="licenseFile" name="licenseFile" type="file" className="sr-only" accept=".pdf,.jpg,.png"  onChange={handleInputChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                            {formData.licenseFile && (
                              <p className="text-sm text-green-600">File selected:
                               {/* {formData.licenseFile.name} */}
                               </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conditional Fields for Shipper */}
                  {userType === 'SHIPPER' && (
                    <div className="flex flex-wrap -mx-2 mb-4">
                      <div className="w-full px-2 mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Company Details</h3>
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="companyName"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                    
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                          placeholder="Enter your company name"
                        />
                      </div>
                      <div className="w-1/2 px-2 mb-4">
                        <label
                          htmlFor="companyType"
                          className="block text-gray-700 mb-1 text-sm font-medium"
                        >
                          Company Type
                        </label>
                        <select
                          id="companyType"
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleInputChange}
                       
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-[#005EFE] focus:border-[#005EFE] transition-colors"
                        >
                          <option value="">Select company type</option>
                          <option value="manufacturer">Manufacturer</option>
                          <option value="distributor">Distributor</option>
                          <option value="retailer">Retailer</option>
                          <option value="logistics">Logistics Provider</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                    </div>
                  )}

                 
                </>
              )}

              <div className="flex justify-between mb-6 mt-8">
                <button
                  type="button"
                  className="px-6 py-2 border rmd:w-2/5 border-black border-opacity-20 text-black text-opacity-60 text-sm rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Step
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 rmd:w-2/5 bg-[#005EFE] text-white rounded hover:bg-[#0045be] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!userType}
                >
                  Done
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="text-gray-600 flex justify-end text-sm">
                <span className="mr-1">Having troubles? </span>
                <a href="#" className="text-[#005EFE] hover:underline">Contact support</a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;