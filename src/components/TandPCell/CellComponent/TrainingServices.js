import React from 'react';

const TrainingServices = () => {
  return (
    <div className="w-full px-8 py-12 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* Text Section */}
        <div className="md:w-5/12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Training Services
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Don't let your users guess by attaching tooltips and popovers to any element. Just make sure you enable them first via JavaScript.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            The kit comes with three pre-built pages to help you get started faster. You can change the text and images and you're good to go. Just make sure you enable them first via JavaScript.
          </p>
          <a
            href="/"
            className="inline-block font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-2"
          >
            Check Notus JS!
          </a>
        </div>

        {/* Card Section */}
        <div className="md:w-5/12">
          <div className="relative flex flex-col w-full bg-pink-500 rounded-2xl shadow-lg overflow-hidden">
            <img
              alt="Training Service"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80"
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <blockquote className="p-6 md:p-8 text-white">
              <h4 className="text-xl md:text-2xl font-bold mb-2">
                Top Notch Services
              </h4>
              <p className="text-md md:text-lg font-light">
                The Arctic Ocean freezes every winter and much of the sea-ice then thaws every summer, and that process will continue whatever happens.
              </p>
            </blockquote>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainingServices;
