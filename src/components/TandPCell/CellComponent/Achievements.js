import React from 'react';

const TrainingServices = () => {
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
        <div className="w-full px-8 py-12 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    🏆 Achievements
                </h1>

                <div className="space-y-4">
                    {achievements.map((item, idx) => (
                        <p key={idx} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            ⋄ {item}
                        </p>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <a
                        href="https://63034a7373d24551811fa3e3--shiny-fox-46fa01.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                        Projects Completed by Students
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrainingServices;
