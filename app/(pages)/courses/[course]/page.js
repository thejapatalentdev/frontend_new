"use client"
import Button from '@/app/components/Button';
import { useJapaStore } from '@/app/store/store'
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Course = () => {
    const {course} = useParams();
    const {getCourse, getCourseByID} = useJapaStore((state) => ({
        getCourse: state.course,
        getCourseByID: state.getCourseByID
    }))

    useEffect(() => {
     getCourseByID(course)
    }, [getCourseByID, course])
  return (
    <div className="mt-36 mx-[50px] flex justify-between gap-36 text-textDefault">
      <div className="flex flex-col gap-9 w-[70%]">
        <div>
          <h2 className="mb-5 text-lg font-bold">{getCourse?.title}</h2>
          <p className="text-base">{getCourse?.about.details}</p>
          <div className="text-[14px] flex py-3 shadow-lg rounded-lg mt-10">
            <div className="flex-1 text-center py-1">
              {getCourse?.about.ratings}
            </div>
            <div className="flex-1 text-center py-1 border-x border-gray-300">
              {getCourse?.about.level}
            </div>
            <div className="flex-1 text-center py-1">
              {getCourse?.about.schedule}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[17px] font-bold mb-4 mt-3">Requirements</p>
          <ul className="flex flex-col gap-4">
            {getCourse?.requirements.split(". ").map((requirement, index) => (
              <li key={index} className="pl-2">
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <div className='mt-4'>
          <div>
            <Image src="/idea.svg" alt="" height={16} width={16} />
            <p className="text-xs text-primary mt-1.5">
              A perfectly structured course
            </p>
            <p className="text-[17px] font-bold mb-4 mt-2">Course Outline</p>
            <ul className="flex flex-col gap-4">
              {getCourse?.course_outline.split(". ").map((outline, index) => (
                <li key={index} className="pl-2">
                  <span className="font-bold">{outline.slice(0, 7)}</span>
                  <span className="font-normal">{outline.slice(7, 999)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7 py-5 px-3 border rounded-xl h-fit">
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold">COURSES OVERVIEW</p>
          <hr className="h-[3px] w-12 bg-primary" />
        </div>
        <div className='flex flex-col gap-3'>
          <Overview
            src={"/analytics.svg"}
            alt={""}
            text={getCourse?.over_view.whocan}
          />
          <Overview
            src={"/analytics.svg"}
            alt={""}
            text={"Hands-on exercises"}
          />
          <Overview
            src={"/diploma.svg"}
            alt={""}
            text={getCourse?.over_view.how}
          />
          <Overview
            src={"/diploma.svg"}
            alt={""}
            text={getCourse?.over_view.lesson_count}
          />
          <Overview
            src={"/diploma.svg"}
            alt={""}
            text={getCourse?.over_view.platform}
          />
        </div>
        <Button path={`${getCourse?.link}`} text={"Enroll"} width={"w-full"} bgColor={"bg-primary"} color={"text-white"}/>
      </div>
    </div>
  );
}

export default Course

const Overview = ({src, alt,text}) => (
  <div className='flex items-center gap-2 text-sm'>
    <Image src={src} alt={alt} height={14} width={14} />
    <p>{text}</p>
  </div>
);