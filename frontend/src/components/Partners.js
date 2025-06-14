import React from 'react';
import { motion } from 'framer-motion';
import cardanoLogo from '../assets/partners/cardano-ada-logo.png';
import cardanoFoundationLogo from '../assets/partners/cardano-foundation-logo.svg';
import midnightLogo from '../assets/partners/midnight.svg';
import { Link } from 'react-router-dom';

const Partners = () => {
  const partners = [
    {
      name: "Cardano",
      logo: cardanoLogo,
      description: "Blockchain Infrastructure"
    },
    {
      name: "Midnight",
      logo: midnightLogo,
      description: "Privacy Layer"
    },
    {
      name: "Cardano Foundation",
      logo: cardanoFoundationLogo,
      description: "Ecosystem Development"
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
            Partners & Ecosystem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building the future of credential verification with industry leaders
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative w-56 h-40 flex items-center justify-center"
            >
              <div className="w-full h-full bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center p-4">
                  <div className="text-white text-center">
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-sm text-gray-200">{partner.description}</p>
                  </div>
                </div>
              </div>
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
          <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center">
            Become a Partner
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners; 