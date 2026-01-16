import React from 'react';

const Achievements = () => {
    const achievements = [
        "9 students (8 from the fourth year and 1 from the third year) of the Computer Science and Engineering department qualified for GATE 2021-2022.",
        "The highest package offered during IET placements 2022 till now stood at INR 12LPA and the average package offered during IET placements till now stood at INR 6.5LPA.",
        "In 2021, students participated in EBOOTATHAN. Out of them, 3 students (Manvi, Luv, and Ranjan) with 1 Faculty member (Er. Prashant Maharishi) got Gold Developer Certificate by IIT Kanpur and AKTU Lucknow for developing Simulator.",
        "More than 350 students successfully completed MOOC TEST (NPTEL, Udemy, Coursera, etc).",
        "In 2022, 2 students (Anurag Verma and Bhavy Airi) along with a teacher (Er. Prashant Maharishi) completed CSREL Bootcamp organized by IIT Bombay and called for 1 Week Summer School Bootcamp at IIT Bombay Campus.",
        "Some students of IET Khandari go for higher studies. One of them is Raghvendra Pratap Singh who is pursuing MTech from DTU, and the other is Ahmed Raza who is pursuing Ph.D. from IIT Roorkee from the 2022 Batch.",
        "Some great work done by our students can be viewed via the link provided below."
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    🏆 Achievements
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Celebrating the excellence and dedication of our students and faculty.
                </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {achievements.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex gap-4 items-start"
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 text-xl shadow-sm">
                            ★
                        </div>
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                {item}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <a
                    href="https://63034a7373d24551811fa3e3--shiny-fox-46fa01.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <span>View Student Projects</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default Achievements;
