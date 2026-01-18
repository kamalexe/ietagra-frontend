import React from 'react';
import { useParams } from 'react-router-dom';
import PageRenderer from '../components/PageBuilder/PageRenderer';

const DynamicPage = () => {
    const { slug } = useParams();

    return (
        <div className="min-h-screen bg-gray-50">
            <PageRenderer slug={slug} />
        </div>
    );
};

export default DynamicPage;
