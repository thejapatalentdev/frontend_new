import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Jobs from "../(pages)/jobs/page";

const BASE_URL = "https://coral-app-9xy6y.ondigitalocean.app/japa/v1/";
const SIGN_UP = `${BASE_URL}registration/createaccount`;
const LOG_IN = `${BASE_URL}user/login`;
const VERIFY_OTP = `${BASE_URL}registration/verifyotp`;
const RESEND_OTP = `${BASE_URL}resend/otp`;
const RESET_PWD = `${BASE_URL}registration/setnewpass`;
const RESET_PWD_OTP = `${BASE_URL}registration/requestforotp`;
const JOBS = `${BASE_URL}user/jobs`;
const JOBBYID = `${BASE_URL}user/jobyid`;
const COURSES = `${BASE_URL}user/getcourses`;
const COURSEBYID = `${BASE_URL}user/coursebyid/`;

const useJapaStore = create(
  persist(
    (set, get) => ({
      signedIn: false,
      token: null,
      loading: false,
      email: "",
      user: null,
      loginType: null,
      jobs: [],
      job: null,
      courses: [],
      course: null,
      signedIn: false,

      //isUserSignedIn

      // isUserSignedIn: (signedIn) => set({signedIn: signedIn}),

      //sign up
      register: async ({ first_name, last_name, email, pass_word }) => {
        try {
          const data = { first_name, last_name, email, pass_word };
          set({ loading: true });
          const response = await axios.post(SIGN_UP, data);
          toast.success(response.data.message);
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error("Kindly register again");
          console.error(error);
        }
      },

      //login
      login: async ({ email, password }) => {
        try {
          const data = { email, password };
          set({ loading: true });
          const response = await axios.post(LOG_IN, data);
          const message = response.data.message;
          if (
            message === "Authentication successful. OTP sent to your email."
          ) {
            toast.success(message);
          } else {
            toast.error(message);
          }
          set({ loading: false, email: email, signedIn: true, user: response.data.user_data.email });
        } catch (error) {
          set({ loading: false });
          if (error.response && error.response.status === 400) {
            toast.error("Invalid credentials");
          } else if (error.response && error.response.status === 500) {
            toast.error("Internal server error");
          } else {
            toast.error("An unexpected error occurred.");
          }
          console.error(error);
        }
      },

      //request for otp with email
      resetPwdOTP: async ({ email }) => {
        try {
          set({ loading: true });
          const data = { email };
          const response = await axios.post(RESET_PWD_OTP, data);
          toast.success("OTP verified succcessfully.");
          set({ loading: false, email: email });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      //verify generated OTP
      verifyOTP: async ({ email, otp }) => {
        try {
          const data = { email, otp };
          set({ loading: true, signedIn: false, user: null });
          const response = await axios.post(VERIFY_OTP, data);
          if (response.status === 200) {
            const token = response.data.message;
            const userToken = token.split(" ")[1];
            localStorage.setItem("token", userToken);
            set({
              loading: false,
              signedIn: true,
              email: email,
            });
            return true;
          } else {
            toast.error(response.data.message);
            set({ loading: false });
            return false;
          }
        } catch (error) {
          console.log(error);
          toast.error("Invalid OTP");
          set({ loading: false });
          return false;
        }
      },

      //password change
      resetPwd: async (new_pass) => {
        try {
          set({ loading: true });
          const token = localStorage.getItem("token");
          const response = await axios.put(RESET_PWD, new_pass, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success(response.data.message);
          set({ loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      resendOtp: async ({ email }) => {
        try {
          set({ loading: true });
          const response = await axios.post(RESEND_OTP, { email });
          toast.success(response.data.message);
          set({ loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, signedIn: false });
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
      },

      findJobs: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(JOBS);
          const data = response.data.jobs;
          set({ jobs: data, loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      findJobByID: async (job) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${JOBBYID}/${job}`);
          const data = response.data.data;
          console.log(data);
          set({ job: data, loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      getCourses: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(COURSES);
          const data = response.data.courses;
          set({ courses: data, loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },

      getCourseByID: async (course) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${COURSEBYID}${course}`);
          const data = response.data.data;
          set({ course: data, loading: false });
        } catch (error) {
          console.log(error);
          toast.error("Request Failed. Kindly Retry");
          set({ loading: false });
        }
      },
    }),

    {
      name: "auth",
      storage: createJSONStorage(() => localStorage), // Or other storage mechanism
    }
  )
);

export { useJapaStore, BASE_URL };
