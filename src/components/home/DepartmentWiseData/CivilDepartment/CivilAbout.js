import React from 'react';
import { motion } from 'framer-motion';
import {
  FaGraduationCap,
  FaUserTie,
  FaBook,
  FaLightbulb,
  FaUsers,
  FaChartLine,
  FaAward,
  FaUniversity,
  FaFlask,
} from 'react-icons/fa';
import { fadeIn } from '../../../../utils/animations';

const CivilAbout = () => {
  // Animation variants

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const facultyMembers = [
    {
      name: 'Er. Chandan Kumar',
      position: 'Assistant Professor',
      additionalRole: 'Department In-charge',
      qualification: 'M.Tech',
      specialization: 'Environmental Engineering',
      experience: '25+ years of teaching',
      publications: '6 research papers, 2 book chapters',
      image: '/images/civil/chandan.png',
    },
    {
      name: 'Er. Shobhit Mohan Sharma',
      position: 'Assistant Professor',
      qualification: 'Ph.D. (Pursuing)',
      specialization: 'Structural Engineering',
      experience: '3+ years of teaching',
      publications: '3 research papers, 1 book chapter',
      image: '/images/civil/sobit.png',
    },
    {
      name: 'Er. Anil Singh',
      position: 'Assistant Professor',
      qualification: 'Ph.D. (Pursuing)',
      specialization: 'Energy & Environmental Engineering',
      experience: '3+ years of teaching',
      publications: '5 research papers, 1 book chapter',
      image: '/images/civil/anil.jpg',
    },
    {
      name: 'Er. Pratap Singh Birla',
      position: 'Assistant Professor',
      qualification: 'M.Tech',
      specialization: 'Civil Engineering',
      experience: '2+ years of teaching',
      publications: '4 research papers, 1 book chapter',
      image: '/images/civil/pratap.png',
    },
    {
      name: 'Er. Diksha Jain',
      position: 'Assistant Professor',
      qualification: 'M.Tech',
      specialization: 'Structural Engineering',
      experience: '2+ years of teaching',
      publications: '4 research papers, 1 book chapter',
      image: '/images/civil/diksha.png',
    },
  ];

  // SWOT Analysis data
  const swotData = {
    strengths: [
      'Experienced faculty',
      'Practical learning approach',
      'Strong industry connections',
    ],
    weaknesses: ['No lab technicians', 'Environmental lab pending', 'Lack of licensed software'],
    opportunities: [
      'NABL Accreditation of labs',
      'Collaborative research',
      'Industry partnerships',
    ],
    threats: ['Budget constraints', 'Environmental concerns', 'Aging infrastructure'],
  };

  return (
    <section id="civil-about" className="pt-20 pb-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-green-700/10 to-transparent"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23057a55' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 px-4">
        {/* Department Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
            Department of Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Civil Engineering Department
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            The Department of Civil Engineering at IET Agra, Vivekanand Campus, Khandari is
            committed to offering quality technical education and applicable knowledge for industry
            and society.
          </p>

          {/* Department highlights cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-sm border border-green-100"
            >
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
                <FaUniversity className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Established</h3>
              <p className="text-gray-600">2010</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-sm border border-green-100"
            >
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Faculty</h3>
              <p className="text-gray-600">5 Dedicated Members</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-sm border border-green-100"
            >
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
                <FaFlask className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Labs</h3>
              <p className="text-gray-600">8 State-of-the-art Facilities</p>
            </motion.div>
          </div>
        </motion.div>
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-600"></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 rounded-full p-3">
                    <FaLightbulb className="text-2xl text-green-600" />
                  </div>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become a leading institute offering technical education and research, recognized
                globally for quality technical education, producing professionals with ethical
                values, capable of providing solutions to engineering problems for the sustainable
                development of society.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-teal-100 rounded-full p-3">
                    <FaUsers className="text-2xl text-teal-600" />
                  </div>
                </div>
                <h3 className="ml-4 text-2xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <ul className="text-gray-600 leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Provide state-of-the-art infrastructure for effective learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Develop strong foundations in Civil and Environmental Engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Blend theory with practical training for enhanced learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Encourage industry exposure and research orientation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <span>Instill socially committed professionalism in students</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Faculty</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our department is led by experienced and qualified faculty members dedicated to
              providing quality education and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: { duration: 0.3 },
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="h-1.5 bg-gradient-to-r from-green-500 to-teal-600"></div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                    <div className="w-32 h-32 mx-auto sm:mx-0 sm:mr-6 mb-6 sm:mb-0 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-4 border-green-50 relative">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full object-cover object-center translate-y-2"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-faculty.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{faculty.name}</h4>
                      <p className="text-sm text-green-600 font-medium mb-2">
                        {faculty.position}
                        {faculty.additionalRole && (
                          <span className="ml-1">({faculty.additionalRole})</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-sm mb-1">
                        <span className="font-medium">Qualification:</span> {faculty.qualification}
                      </p>
                      <p className="text-gray-500 text-sm mb-1">
                        <span className="font-medium">Specialization:</span>{' '}
                        {faculty.specialization}
                      </p>
                      <p className="text-gray-500 text-sm mb-1">
                        <span className="font-medium">Experience:</span> {faculty.experience}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <FaAward className="text-green-500 mr-1" />
                        <span>{faculty.publications}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* SWOT Analysis */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">SWOT Analysis</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive analysis of our department's current position and future outlook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Strengths
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.strengths.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Weaknesses
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.weaknesses.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Opportunities
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.opportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Threats
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.threats.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Future Plans */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 -mb-20 -ml-20"></div>

          <h3 className="text-2xl font-bold text-center mb-8 relative">Future Vision</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Academic Excellence</h4>
              <p className="text-sm text-white/80">
                Provide academic excellence through contemporary curriculum and teaching methods
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Research Focus</h4>
              <p className="text-sm text-white/80">
                Foster research-oriented mindset through innovation and exploration
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-2xl" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Holistic Development</h4>
              <p className="text-sm text-white/80">
                Promote responsible citizenship through comprehensive technical education
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CivilAbout;
