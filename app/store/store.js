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
const APPLY = `${BASE_URL}user/applyforjobs`;
const TALENT = `${BASE_URL}user/talents`;
const APPLIED = `${BASE_URL}user/applications`;

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
      limit: 20,
      applied: [],

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

          if (response.data.message === "Invalid details") {
            toast.error("Incorrect username or password");
            return false;
          } else {
            const token = response.data.token;
            localStorage.setItem("authToken", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log(response.data.user_data)
            set({
              loading: false,
              email: email,
              signedIn: true,
              user: response.data.user_data,
              token: token,
            });

            toast.success("Login successful");
            return true;
          }
        } catch (error) {
          set({ loading: false });
          const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
          toast.error(errorMessage);
          console.error(error);
          return false;
        }
      },

      //request for otp with email
      resetPwdOTP: async ({ email }) => {
        try {
          set({ loading: true });
          const data = { email };
          await axios.post(RESET_PWD_OTP, data);
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
        localStorage.removeItem("authToken");
        toast.success("Logged out successfully");
      },

      findJobs: async ({
        limit,
        category,
        type,
        title,
        experience,
        technology,
        location,
      }) => {
        try {
          set({ loading: true });
          const categoryQuery = category ? `&category=${category}` : "";
          const experienceQuery = experience ? `&experience=${experience}` : "";
          const typeQuery = type ? `&type=${type}` : "";
          const titleQuery = title ? `&title=${title}` : "";
          const technologyQuery = technology ? `&technology=${technology}` : "";
          const locationQuery = location ? `&location=${location}` : "";

          const response = await axios.get(
            `${JOBS}?limit=${limit}${categoryQuery}${typeQuery}${titleQuery}${experienceQuery}${technologyQuery}${locationQuery}`
          );
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

      applyForJobs: async ({ user_id, job_id }) => {
        try {
          set({ loading: true });
          await axios.post(APPLY, { user_id, job_id });
          toast.success("Thanks for Applying");
          set({ loading: false });
        } catch (error) {
          const errorMsg =
            error?.response?.data?.message || "Kindly sign in to apply";
          toast.error(errorMsg);
          set({ loading: false });
        }
      },

      fetchAppliedJobs: async (id) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${APPLIED}?user_id=${id}`);
          console.log(response.data.jobs)
          set({ loading: false, applied: response.data.jobs });
        } catch (error) {
          const errorMsg =
            error?.response?.data?.message || "error fetching data";
          toast.error(errorMsg);
          set({loading: false})
        }
      },

      //   bookASession: async ({full_name, current_skills, course_of_choice, resume_link}) => {
      //     try {
      //       set({loading:true})
      //       await axios.post(APPLY, {full_name, current_skills, course_of_choice, resume_link})
      //       toast.success("Thanks for Applying")
      //       set({loading:false})
      //     } catch(error) {
      //       const errorMsg = error?.response?.data?.message || "Kindly sign in to apply"
      //       toast.error(errorMsg)
      //       set({loading:false})
      //     }
      //   }
    }),

    {
      name: "auth",
      storage: createJSONStorage(() => localStorage), // Or other storage mechanism
    }
  )
);

export { useJapaStore, BASE_URL };
