"use client";
import React, { useState, useEffect, useRef } from "react";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, rgba(6, 182, 212, 0.5) 0%, rgba(6, 182, 212, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.199999999999996% at 100% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 100%)",
  };

  const highlight =
    "linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(6, 182, 212, 0.8) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);
  
  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-xl border border-gray-200 content-center bg-white hover:bg-white transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-hidden p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-gray-900 z-10 bg-white rounded-[inherit] relative",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(1px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-white absolute z-1 flex-none inset-[2px] rounded-[inherit]" />
    </Tag>
  );
}
