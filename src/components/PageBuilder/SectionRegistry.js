// src/components/PageBuilder/SectionRegistry.js
import React from 'react';
import DesignOne from './sections/DesignOne';
import DesignTwo from './sections/DesignTwo';
import DesignThree from './sections/DesignThree';
import DesignFour from './sections/DesignFour';
import DesignFive from './sections/DesignFive';
import DesignSix from './sections/DesignSix';
import DesignSeven from './sections/DesignSeven';
import DesignEight from './sections/DesignEight';
import DesignNine from './sections/DesignNine';
import DesignTen from './sections/DesignTen';
import DesignEleven from './sections/DesignEleven';
import DesignTwelve from './sections/DesignTwelve';
import DesignThirteen from './sections/DesignThirteen';
import DesignFourteen from './sections/DesignFourteen';
import DesignSixteen from './sections/DesignSixteen';
import DesignSeventeen from './sections/DesignSeventeen';
import DesignEighteen from './sections/DesignEighteen';
import DesignNineteen from './sections/DesignNineteen';
import DesignTwenty from './sections/DesignTwenty';
import DesignTwentyOne from './sections/DesignTwentyOne';
import DesignTwentyTwo from './sections/DesignTwentyTwo';
import DesignTwentyThree from './sections/DesignTwentyThree';
import DesignTwentyFour from './sections/DesignTwentyFour';
import DesignTwentyFive from './sections/DesignTwentyFive';
import DesignTwentySix from './sections/DesignTwentySix';
import DesignTwentySeven from './sections/DesignTwentySeven';
import DesignTwentyEight from './sections/DesignTwentyEight';
import DesignTwentyNine from './sections/DesignTwentyNine';
import DesignThirty from './sections/DesignThirty';
import DesignThirtyOne from './sections/DesignThirtyOne';
import DesignThirtyTwo from './sections/DesignThirtyTwo';
import DesignThirtyThree from './sections/DesignThirtyThree';
import DesignThirtyFour from './sections/DesignThirtyFour';
import DesignFifteen from './sections/DesignFifteen';
import DesignThirtyFive from './sections/DesignThirtyFive';

// Adapters for new documentation-based templates
const HeroSection = (props) => <DesignOne {...props} />;
const AboutBrief = (props) => <DesignOne {...props} description={props.text} variant="simple" />;
const DepartmentHero = (props) => (
    <DesignOne
        {...props}
        description={props.subtitle}
        variant="hero"
        buttons={props.chips?.map(c => ({ text: c.label, link: c.value, primary: true }))}
    />
);
const HodMessage = (props) => (
    <DesignFour
        title="From the HOD's Desk"
        description={props.message}
        items={[{
            name: props.name,
            position: props.designation,
            image: props.image,
            description: props.message
        }]}
    />
);
const VisionMission = (props) => (
    <DesignFive
        title="Vision & Mission"
        description={props.vision}
        swotData={{ strengths: props.mission || [] }} // Mapping mission to list-compatible prop
    />
);
const StatsGrid = (props) => <DesignNine {...props} />; // Assuming DesignNine can handle stats or we use another

const SectionRegistry = {
    design_one: DesignOne,
    design_two: DesignTwo,
    design_three: DesignThree,
    design_four: DesignFour,
    design_five: DesignFive,
    design_six: DesignSix,
    design_seven: DesignSeven,
    design_eight: DesignEight,
    design_nine: DesignNine,
    design_ten: DesignTen,
    design_eleven: DesignEleven,
    design_twelve: DesignTwelve,
    design_thirteen: DesignThirteen,
    design_fourteen: DesignFourteen,
    design_fifteen: DesignFifteen,
    design_sixteen: DesignSixteen,
    design_seventeen: DesignSeventeen,
    design_eighteen: DesignEighteen,
    design_nineteen: DesignNineteen,
    design_twenty: DesignTwenty,
    design_twenty_one: DesignTwentyOne,
    design_twenty_two: DesignTwentyTwo,
    design_twenty_three: DesignTwentyThree,
    design_twenty_four: DesignTwentyFour,
    design_twenty_five: DesignTwentyFive,
    design_twenty_six: DesignTwentySix,
    design_twenty_seven: DesignTwentySeven,
    design_twenty_eight: DesignTwentyEight,
    design_twenty_nine: DesignTwentyNine,
    design_thirty: DesignThirty,
    design_thirty_one: DesignThirtyOne,
    design_thirty_two: DesignThirtyTwo,
    design_thirty_three: DesignThirtyThree,
    design_thirty_four: DesignThirtyFour,

    // New Aliases
    hero_section: HeroSection,
    about_brief: AboutBrief,
    department_hero: DepartmentHero,
    hod_message: HodMessage,
    vision_mission: VisionMission,
    stats_grid: StatsGrid,
    director_message: DesignTwentyEight,
    announcement_board: DesignTwentyNine,
    university_media_gallery: DesignThirty,
    common_image_gallery: DesignThirtyTwo,
    department_events_grid: DesignThirtyThree,
    design_thirty_four: DesignThirtyFour,
    design_thirty_five: DesignThirtyFive
};

export default SectionRegistry;
