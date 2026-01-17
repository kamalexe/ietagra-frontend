import { useState, useEffect } from 'react';
import PageService from '../services/PageService';
import AdmissionModal from '../utils/AdmissionModel';
import PageRenderer from '../components/PageBuilder/PageRenderer';

const Home = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdmissionModal config={pageData?.admissionModalConfig} />
      {/* Pass fetched data to PageRenderer to avoid double fetching */}
      <PageRenderer slug="home" data={pageData} />
    </div>
  );
};

export default Home;
