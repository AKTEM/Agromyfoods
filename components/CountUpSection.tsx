'use client';

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Award, Users, Clock, ShoppingBag } from 'lucide-react';

interface StatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const Stat = ({ icon, value, label, suffix = '', duration = 2.5 }: StatProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center p-6"
    >
      <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <div className="text-green-600 dark:text-green-400">{icon}</div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
        {inView ? (
          <CountUp end={value} duration={duration} suffix={suffix} />
        ) : (
          <span>0{suffix}</span>
        )}
      </div>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default function CountUpSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 bg-green-50 dark:bg-green-900/10">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
            Our Success in Numbers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We take pride in our achievements and the trust our customers place in us.
            Here's a glimpse of our journey in numbers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat 
            icon={<Users size={28} />} 
            value={400} 
            label="Happy Customers" 
            suffix="+" 
          />
          <Stat 
            icon={<ShoppingBag size={28} />} 
            value={500} 
            label="Orders Delivered" 
            suffix="+" 
          />
          <Stat 
            icon={<Award size={28} />} 
            value={2} 
            label="Years of Excellence" 
          />
          <Stat 
            icon={<Clock size={28} />} 
            value={98} 
            label="On-time Delivery" 
            suffix="%" 
          />
        </div>
      </div>
    </section>
  );
}