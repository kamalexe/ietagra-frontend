import React from 'react';

const DesignNineteen = ({ 
    title = "Chairman's Message", 
    image, 
    name, 
    designation, 
    quote, 
    content 
}) => {
    return (
        <section className="py-12 bg-white" id="chairman-speak">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-orange-500 inline-block pb-2">{title}</h2>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Image & Quote */}
                    <div className="lg:w-1/4 flex flex-col items-center text-center">
                        <div className="mb-6 w-full max-w-xs">
                             <img 
                                src={image || "https://d3ahzzdje1trpm.cloudfront.net/uploads/topics/16527634095335.webp"} 
                                alt="chairman" 
                                className="w-full h-auto rounded-lg shadow-lg object-cover"
                            />
                        </div>
                        {quote && (
                            <blockquote className="italic text-gray-600 border-l-4 border-orange-500 pl-4 py-2 bg-gray-50 rounded text-sm text-left w-full">
                                "{quote}"
                                <cite className="block mt-2 font-bold text-gray-800 not-italic text-right">- Chairman</cite>
                            </blockquote>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="mb-6 border-b border-gray-200 pb-4">
                            <h4 className="text-2xl font-bold text-gray-800">{name || "Mr. Satish Kumar Singh"}</h4>
                            <p className="text-orange-600 font-medium">{designation || "Chairman - SMS Group of Institution"}</p>
                        </div>
                        
                        <div className="prose max-w-none text-gray-700 text-justify">
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <>
                                    <p className="mb-4">
                                        The current scenario of higher education in India needs substantial improvement. Every year, thousands of fresh graduates are produced and are consequently being exposed to a fierce competition to grab employment. Besides, traditional pedagogy with a focus on rote learning creating a lack of analytical and critical thinking, appropriate skills to be readily absorbed by the industry and above all life skills, has further aggravated the problem.
                                    </p>
                                    <p className="mb-4">
                                        We, at SMS Lucknow, are passionate about solving this growing problem of employability gap and providing ample opportunities to our students to develop themselves holistically and also to become industry ready professionals and responsible citizens of tomorrow. We believe in training our students enough to face challenges at work and in life. SMS has rapidly grown from a newcomer, in technology and management education, to a noted name in Uttar Pradesh.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                             <div className="text-right text-gray-800">
                                <p>Yours sincerely,</p>
                                <p className="font-bold mt-2">With regards,</p>
                                <p className="font-bold text-lg">{name || "Mr. Satish Kumar Singh"}</p>
                                <p className="text-sm text-gray-600">{designation || "Chairman"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignNineteen;
