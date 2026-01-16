import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import {
  MdEventNote,
  MdPalette,
  MdSelfImprovement,
  MdLightbulb,
  MdCelebration,
  MdHealthAndSafety,
  MdTravelExplore,
  MdSports,
  MdClose,
  MdZoomOutMap,
  // MdNavigateNext,
  // MdNavigateBefore,
} from 'react-icons/md';
import { FaQuoteLeft } from 'react-icons/fa';

// Image Modal component for lightbox functionality
const ImageModal = ({ isOpen, image, onClose, title, index, totalImages, onNext, onPrev }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-5xl max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white z-10 backdrop-blur-sm"
            onClick={onClose}
          >
            <MdClose size={24} />
          </button>

          <img
            src={image}
            alt={`${title} - enlarged view`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />

          {totalImages > 1 && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm font-medium">
              Image {index + 1} of {totalImages}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Component for displaying image gallery
const ImageGallery = ({ images, title, isSports = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle image click to open modal
  const openModal = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // Handle different layouts based on image count and activity type
  const getGridClasses = () => {
    if (isSports) {
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3';
    }

    if (images.length === 1) {
      return 'max-w-2xl mx-auto';
    } else {
      return 'grid grid-cols-1 sm:grid-cols-2 gap-4';
    }
  };

  return (
    <>
      <div className={getGridClasses()}>
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            className={`overflow-hidden rounded-lg shadow-md ${
              isSports ? 'aspect-[4/3]' : 'aspect-[16/9]'
            } relative group cursor-pointer`}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            onClick={() => openModal(image, idx)}
          >
            <img
              src={image}
              alt={`${title} activity ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder-image.jpg'; // Fallback image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
              <div className="text-white text-sm font-medium flex items-center">
                <MdZoomOutMap className="mr-1" size={18} /> View larger
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        title={title}
        index={selectedIndex}
        totalImages={images.length}
      />
    </>
  );
};

// Component for each activity tab content
function ActivityContent({ title, icon, description, images = [], isSports = false }) {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <span className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-full text-white mr-4 shadow-md">
          {icon}
        </span>
        <h3 className="text-2xl font-bold text-indigo-900">{title}</h3>
      </div>

      <div className="mb-8">
        <div className="flex mb-4">
          <FaQuoteLeft
            className="text-indigo-300 text-opacity-50 mt-1 mr-3 flex-shrink-0"
            size={20}
          />
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{description}</p>
        </div>
      </div>

      {images && images.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-indigo-800 mb-4 pb-2 border-b border-indigo-100">
            Activity Gallery
          </h4>
          <ImageGallery images={images} title={title} isSports={isSports} />
        </div>
      )}
    </div>
  );
}

const ActivitiesSection = () => {
  // The sample images path format - in a real implementation, these would be the actual image paths
  // Add placeholder images for demonstration
  const activities = [
    {
      name: 'Induction Program',
      icon: <MdEventNote size={24} />,
      content:
        'The objective of the programme is to make students comfortable in the new environment, open them up, set a healthy daily routine, create bonding in the batch as well as between faculties and students, develop awareness, sensitivity and understanding of the self, people around them, society at large and nature.',
      images: ['/images/asm/induction01.png', '/images/asm/induction02.png'],
    },
    {
      name: 'Art & Craft',
      icon: <MdPalette size={24} />,
      content:
        'In induction program Art & Craft were organized. Experts for Art activities were invited. Students learned the basics of painting. Newcomers also got a chance to learn basics of Face Sketching.\n\nFollowing are the glimpses of the activities:',
      images: ['/images/asm/art01.png', '/images/asm/art02.png'],
    },
    {
      name: 'SELP',
      icon: <MdSelfImprovement size={24} />,
      content:
        "To create a sense of positive & holistic development of student and bringing over all excellence and stability in one's personality with this objective lectures were delivered by Art of Living organization: SELP (Student Excellence & Learning Programme). This programme include ancient breeding technique, yoga, pranayama and many group activities, process to bring physical, mental eternal and stability. This included lectures on health, career, studies, learning & leadership skills this programme also included powerful breathing technique called sudarshan kriya.",
      images: ['/images/asm/selp01.png', '/images/asm/selp02.png'],
    },
    {
      name: 'Motivational Lectures',
      icon: <MdLightbulb size={24} />,
      content:
        'The motive of the Induction Programme is to help students adjust in the unfamiliar environment of college and get to know the other peers. In such a difficult transition from school to college life Motivation is the key element. For this purpose, expert lectures to motivate students were organized. Various motivational lectures and lectures on human values were organized. Following are the glimpses:',
      images: ['/images/asm/motivation01.png', '/images/asm/motivation02.png'],
    },
    {
      name: 'Rangoli Competition',
      icon: <MdCelebration size={24} />,
      content:
        "Rangoli is originated from the Sanskrit word 'rangavalli'. It is a combination of two words Rang can be referred as colors and Holi can be referred as celebration. So, Rangoli is an artistic festivity of colors. Organizing such events help students to remain in close touch with their culture. Rangoli Competitions play an important role in motivating students to perform and outshine in their creative skills. It offers a chance for participants to gain substantial experience, adopt innovative techniques, showcase talents, analyze and evaluate outcomes and uncover personal abilities.",
      images: ['/images/asm/rangoli01.png', '/images/asm/rabgoli02.png'],
    },
    {
      name: 'Health Check-up',
      icon: <MdHealthAndSafety size={24} />,
      content:
        'Health Check Up Camp was organized in Institute of Engineering & Technology, Dr. Bhimrao Ambedkar University, Khandari Campus, Agra under Induction Program AICTE Mandates TEQIP III scheme. The Doctors from Pushpanjali Hospital & Research Centre Agra had organized the Health Check Up Camp on 13 August, 2019. The team of doctors comprised of (Dr. R. K. Singh, General Physician, Dr. Suruchi Jain, Ophthalmologist, Dr. Sandhya Rajput, Dentist and Dr. Priyanka Yadav Dietician and Technical Staff Mr. Shekhar, Ms. Sarika, Ms. Sapna, Ms. Sonia). 150 students, faculties and staff members benefited from this Health Check Up.',
      images: ['/images/asm/health01.png'],
    },
    {
      name: 'Cultural Visit',
      icon: <MdTravelExplore size={24} />,
      content:
        'Cultural visit was planned to engage newly admitted students with region culture, specifically the lifestyle of the people in those geographical areas, the history of those people, their art, architecture, religion(s), and other elements that helped shape their way of life. It help them to develop close bonding and understand the problems of the region where they will graduate.',
      images: ['/images/asm/cul01.png', '/images/asm/cul02.png'],
    },
    {
      name: 'Sports',
      icon: <MdSports size={24} />,
      content:
        'Various sports activities are organized throughout the academic year to promote physical fitness, team spirit and leadership qualities among students.',
      images: [
        '/images/asm/sport01.png',
        '/images/asm/sport02.png',
        '/images/asm/sport03.png',
        '/images/asm/sport04.png',
        '/images/asm/sport05.png',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white" id="activities">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-sm uppercase tracking-wider text-indigo-600 font-semibold mb-2">
            Campus Life
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Student <span className="text-indigo-600">Activities</span>
          </h2>
          <div className="h-1 w-24 bg-indigo-600 rounded mx-auto mt-3"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Students participate in various curricular and extracurricular activities to enhance
            their skills, promote teamwork, and enjoy a well-rounded campus experience.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <Tab.Group>
            <Tab.List className="flex p-2 space-x-1 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-x-auto">
              {activities.map((activity) => (
                <Tab
                  key={activity.name}
                  className={({ selected }) =>
                    `${
                      selected
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                        : 'text-indigo-800 hover:bg-indigo-100'
                    } px-4 py-3 rounded-lg font-medium flex items-center whitespace-nowrap transition-all duration-200`
                  }
                >
                  <span className="mr-2">{activity.icon}</span>
                  {activity.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {activities.map((activity, idx) => (
                <Tab.Panel key={idx} className="bg-white rounded-xl p-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ActivityContent
                      title={activity.name}
                      icon={activity.icon}
                      description={activity.content}
                      images={activity.images}
                      isSports={activity.name === 'Sports'}
                    />
                  </motion.div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
