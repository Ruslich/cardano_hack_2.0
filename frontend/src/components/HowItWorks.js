import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, CogIcon, CubeIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const steps = [
    {
      icon: <AcademicCapIcon className="w-12 h-12 text-blue-600" />,
      title: "University Integration",
      description: "Institutions register & verify their identity once. Receive secure API keys and blockchain wallet."
    },
    {
      icon: <CogIcon className="w-12 h-12 text-blue-600" />,
      title: "Automated Credential Issuance",
      description: "Continue issuing documents as usual. DocVerify automatically notarizes document hashes via blockchain, without exposing personal data."
    },
    {
      icon: <CubeIcon className="w-12 h-12 text-blue-600" />,
      title: "Blockchain Notarization",
      description: "CIP-68 compliant NFTs minted on Cardano. Metadata includes issuer, type, date, signatures & verification link."
    },
    {
      icon: <UserIcon className="w-12 h-12 text-blue-600" />,
      title: "Student Ownership",
      description: "Students receive their credentials in a personal digital vault. Share instantly with employers, embassies, and institutions."
    },
    {
      icon: <MagnifyingGlassIcon className="w-12 h-12 text-blue-600" />,
      title: "Third-Party Verification",
      description: "Any third party can verify credentials instantly on UniVerify Portal. Zero paperwork. Zero waiting. Zero fraud."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How DocVerify Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, secure process that transforms how academic credentials are issued and verified
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-shrink-0">
                <div className="bg-blue-50 p-4 rounded-full">
                  {step.icon}
                </div>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 