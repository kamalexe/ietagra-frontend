import { useState, useEffect, useRef } from 'react';
import PageService from '../services/PageService';
import AdmissionModal from '../components/AdmissionModal';
import PageRenderer from '../components/PageBuilder/PageRenderer';
import SEO from '../components/SEO';

const Home = () => {
  const hasFetched = useRef(false);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchHomeData = async () => {
      try {
        const data = await PageService.getPageBySlug('home');
        setPageData(data);
      } catch (err) {
        console.error("Failed to load home page data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <>
        <SEO title="Home" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to the Institute of Engineering & Technology, Agra. Discover our programs, events, and campus life."
      />
      <div className="min-h-screen bg-gray-50">
        <AdmissionModal config={pageData?.admissionModalConfig} />
        {/* Pass fetched data to PageRenderer to avoid double fetching */}
        <PageRenderer slug="home" data={pageData} />
      </div>
    </>
  );
};

export default Home;
