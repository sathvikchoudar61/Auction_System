// src/components/UserDetails.jsx
import React from "react";
import { formatDate } from "../utils/date";

const UserDetails = ({ user }) => {
  return (
    <div className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'>
      <h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
      <p className='text-gray-300'>Name: {user.name}</p>
      <p className='text-gray-300'>Email: {user.email}</p>

      <h3 className='text-xl font-semibold text-green-400 mt-6 mb-3'>Account Activity</h3>
      <p className='text-gray-300'>
        <span className='font-bold'>Joined: </span>
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className='text-gray-300'>
        <span className='font-bold'>Last Login: </span>
        {formatDate(user.lastLogin)}
      </p>
    </div>
  );
};

export default UserDetails;
