import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Mission = () => {
  const values = [
    {
      icon: <AcademicCapIcon className="w-12 h-12 text-blue-600" />,
      title: "Student Ownership",
      description: "Full control over academic achievements and credentials"
    },
    {
      icon: <GlobeAltIcon className="w-12 h-12 text-blue-600" />,
      title: "Global Recognition",
      description: "Seamless verification across borders and institutions"
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-blue-600" />,
      title: "Privacy-First",
      description: "Built with data protection and privacy at the core"
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
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe every student deserves full ownership and global recognition of their academic achievements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-lg text-gray-600">
            DocVerify empowers institutions to deliver trustworthy, privacy-first, and future-proof credentials that unlock opportunities for every graduate — anywhere in the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission; 