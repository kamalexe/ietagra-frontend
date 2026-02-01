// src/components/PageBuilder/PageRenderer.js
import React, { useEffect, useState } from 'react';
import PageService from '../../services/PageService';
import SectionRegistry from './SectionRegistry';

const PageRenderer = ({ slug, data }) => {
  const [pageData, setPageData] = useState(data || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setPageData(data);
      setLoading(false);
      return;
    }

    const fetchPageData = async () => {
      try {
        setLoading(true);
        const fetchedData = await PageService.getPageBySlug(slug);
        setPageData(fetchedData);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPageData();
    }
  }, [slug, data]);

  if (loading) {
    return <div className="p-10 text-center">Loading page...</div>;
  }

  if (error || !pageData) {
    return <div className="p-10 text-center text-red-500">Error loading page: {error || 'Page not found'}</div>;
  }

  return (
    <div className="page-renderer">
      {pageData.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const Component = SectionRegistry[section.templateKey];
          if (!Component || !section.visible) {
            return null;
          }
          return <Component
            key={section.id}
            {...section.data}
            departmentId={pageData.departmentId}
          />;
        })}
    </div>
  );
};

export default PageRenderer;
