'use client';
import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

type AnimatedSectionProps = {
  children: React.ReactNode;
  delay?: number; 
};

function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    margin: "0px 0px -70px 0px", 
    once: true 
  });

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8, 
        delay: delay / 1000, 
      },
    },
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} 
      variants={variants} 
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;