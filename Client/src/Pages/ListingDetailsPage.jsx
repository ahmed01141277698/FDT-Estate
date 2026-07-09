import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ListingGallery from "../Components/DetailseListingPage/ListingGallery";
import ListingHeader from "../components/DetailseListingPage/ListingHeader";
import ListingStats from "../components/DetailseListingPage/ListingStats";
import ListingDescription from "../components/DetailseListingPage/ListingDescription";
import ListingFeatures from "../components/DetailseListingPage/ListingFeatures";
import ListingLocation from "../components/DetailseListingPage/ListingLocation";
import ContactCard from "../components/DetailseListingPage/ContactCard";
import RelatedListings from "../components/DetailseListingPage/RelatedListings";
import FloatingActions from "../components/DetailseListingPage/FloatingActions";
import LoadingSkeleton from "../components/DetailseListingPage/LoadingSkeleton";
import ErrorState from "../components/DetailseListingPage/ErrorState";
import Toast from "../components/DetailseListingPage/Toast";

export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params.listingId || params.id;

  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const localListingId = localStorage.getItem("listingId");
        const res = await fetch(`/api/listing/details/${listingId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);

        if (data.userRef) {
          try {
            const ownerRes = await fetch(`/api/user/${data.userRef}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const ownerData = await ownerRes.json();
            if (ownerData.success !== false) setOwner(ownerData);
          } catch {
            setOwner(null);
          }
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

  const fireToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleCopied = () => fireToast("تم نسخ الرابط بنجاح");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.name,
          url: window.location.href,
        });
      } catch {
        return;
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      handleCopied();
    }
  };

  const handleToggleSave = () => {
    setSaved((v) => !v);
    fireToast(saved ? "تم إزالة العقار من المحفوظات" : "تم حفظ العقار");
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !listing) return <ErrorState />;

  const galleryImages = (listing.imageUrl || []).map((img) => img.url);

  return (
    <div dir="rtl" className="bg-white min-h-screen pb-16">
      <ListingGallery images={galleryImages} title={listing.name} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <ListingHeader listing={listing} />
          <ListingStats listing={listing} />
          <ListingDescription description={listing.description} />
          <ListingFeatures listing={listing} />
          <ListingLocation address={listing.address} />
          <RelatedListings />
        </div>

        <ContactCard
          listing={listing}
          owner={owner}
          saved={saved}
          onToggleSave={handleToggleSave}
          onCopied={handleCopied}
        />
      </div>

      <FloatingActions
        saved={saved}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
      />

      <Toast message={toastMessage} show={showToast} />
    </div>
  );
}
