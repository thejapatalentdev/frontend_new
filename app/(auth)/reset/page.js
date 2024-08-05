"use client";
import React from "react";
import Heading from "../component/heading";
import Button from "../component/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/store";

const Reset = () => {
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const { resetPWD} = useStore((state) => ({
    resetPWD: state.resetPwd,
  }));

  const onSubmit = async () => {
    const new_pass = getValues("password");
    console.log(new_pass)
    try {
      await resetPWD({ new_pass: new_pass });
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="flex flex-col m-auto justify-center max-w-[420px] items-center gap-8 py-10">
      <div className="flex flex-col gap-8 w-full">
        <Heading title="Create New Password" text="" />
        <form
          className="flex flex-col gap-3 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="password"
              className="text-black text-opacity-60 text-sm font-[500]"
            >
             Enter Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Please enter your password",
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                },
              })}
              className="border-[1.5px] border-gray-300 h-[40px] pl-2 rounded-lg text-[15px]"
            />

            {errors.password && (
              <span className="text-[12.5px] opacity-50">
                Your password should be at least 8 characters long, include
                uppercase and lowercase letters, a number, and a special
                character.
              </span>
            )}
          </div>
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="confirmPassword"
              className="text-black text-opacity-60 text-sm font-[500]"
            >
              Re-Enter Password
            </label>
            <input
              type="password"
              name="cPassword"
              placeholder="Re-enter your password"
              {...register("cPassword", {
                required: "Confirm your password",
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || "Passwords do not match";
                },
              })}
              className="border-[1.5px] border-gray-300 h-[40px] pl-2 rounded-lg text-[15px]"
            />
          </div>
          <Button text="Reset" isSubmitting={isSubmitting} />
        </form>
      </div>
    </section>
  );
};

export default Reset;
