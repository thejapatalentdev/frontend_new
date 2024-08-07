import { useJapaStore } from "@/app/store/store";
import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseCard = ({ src, alt, title, text, path }) => {
  const loading = useJapaStore((state) => state.loading);
  return (
    <Box>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width={320}
          height={320}
          className="rounded-2xl"
        />
      ) : (
        <Link href={path}>
          <div className="flex flex-col p-3 h-full rounded-2xl text-textDefault w-[320px] bg-primaryLight">
            <div className="flex flex-col gap-2 h-[400px]">
              <Image src={src} alt={alt} width={300} height={200} />
              <span className="text-lg font-bold">{title}</span>
              <p className="text-sm w-full">{text}</p>
            </div>
            <div className="border border-textDefault w-full px-5 py-1 rounded-[30px] mt-10 mb-3 bg-transparent font-light text-center">
              Learn more
            </div>
          </div>
        </Link>
      )}
    </Box>
  );
};

export default CourseCard;
