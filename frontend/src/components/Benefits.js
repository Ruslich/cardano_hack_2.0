import React from 'react';
import { motion } from 'framer-motion';
import { BuildingOfficeIcon, UserIcon, BriefcaseIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const Benefits = () => {
  const stakeholders = [
    {
      icon: <BuildingOfficeIcon className="w-12 h-12 text-blue-600" />,
      title: "Universities",
      description: "Simplified compliance, fraud reduction, global interoperability"
    },
    {
      icon: <UserIcon className="w-12 h-12 text-blue-600" />,
      title: "Students",
      description: "Portable, verifiable credentials under their full control"
    },
    {
      icon: <BriefcaseIcon className="w-12 h-12 text-blue-600" />,
      title: "Employers",
      description: "Instant trust, verified in seconds"
    },
    {
      icon: <BuildingLibraryIcon className="w-12 h-12 text-blue-600" />,
      title: "Governments",
      description: "Faster cross-border recognition & legal consistency"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Who Benefits?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DocVerify creates value for all stakeholders in the academic credential ecosystem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{stakeholder.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {stakeholder.title}
              </h3>
              <p className="text-gray-600">
                {stakeholder.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits; 