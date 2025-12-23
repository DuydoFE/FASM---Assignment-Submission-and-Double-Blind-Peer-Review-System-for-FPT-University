import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { InputNumber } from "antd";

const AnimatedScoreInput = ({
  value,
  onChange,
  onBlur,
  min = 0,
  max,
  step = 0.25,
  status,
  addonAfter,
  size = "large",
  criteriaId,
  animationTrigger,
}) => {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Create animated value with spring physics
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const animatedValue = useTransform(springValue, (latest) =>
    Math.round(latest * 4) / 4
  );

  useEffect(() => {
    // Only trigger animation when auto-score is clicked (animationTrigger exists)
    if (animationTrigger && value !== null) {
      setIsAnimating(true);

      // Animate from current value to new value
      const startValue = displayValue || 0;
      springValue.set(startValue);
      springValue.set(value);

      // Stop animating after duration
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setDisplayValue(value);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [animationTrigger]);

  // Separate effect for non-animated value updates
  useEffect(() => {
    if (!isAnimating && !animationTrigger) {
      setDisplayValue(value);
    }
  }, [value, isAnimating, animationTrigger]);

  // Subscribe to animated value changes
  useEffect(() => {
    if (isAnimating) {
      const unsubscribe = animatedValue.on("change", (latest) => {
        setDisplayValue(latest);
      });

      return () => unsubscribe();
    }
  }, [isAnimating, animatedValue]);

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={
        isAnimating
          ? {
              scale: [1, 1.2, 1],
              rotateZ: [0, 5, -5, 0],
            }
          : { scale: 1 }
      }
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="relative"
    >
      {/* Particle effect only during auto-score animation */}
      {isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 40,
                y: Math.sin((i * Math.PI * 2) / 8) * 40,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </>
      )}

      <InputNumber
        min={min}
        max={max}
        step={step}
        value={isAnimating ? displayValue : value}
        onChange={isAnimating ? undefined : onChange}
        onBlur={onBlur}
        status={status}
        className="w-full"
        addonAfter={addonAfter}
        size={size}
        disabled={isAnimating}
        style={{
          pointerEvents: isAnimating ? "none" : "auto",
        }}
      />

      {/* Glow effect only during auto-score animation */}
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-blue-400 rounded-lg blur-md -z-10"
        />
      )}
    </motion.div>
  );
};

export default AnimatedScoreInput;