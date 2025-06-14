import React from 'react';
import { motion } from 'framer-motion';
import { DocumentDuplicateIcon, ClockIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Problem = () => {
  const problems = [
    {
      icon: <DocumentDuplicateIcon className="w-12 h-12 text-blue-600" />,
      title: "Document Forgery",
      description: "Millions of diplomas and academic documents are forged each year, undermining trust in the education system."
    },
    {
      icon: <ClockIcon className="w-12 h-12 text-blue-600" />,
      title: "Time-Consuming Verification",
      description: "Manual verification processes take weeks or months, causing delays for students and employers."
    },
    {
      icon: <ShieldExclamationIcon className="w-12 h-12 text-blue-600" />,
      title: "Security Risks",
      description: "Traditional paper-based credentials are vulnerable to loss, damage, and unauthorized access."
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
            The Problem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every year, millions of diplomas and academic documents are issued — and just as many are forged, lost, or delayed in verification.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{problem.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem; 