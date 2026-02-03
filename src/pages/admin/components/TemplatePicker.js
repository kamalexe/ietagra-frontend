import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SectionRegistry from '../../../components/PageBuilder/SectionRegistry';
import DepartmentService from '../../../services/DepartmentService';

import StudentRecordService from '../../../services/StudentRecordService';

const TemplatePicker = ({ onClose, onSelect, currentSlug }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [departments, setDepartments] = useState([]);

    const [projects, setProjects] = useState([]);
    const [moocs, setMoocs] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [achievements, setAchievements] = useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptData, projectData, moocData, placementData, achievementData] = await Promise.all([
                    DepartmentService.getAllDepartments(),
                    StudentRecordService.getRecords('project'),
                    StudentRecordService.getRecords('mooc'),
                    StudentRecordService.getRecords('placement'),
                    StudentRecordService.getRecords('achievement')
                ]);
                setDepartments(deptData);

                // Helper to flatten metadata
                const processRecords = (records) => records.map(record => ({
                    ...record,
                    ...record.metadata
                }));

                setProjects(processRecords(projectData));
                setMoocs(processRecords(moocData));
                setPlacements(processRecords(placementData));
                setAchievements(processRecords(achievementData));

            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);





    const templates = [
        {
            key: 'design_thirty',
            name: 'University Media Gallery (Premium)',
            description: 'Advanced media showcase with albums, lightbox, and video support.',
            demoData: {
                title: "Our Memories",
                subtitle: "Glimpses into the vibrant campus life and historical events of our university.",
                limit: 6,
                category: "All"
            }
        },
        {
            key: 'design_twenty',
            name: 'Events Grid (Tile Layout)',
            description: 'Grid of event cards with image filters and detailed view.',
            demoData: {
                // This component fetches its own data, so demoData can be minimal or empty
                title: "Events List",
                subtitle: "Exploring Excellence",
                content: "<p>Stay updated with the latest happenings, workshops, and seminars at our institute.</p>",
                backgroundImage: "https://picsum.photos/1920/600",
                limit: 6
            }
        },
        {
            key: 'design_one',
            variant: 'simple',
            name: 'Simple Title & Text',
            description: 'Centered heading with description text.',
            demoData: {
                title: "About Us",
                badge: "Info",
                description: "Brief introduction to the section content.",
                variant: "simple"
            }
        },
        {
            key: 'design_two',
            name: 'Features Grid (3 Cols)',
            description: 'Grid of cards with icons and descriptions.',
            demoData: {
                title: "Our Features",
                badge: "Highlights",
                description: "Discover what makes us unique.",
                underlineColor: "from-blue-500 to-cyan-500",
                items: [
                    { title: "Feature 1", description: "Description 1", icon: "FaStar" },
                    { title: "Feature 2", description: "Description 2", icon: "FaHeart" },
                    { title: "Feature 3", description: "Description 3", icon: "FaBolt" }
                ]
            }
        },
        {
            key: 'design_three',
            name: 'Colored Cards Grid',
            description: 'Two-column colored cards with icons.',
            demoData: {
                title: "Our Mission & Vision",
                badge: "Goals",
                underlineColor: "from-green-500 to-teal-500",
                items: [
                    { title: "Vision", content: "To be a center of excellence...", icon: "FaEye", colorTheme: "green" },
                    { title: "Mission", content: "To provide quality education...", icon: "FaBullseye", colorTheme: "teal" }
                ]
            }
        },
        {
            key: 'design_four',
            name: 'Faculty / Team Grid',
            description: 'Cards with circular photos for team members.',
            demoData: {
                title: "Our Team",
                badge: "Faculty",
                description: "Meet our dedicated team members.",
                underlineColor: "from-indigo-500 to-purple-500",
                items: [
                    { name: "Dr. Smith", position: "Professor", image: "https://via.placeholder.com/150" },
                    { name: "Prof. Doe", position: "HOD", image: "https://via.placeholder.com/150" }
                ]
            }
        },
        {
            key: 'design_five',
            name: 'SWOT Analysis',
            description: 'Strengths, Weaknesses, Opportunities, Threats display.',
            demoData: {
                title: "Department SWOT",
                badge: "Analysis",
                description: "Analysis of our current standing.",
                swotData: {
                    strengths: ["Experienced Faculty", "Modern Labs"],
                    weaknesses: ["Limited Space"],
                    opportunities: ["Industry Collaboration"],
                    threats: ["Growing Competition"]
                }
            }
        },
        {
            key: 'design_six',
            name: 'Gradient Feature Grid',
            description: 'Dark gradient background with white transparent cards.',
            demoData: {
                title: "Why Choose Us?",
                items: [
                    { title: "Excellence", description: "Top notch quality.", icon: "FaAward" },
                    { title: "Innovation", description: "Cutting edge tech.", icon: "FaLightbulb" },
                    { title: "Community", description: "Strong alumni network.", icon: "FaUsers" }
                ]
            }
        },
        {
            key: 'design_seven',
            name: 'Tabs Component',
            description: 'Tabbed interface for organizing content.',
            demoData: {
                tabs: [
                    {
                        id: "tab1",
                        label: "Overview",
                        icon: "FaInfoCircle",
                        sections: [
                            {
                                id: "inner-1",
                                templateKey: "design_one",
                                data: { title: "Overview Content", variant: "simple", description: "This is inside a tab." }
                            }
                        ]
                    },
                    {
                        id: "tab2",
                        label: "Details",
                        icon: "FaList",
                        sections: []
                    }
                ]
            }
        },
        {
            key: 'design_eight',
            name: 'Carousel & Content',
            description: 'Split view with image slider and detailed content.',
            demoData: {
                title: "Infrastructure",
                badge: "Facilities",
                underlineColor: "from-orange-500 to-red-500",
                content: "State of the art labs and classrooms.",
                images: [{ src: "https://via.placeholder.com/400" }]
            }
        },
        {
            key: 'design_nine',
            name: 'News / Publications',
            description: 'List views for events, news, or publications.',
            demoData: {
                title: "Recent News",
                badge: "Updates",
                underlineColor: "from-blue-600 to-cyan-600",
                items: [
                    { title: "Event One", description: "Details about event.", date: "Jan 10" },
                    { title: "Publication", description: "Research paper published.", date: "Feb 15" }
                ]
            }
        },
        {
            key: 'design_ten',
            name: 'Icon Features (Top)',
            description: 'Clean grid with icons on top of cards.',
            demoData: {
                title: "Our Core Values",
                badge: "Values",
                description: "What drives us forward.",
                features: [
                    { title: "Integrity", description: "Honesty in all we do.", icon: "🛡️" },
                    { title: "Quality", description: "Pursuit of excellence.", icon: "⭐" },
                    { title: "Growth", description: "Continuous improvement.", icon: "📈" }
                ]
            }
        },
        {
            key: 'design_eleven',
            name: 'Split Feature (Text/Image)',
            description: 'Side-by-side text and image section.',
            demoData: {
                title: "About The Department",
                description: "Detailed description of the department's history and achievements.",
                image: "https://picsum.photos/200",
                buttonText: "Learn More",
                buttonLink: "#",
                reverse: false
            }
        },
        // Here I want fetch faculty data with department slug and display it in faculty grid
        {
            key: 'design_twelve',
            name: 'Faculty Grid (Detailed)',
            description: 'Detailed cards for faculty or team members with achievements.',
            demoData: {
                title: "Our Faculty",
                items: [] // Setting empty items triggers dynamic fetching by departmentId
            }
        },
        {
            key: 'design_thirteen',
            name: 'Departments Grid',
            description: 'Grid of departmental cards with icons and gradients.',
            demoData: {
                title: "Our Departments"
            }
        },
        {
            key: 'design_fourteen',
            name: 'Feature Grid (2 Cols)',
            description: 'Two column features with icons and gradients, supports external links.',
            demoData: {
                title: "Training & Placement and Clubs",
                badge: "Opportunities",
                description: "Explore career opportunities and student activities.",
                underlineColor: "from-yellow-500 to-orange-500",
                items: [
                    {
                        title: "Training & Placement Cell",
                        description: "Enhance your employability with our dedicated training programs, workshops, and placement assistance.",
                        link: "/tandpcell",
                        icon: "📈",
                        gradient: "from-yellow-500 to-orange-400",
                        target: "_blank"
                    },
                    {
                        title: "IET Club Nest",
                        description: "Join our vibrant student clubs to explore your interests, develop skills, and make lasting friendships.",
                        link: "https://ietclubnest.vercel.app/",
                        icon: "🎉",
                        gradient: "from-pink-500 to-red-400",
                        target: "_blank"
                    }
                ]
            }
        },
        {
            key: 'design_fifteen',
            name: 'Image Carousel',
            description: 'Full-width auto-playing image slider with captions.',
            demoData: {
                title: "Campus Tour",
                items: [
                    {
                        image: "/images/building2.jpg",
                        title: "IET Agra Campus",
                        description: "Explore our beautiful campus"
                    },
                    {
                        image: "/images/college_tour.jpg",
                        title: "College Tour",
                        description: "Students on a college tour"
                    },
                    {
                        image: "/images/college_teachers.png",
                        title: "Faculty Members",
                        description: "Dedicated faculty members"
                    }
                ]
            },
        },
        {
            key: 'design_sixteen',
            name: 'Student Projects Table',
            description: 'Table listing student projects with details and links.',
            demoData: {
                title: "Student Projects",
                description: "List of major projects by final year students.",
                projects: projects.length > 0 ? projects : [
                    {
                        batch: "2024",
                        studentName: "John Doe",
                        projectName: "AI Chatbot",
                        technology: "Python, NLP",
                        branch: "CSE",
                        supervisor: "Dr. Smith",
                        githubLink: "https://github.com",
                        pptLink: "https://google.com"
                    },
                    {
                        batch: "2024",
                        studentName: "Jane Smith",
                        projectName: "Smart Grid",
                        technology: "IoT, Arduino",
                        branch: "EE",
                        supervisor: "Prof. Johnson",
                        githubLink: "#",
                        pptLink: "#"
                    }
                ]
            }
        },
        {
            key: 'design_seventeen',
            name: 'GATE Qualified Table',
            description: 'Dedicated table for GATE Qualified student records.',
            demoData: {
                title: "GATE Qualifiers",
                description: "List of students who qualified GATE."
            }
        },
        {
            key: 'design_eighteen',
            name: 'Modern Department Hero',
            description: 'Gradient hero section with floating icons and stats.',
            demoData: {
                title: "Computer Science & Engineering",
                subtitle: "Institute of Engineering and Technology, Swami Vivekanand Campus, Dr. Bhimrao Ambedkar University, Agra",
                stats: [
                    { value: "12+", label: "Modern Labs" },
                    { value: "95%", label: "Placement Rate" },
                    { value: "8+", label: "Research Areas" }
                ],
                buttons: [
                    { text: "Explore Department", link: "#about", variant: "primary" },
                    { text: "Contact Us", link: "#contact", variant: "secondary" }
                ]
            }
        },
        {
            key: 'design_nineteen',
            name: "Vice Chancellor's Message",
            description: "Dedicated section for leadership message with image and quote.",
            demoData: {
                title: "Vice Chancellor's Message",
                image: "https://dbrau.ac.in/wp-content/uploads/elementor/thumbs/ashu_rani-qob6fukhcqrs0rce8uvi9u8791vatwg3wggmjx0dy8.webp",
                name: "Prof. Ashu Rani",
                designation: "Vice Chancellor - Dr. Bhimrao Ambedkar University, Agra",
                chairman: "Hon'ble Governor Smt. Anandiben Patel",
                quote: "To be a quality higher education Institution by producing students with knowledge, professional skill and ethical values and remain as preferred partner to the Industry and Community for their progress and development",
                content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <br/>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.</p>
                <br/>
                <p>Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.</p>
                <br/>
                <p>Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.</p>`
            }
        },
        {
            key: 'design_twenty_two',
            name: "Contact Form Section",
            description: "Two-column layout with Venue details (map, address) and a comprehensive Contact Form.",
            demoData: {
                title: "Feedback/Query Form",
                subtitle: "Please fill out the form below to get in touch with us.",
                buttonText: "Send",
                venueTitle: "Venue",
                venueName: "Institute of Engineering & Technology, Agra",
                venueDetails: "Khandari Campus, Agra - 282002\nPhone: +91-562-2858585\nEmail: contact@ietagra.ac.in",
                mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.8654876798224!2d78.0063233150567!3d27.19172298299881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974775d5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sInstitute%20of%20Engineering%20and%20Technology%20Agra!5e0!3m2!1sen!2sin!4v1622222222222!5m2!1sen!2sin"
            }
        },
        {
            key: 'design_twenty_three',
            name: "Advanced Gallery & Albums",
            description: "Future-ready gallery with Albums, Lightbox, and Video support.",
            demoData: {
                title: "University Media Gallery",
                subtitle: "Explore our campus events and memories.",
                layout: "albums",
                albums: [
                    {
                        id: "album-1",
                        title: "Campus Life",
                        cover: "https://picsum.photos/400/300?random=1",
                        description: "Photos from around the campus.",
                        media: [
                            { type: "image", src: "https://picsum.photos/800/600?random=2", caption: "Library Entrance" },
                            { type: "image", src: "https://picsum.photos/800/600?random=3", caption: "Main Auditorium" }
                        ]
                    },
                    {
                        id: "album-2",
                        title: "Annual Fest 2024",
                        cover: "https://picsum.photos/400/300?random=4",
                        media: [
                            { type: "video", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "Event Highlights" }
                        ]
                    }
                ]
            }
        },
        {
            key: 'design_twenty_four',
            name: "MOOC Courses Filterable Table",
            description: "Table for MOOC courses with filtering by Batch, Branch, and Platform.",
            demoData: {
                title: "Student MOOC Achievements",
                subtitle: "Online Certifications & Courses",
                description: "<p>Explore the online certifications completed by our students across various platforms.</p>",
                items: moocs.length > 0 ? moocs : [
                    { studentName: "Rohan Sharma", enrollmentNo: "123456", courseName: "Data Structures", platform: "NPTEL", score: "90", batch: "2024", branch: "CSE" },
                    { studentName: "Priya Singh", enrollmentNo: "123457", courseName: "Machine Learning", platform: "Coursera", score: "95", batch: "2024", branch: "ECE" },
                    { studentName: "Amit Verma", enrollmentNo: "123458", courseName: "Web Development", platform: "Udemy", score: "88", batch: "2025", branch: "CSE" },
                    { studentName: "Sneha Gupta", enrollmentNo: "123459", courseName: "Python for Everybody", platform: "Coursera", score: "92", batch: "2024", branch: "CSE" },
                    { studentName: "Vikram Malhotra", enrollmentNo: "123460", courseName: "Cloud Computing", platform: "NPTEL", score: "85", batch: "2025", branch: "IT" },
                    { studentName: "Anjali Desai", enrollmentNo: "123461", courseName: "Digital Marketing", platform: "Udemy", score: "89", batch: "2024", branch: "MBA" }
                ]
            }
        },
        {
            key: 'design_twenty_five',
            name: "Placement Records (Hall of Fame)",
            description: "Dedicated section for placement records with stats, filters, and tiered display.",
            demoData: {
                title: "Placement Highlights",
                subtitle: "Celebrating Success Stories",
                description: "<p>Our students continue to shine in the corporate world with top-tier placements.</p>",
                items: placements.length > 0 ? placements : [
                    { studentName: "Aarav Patel", batch: "2024", branch: "CSE", company: "Microsoft", package: "45 LPA", designation: "SDE I" },
                    { studentName: "Sanya Mir", batch: "2024", branch: "CSE", company: "Amazon", package: "42 LPA", designation: "SDE" },
                    { studentName: "Rahul Dravid", batch: "2024", branch: "ECE", company: "Qualcomm", package: "28 LPA", designation: "Hardware Engineer" },
                    { studentName: "Ishita Sharma", batch: "2024", branch: "IT", company: "Adobe", package: "22 LPA", designation: "MTS" },
                    { studentName: "Karan Singh", batch: "2024", branch: "ME", company: "Tata Motors", package: "8 LPA", designation: "GET" },
                    { studentName: "Neha Gupta", batch: "2024", branch: "CSE", company: "TCS", package: "3.36 LPA", designation: "Systems Engineer" },
                    { studentName: "Vikram Rathore", batch: "2024", branch: "EE", company: "Infosys", package: "3.6 LPA", designation: "Systems Engineer" },
                    { studentName: "Pooja Verma", batch: "2024", branch: "Civil", company: "L&T", package: "6 LPA", designation: "GET" }
                ]
            }
        },
        {
            key: 'design_twenty_six',
            name: "Student Achievements (Timeline)",
            description: "Visual timeline or card layout for displaying student awards and achievements.",
            demoData: {
                title: "Hall of Fame",
                subtitle: "Recognizing Excellence",
                description: "<p>A timeline of our students' remarkable achievements in various fields.</p>",
                // Fetch Data from Achievement Model Dynamically
                items: achievements.length > 0 ? achievements.map(item => ({
                    title: item.title,
                    studentName: item.studentName,
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    batch: item.batch,
                    branch: item.branch,
                    description: item.description
                })) : [
                    { title: "Smart India Hackathon Winner", studentName: "Team Innovators", date: "Sep 2024", batch: "2024", branch: "CSE", description: "Won the first prize in the Smart India Hackathon 2024 for developing an AI-based solution for agriculture." },
                    { title: "Best Research Paper", studentName: "Priya Sharma", date: "Aug 2024", batch: "2024", branch: "ECE", description: "Awarded Best Paper at the International Conference on Signal Processing for research on 6G communication." },
                    { title: "Gold Medal in Athletics", studentName: "Rahul Singh", date: "Jul 2024", batch: "2025", branch: "ME", description: "Secured Gold Medal in 100m sprint at the Inter-University Sports Meet." },
                    { title: "Google Summer of Code", studentName: "Amit Patel", date: "May 2024", batch: "2025", branch: "CSE", description: "Selected for GSoC 2024 with the Apache Software Foundation." },
                    { title: "Patent Granted", studentName: "Dr. Smith & Team", date: "Apr 2024", batch: "2024", branch: "EE", description: "Granted a patent for a novel solar power inversion technique." }
                ]
            }
        },
        {
            key: 'design_twenty_seven',
            name: "Animated Step Slider (Snabbit)",
            description: "Mobile swiper and desktop scrolling stack animation.",
            demoData: {
                title1: "Hi! Its Look",
                title2: "Cool Na?",
                cards: [
                    {
                        stepLabel: "STEP 1",
                        title: "LOREM IPSUM DOLOR",
                        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
                        image: "https://picsum.photos/200"
                    },
                    {
                        stepLabel: "STEP 2",
                        title: "TEMPOR INCIDIDUNT",
                        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
                        image: "https://picsum.photos/200"
                    },
                    {
                        stepLabel: "STEP 3",
                        title: "SED DO EIUSMOD",
                        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
                        image: "https://picsum.photos/200"
                    },
                    {
                        stepLabel: "STEP 4",
                        title: "MAGNA ALIQUA",
                        description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
                        image: "https://picsum.photos/200"
                    },
                    {
                        stepLabel: "STEP 5",
                        title: "NULLA PARIATUR",
                        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
                        image: "https://via.placeholder.com/600x400?text=Step+5"
                    },
                    {
                        stepLabel: "STEP 6",
                        title: "SIT VOLUPTATEM",
                        description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia.",
                        image: "https://via.placeholder.com/600x400?text=Step+6"
                    },
                    {
                        stepLabel: "STEP 7",
                        title: "QUIA CONSEQUUNTUR",
                        description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur adipisci.",
                        image: "https://via.placeholder.com/600x400?text=Step+7"
                    }
                ]
            }
        },
        {
            key: 'design_twenty_eight',
            name: 'Director\'s Message',
            description: 'Professional leadership message section with image and styled content.',
            demoData: {
                title: "Message from the Director",
                name: "Prof. V. Kamakoti",
                designation: "Director - IIT Madras",
                image: "/sites/default/files/2022-01/Director-Best_Resized_0.png",
                greeting: "Greetings to all!",
                content: `<p>It is with great pleasure that I write this in the capacity of the Director of this prestigious institute. I thank all the faculty members, students, and staff of IIT Madras for their continuing efforts every day in keeping this distinguished institute of national importance at the top of the ranking scales, year after year.</p>
                <p>The role of a campus in ensuring quality learning is of great significance and IIT Madras, which already has a world-class campus, will now ensure it is further infused with the spirit of inclusivity, by celebrating the pluralism of cultures, nationalities, and personalities in a global world. We envision our campus to reflect the ethos of innovation, entrepreneurship, and dynamism of spirit.</p>
                <p>Industry should be able to sit up and take notice of the impact we make and we should strive to ensure that our students continue to become part of global corporations and governments alike. As is said - change should be from within the system by being part of it and not exclusive to the system itself.</p>`,
                themeColor: "blue-600"
            }
        },
        {
            key: 'design_twenty_nine',
            name: 'Announcement Board',
            description: 'Scrolling marquee for latest notices and updates.',
            demoData: {
                title: "Announcements",
                announcements: [
                    { text: "Kashi Tamil Sangamam (KTS) 4.0", link: "https://kashitamil.bhu.edu.in" },
                    { text: "OPD Online Booking [Click here]", link: "https://bhuopd.com/" },
                    { text: "Admission Open for Session 2026-27", link: "#" }
                ],
                themeColor: "bg-red-600",
                speed: "30s"
            }
        },
        {
            key: 'design_thirty_one',
            name: 'Multimodal Testimonials',
            description: 'Display student/faculty testimonials with support for text, images, and YouTube videos.',
            demoData: {
                title: "Excellence Speaks",
                subtitle: "Hear what our community has to say about their journey with us.",
                badge: "Voices of IET",
                items: []
            }
        },
        {
            key: 'design_thirty_two',
            name: 'Common Image Gallery',
            description: 'Displays a grid of all images tagged as "Common" (University-wide).',
            demoData: {
                title: "Campus Gallery",
                subtitle: "Glimpses of our vibrant campus life.",
                badge: "Gallery"
            }
        },
        {
            key: 'design_thirty_three',
            name: 'Department Events Grid',
            description: 'Displays a grid of upcoming events for the department.',
            demoData: {
                title: "Upcoming Events",
                subtitle: "Check out what's happening in our department.",
                badge: "Events"
            }
        },
        {
            key: 'design_thirty_four',
            name: 'Research Papers List',
            description: 'List display of research papers with filtering support.',
            demoData: {
                title: "Research & Publications",
                subtitle: "Explore our latest research contributions.",
                badge: "Research"
            }
        }
    ];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % templates.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
    };

    const currentTemplate = templates[currentIndex]; 
    const Component = SectionRegistry[currentTemplate.key];
    const currentDept = departments.find(d => d.slug === currentSlug);

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Enter') onSelect(currentTemplate.key, currentTemplate.variant, currentTemplate.demoData);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, currentTemplate]); // Re-bind when index changes to capture current state if needed, though simpler ref usage is also possible.

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="inline-block bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all align-middle sm:max-w-5xl sm:w-full relative">

                    {/* Header */}
                    <div className="relative bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                                Select Component ({currentIndex + 1}/{templates.length})
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {currentTemplate.name} - {currentTemplate.description}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            type="button"
                            className="absolute right-6 bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            title="Close (Esc)"
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>


                    {/* Carousel Body */}
                    <div className="relative bg-gray-100 h-[60vh] flex items-center justify-center p-8 overflow-hidden group">

                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 z-20 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60 group-hover:opacity-100"
                            title="Previous (Left Arrow)"
                        >
                            <ChevronLeftIcon className="h-8 w-8" />
                        </button>

                        {/* Preview Container */}
                        <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-xl overflow-y-auto border border-gray-200 relative scrollbar-hide">
                            {/* Interaction Shield - prevents clicking inside the preview */}
                            <div className="absolute inset-0 z-10 bg-transparent cursor-default"></div>

                            {/* Rendered Component - Scaled Up for single view */}
                            <div className="transform origin-top-left scale-[0.6] sm:scale-[0.85] w-[166%] sm:w-[117%] h-full p-4 pointer-events-none select-none">
                                {Component ? (
                                    <Component
                                        {...currentTemplate.demoData}
                                        departmentId={currentDept?._id}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">Preview Not Available</div>
                                )}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 z-20 p-3 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60 group-hover:opacity-100"
                            title="Next (Right Arrow)"
                        >
                            <ChevronRightIcon className="h-8 w-8" />
                        </button>
                    </div>

                    {/* Footer / Controls */}
                    <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        {/* Indicators */}
                        <div className="flex space-x-2">
                            {templates.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    title={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>

                        {/* Confirm Action */}
                        <button
                            onClick={() => onSelect(currentTemplate.key, currentTemplate.variant, currentTemplate.demoData)}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Use This Template
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;
