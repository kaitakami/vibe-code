"use client";

import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WavyBackground } from "@/components/ui/wave-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Zap, Target, ArrowRight, Building2, User } from "lucide-react";

// Elegant input wrapper with hover border gradient
const ElegantInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    wrapperClassName?: string;
  }
>(({ wrapperClassName = "", className, ...props }, ref) => {
  return (
    <motion.div
      className={`w-full ${wrapperClassName}`}
      whileHover={{ scale: 1.002 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <HoverBorderGradient
        containerClassName="rounded-xl w-full"
        className="w-full p-0"
        as="div"
        duration={3}
        clockwise={true}
      >
        <Input
          ref={ref}
          className={`h-12 text-sm border-0 bg-white focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 rounded-xl text-gray-900 placeholder:text-gray-500 ${className}`}
          {...props}
        />
      </HoverBorderGradient>
    </motion.div>
  );
});

ElegantInput.displayName = "ElegantInput";

export default function Home() {
  const [companyUrl, setCompanyUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Add actual submission logic here
    console.log("Company URL:", companyUrl);
    console.log("LinkedIn URL:", linkedinUrl);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  // Apple's exact animation curves and timing
  const appleEasing = [0.25, 0.1, 0.25, 1];
  const appleFastEasing = [0.4, 0, 0.2, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: appleEasing,
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 16,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: appleEasing
      }
    }
  };

  return (
    <WavyBackground 
      className="min-h-screen"
      containerClassName="min-h-screen"
      colors={["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"]}
      waveWidth={60}
      backgroundFill="white"
      blur={12}
      speed="slow"
      waveOpacity={0.15}
    >
      <motion.div
        className="relative z-10 container mx-auto px-6 py-20 sm:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <motion.div 
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-1.5 rounded-full shadow-sm"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15, ease: appleFastEasing }
              }}
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-gray-600">
                AI-Powered Personalization
              </span>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight tracking-tight"
          >
            Create Personalized
            <br />
            <span className="text-blue-600">Videos & Audio</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-500 font-light">
              That Collects Leads
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Transform your outreach with AI that analyzes LinkedIn profiles and company data 
            to generate compelling, personalized content that actually gets responses.
          </motion.p>
        </div>

        {/* Main Form */}
        <motion.div variants={itemVariants} className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company URL Input */}
            <motion.div className="space-y-3">
              <Label htmlFor="company-url" className="text-sm font-semibold text-gray-900 flex items-center space-x-2 ml-1">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Company Website</span>
              </Label>
              <ElegantInput
                id="company-url"
                type="url"
                placeholder="https://domu.ai"
                value={companyUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 flex items-center space-x-1.5 font-light ml-1">
                <Zap className="h-3 w-3" />
                <span>We'll analyze your company's context and recent updates</span>
              </p>
            </motion.div>

            {/* LinkedIn URL Input */}
            <motion.div className="space-y-3">
              <Label htmlFor="linkedin-url" className="text-sm font-semibold text-gray-900 flex items-center space-x-2 ml-1">
                <User className="h-4 w-4 text-purple-600" />
                <span>Lead's LinkedIn Profile</span>
              </Label>
              <ElegantInput
                id="linkedin-url"
                type="url"
                placeholder="https://linkedin.com/in/kaitakami"
                value={linkedinUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedinUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 flex items-center space-x-1.5 font-light ml-1">
                <Target className="h-3 w-3" />
                <span>We'll extract their interests, posts, and professional background</span>
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="pt-4"
              whileHover={{ 
                scale: 1.005,
                transition: { duration: 0.15, ease: appleFastEasing }
              }}
              whileTap={{ 
                scale: 0.995,
                transition: { duration: 0.1, ease: appleFastEasing }
              }}
            >
              <HoverBorderGradient
                containerClassName="rounded-xl w-full bg-blue-600 hover:bg-blue-700"
                className="w-full p-0 bg-blue-600 hover:bg-blue-700"
                as="div"
                duration={2.5}
                clockwise={false}
              >
                <Button
                  type="submit"
                  disabled={isLoading || !companyUrl || !linkedinUrl}
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-none border-0 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, ease: appleEasing }}
                    >
                      <motion.div 
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                      />
                      <span>Creating your content...</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Generate Personalized Content</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </HoverBorderGradient>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </WavyBackground>
  );
}
