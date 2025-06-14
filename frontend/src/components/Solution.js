import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, GlobeAltIcon, CpuChipIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Solution = () => {
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-blue-600" />,
      title: "Privacy-Preserving",
      description: "Full GDPR & FERPA compliance"
    },
    {
      icon: <CpuChipIcon className="w-8 h-8 text-blue-600" />,
      title: "Blockchain-Backed",
      description: "Immutable records on Cardano blockchain"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8 text-blue-600" />,
      title: "Globally Verifiable",
      description: "Portable credentials for students & employers"
    },
    {
      icon: <LockClosedIcon className="w-8 h-8 text-blue-600" />,
      title: "Fraud-Proof",
      description: "Tamper-resistant NFT-based notarization"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-blue-600" />,
      title: "Plug-and-Play API",
      description: "No change to university workflows"
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
            Our Solution: The DocVerify Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DocVerify provides a seamless, confidential, and globally trusted credential verification infrastructure that integrates directly into existing university systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Partner with DocVerify
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution; 