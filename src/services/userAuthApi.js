import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getDeviceId } from './LocalStorageService';

// Define a service using a base URL and expected endpoints
const baseQuery = fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_BASE_URL}/account/` });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token directly via fetch to avoid circular dependency or RTK state issues
    // Note: We rely on the refresh_token cookie being sent automatically
    const refreshResult = await baseQuery({
      url: 'refresh/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, api, extraOptions);

    if (refreshResult.data) {
      // Store the new access token
      // The backend sends { access_token, user ... }
      // We need to update the local storage / redux state with the new token.
      // Since this is a specialized hook, we might need to dispatch an action or just update localStorage.
      // But `getToken()` reads from localStorage. `access_token` in args headers might be stale.

      const newAccessToken = refreshResult.data.access_token;
      if (newAccessToken) {
        localStorage.setItem('access_token', newAccessToken); // Update persisted
        // Retry original request with new token
        // We need to update the authorization header in the args if it was set
        if (args.headers && args.headers.authorization) {
          args.headers.authorization = `Bearer ${newAccessToken}`;
        }
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      // Refresh failed - logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Optional: Dispatch logout action or redirect
      // window.location.href = '/login'; 
    }
  }
  return result;
};

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users'], // Define cache tags
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: 'register/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: 'login/',
          method: 'POST',
          body: { ...user, deviceId: getDeviceId() },
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getLoggedUser: builder.query({
      query: (access_token) => {
        return {
          url: 'profile/',
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'changepassword/',
          method: 'POST',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: 'send-reset-password-email/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => {
        return {
          url: `/reset-password/${id}/${token}/`,
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getAllUsers: builder.query({
      query: (access_token) => {
        return {
          url: 'users/',
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      },
      providesTags: ['Users'], // This query provides the Users cache tag
    }),
    updateUserRole: builder.mutation({
      query: ({ id, access_token, data }) => {
        return {
          url: `users/${id}/role`,
          method: 'PUT',
          body: data,
          headers: {
            'authorization': `Bearer ${access_token}`,
            'Content-type': 'application/json',
          }
        }
      },
      invalidatesTags: ['Users'], // Invalidate Users cache when this mutation succeeds
    }),
    updateLoggedUser: builder.mutation({
      query: ({ access_token, data }) => {
        return {
          url: 'profile/',
          method: 'PUT',
          body: data,
          headers: {
            'authorization': `Bearer ${access_token}`,
            'Content-type': 'application/json',
          }
        }
      },
      // Optimistic update or invalidation could be done here, 
      // but simplistic approach: invalidate 'Users', or maybe a specific 'Profile' tag if we had one.
      // Since getLoggedUser doesn't have a tag and acts as cache, we might need to manually update cache or refetch.
      // Simplest: no tag invalidation, the component refetches or updates local state.
    }),
  }),
})

export const { useRegisterUserMutation, useLoginUserMutation, useGetLoggedUserQuery, useChangeUserPasswordMutation, useSendPasswordResetEmailMutation, useResetPasswordMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useUpdateLoggedUserMutation } = userAuthApi