import React from 'react';
import { useParams } from 'react-router-dom';
import PageRenderer from '../components/PageBuilder/PageRenderer';

const DynamicPage = () => {
    const params = useParams();
    const { slug, campusSlug, courseSlug } = params;

    let finalSlug = slug || '';

    if (campusSlug && courseSlug) {
        finalSlug = `campus/${campusSlug}/${courseSlug}`;
    } else if (campusSlug) {
        finalSlug = `campus/${campusSlug}`;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {finalSlug ? <PageRenderer slug={finalSlug} /> : <div className="p-10 text-center">Invalid Page Slug</div>}
        </div>
    );
};

export default DynamicPage;
