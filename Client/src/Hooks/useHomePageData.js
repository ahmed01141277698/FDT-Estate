import { useEffect, useState } from "react";
import { homeService } from "../services/api/homeService";

export function useHomePageData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [featuredProperties, setFeaturedProperties] = useState(null);
  const [latestProperties, setLatestProperties] = useState(null);
  const [areas, setAreas] = useState(null);
  const [faq, setFaq] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const [featured, latest, areasData, faqData] = await Promise.all([
          homeService.getFeaturedProperties(),
          homeService.getLatestProperties(),
          homeService.getAreas(),
          homeService.getFaq(),
        ]);

        if (!mounted) {
          return;
        }

        setFeaturedProperties(featured?.properties || []);
        setLatestProperties(latest?.properties || []);
        setAreas(areasData?.areas || []);
        setFaq(faqData?.items || []);
      } catch (e) {
        if (mounted) {
          setError(e);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    error,
    featuredProperties,
    latestProperties,
    areas,
    faq,
  };
}


