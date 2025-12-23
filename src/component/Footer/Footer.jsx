import React from 'react';
import { Mail, Phone, MapPin, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import fasmLogo from '../../assets/img/FASM.png';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Logo and Description Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={fasmLogo}
                alt="FASM Logo"
                className="h-12 w-auto object-contain"
              />
            </motion.div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Smart assignment management platform for FPT University.
            </p>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div variants={itemVariants} className="space-y-3 md:col-span-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <motion.li
                className="flex items-start space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="mt-1 text-blue-400"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mail size={20} />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a
                    href="mailto:motuika2003@gmail.com"
                    className="text-gray-200 hover:text-blue-400 transition-colors"
                  >
                    motuika2003@gmail.com
                  </a>
                </div>
              </motion.li>

              <motion.li
                className="flex items-start space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="mt-1 text-green-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone size={20} />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a
                    href="tel:0365062443"
                    className="text-gray-200 hover:text-green-400 transition-colors"
                  >
                    0365 062 443
                  </a>
                </div>
              </motion.li>

              <motion.li
                className="flex items-start space-x-3 group"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="mt-1 text-purple-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin size={20} />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-gray-200">
                    FPT University, Vietnam
                  </p>
                </div>
              </motion.li>
            </ul>
          </motion.div>

        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-6 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              className="text-gray-400 text-sm flex items-center"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              © {currentYear} FASM. Made with{' '}
              <motion.span
                className="inline-block mx-1"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Heart size={16} className="text-red-500 fill-current" />
              </motion.span>{' '}
              for FPT University
            </motion.p>
            <motion.div
              className="flex space-x-6 text-sm"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              {['Privacy Policy', 'Terms of Service', 'Support'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;