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
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [showScript, setShowScript] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setScript("");
    setShowScript(false); // Reset script visibility
    
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyUrl: companyUrl,
          linkedinUrl: linkedinUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.script);
      
    } catch (err) {
      console.error('Error generating script:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
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

          {/* Results Section */}
          {(script || error) && (
            <motion.div
              className="mt-12 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: appleEasing }}
            >
              {error && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {script && (
                <div className="space-y-6">
                  {/* Video Player */}
                  <motion.div
                    className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: appleEasing }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Generated Personalized Video</span>
                    </h3>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <video
                        controls
                        className="w-full h-auto rounded-lg"
                        poster="/placeholder-poster.jpg"
                      >
                        <source src="/nichochi.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>🎬 AI-generated video</span>
                        <span>🎯 Personalized content</span>
                        <span>📧 Ready to send</span>
                      </div>
                      
                      {/* Script Toggle Button */}
                      <motion.button
                        onClick={() => setShowScript(!showScript)}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{showScript ? 'Hide Script' : 'Show Script'}</span>
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: showScript ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Collapsible Script Section */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: showScript ? 'auto' : 0,
                      opacity: showScript ? 1 : 0 
                    }}
                    transition={{ duration: 0.3, ease: appleEasing }}
                    style={{ overflow: 'hidden' }}
                  >
                    {showScript && (
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Video Script</span>
                        </h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-gray-800 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                            {script}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </WavyBackground>
  );
}
