"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const currentPath = usePathname();

  // Modified isActive function
  const isActive = (path) => {
    // Check for exact match or if currentPath starts with the path and has a trailing slash
    return ( currentPath === path || (path === "/jobs" && currentPath.startsWith("/jobs/")) || (path === "/courses" && currentPath.startsWith("/courses/")))
  };

  const NavLink = ({ text, path }) => (
    <Link
      href={path}
      className={`rounded-[30px] w-fit px-6 h-10 font-normal text-sm border flex items-center justify-center  ${
        isActive(path)
          ? "bg-primary border-primary text-white"
          : "bg-white border-textDefault text-textDefault"
      }`}
    >
      {text}
    </Link>
  );

  return (
    <header className="pt-8 pb-4 border fixed top-0 bg-white w-full z-10">
      <div className="flex justify-between px-[50px]">
        <div className="flex gap-3">
          <NavLink path="/" text={"Home"} />
          <NavLink path="/courses" text={"Courses"} />
          <NavLink path="" text={"CV Revamp"} />
        </div>
        <div>
          <Link href={"/"}>
            <Image src="/logo.svg" alt="" height={100} width={100} />
          </Link>
        </div>
        <div className="flex gap-3">
          <NavLink path="" text={"Talent Assessment"} />
          <NavLink path={"/jobs"} text={"Jobs"} />
          <NavLink path="/login" text={"Login"} />
        </div>
      </div>
    </header>
  );
};

export default Header;
