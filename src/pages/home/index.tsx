import Icons from "@/assets/icons";
import useAppStore from "@/lib/hooks/useAppStore";
import { Button } from "@/components/ui/button";
import Hero06 from "@/components/hero-06/hero-06";
import heroImage from "../../assets/herobg.jpg";
import { BackgroundPattern } from "../../components/hero-06/background-pattern";
import Carousel from "@/components/carousel/carousel";
import LatestNewsBulletin from "@/components/bulletin/bulletin";
import Collections from "../collections/collections";
import QRScanner from "@/components/qrScanner/QRScanner";
import HomeCollections from "../../components/collections/homeCollections";
import ScrollToTop from "@/components/scrollTop/scrollTop";
import HomeNewsHighlights from "@/components/bulletin/homeNews";
import { ChevronDown } from "lucide-react";
import IntroInfoCard from "@/components/Introduction/intro";

const HomePage = () => {
  const { isLoggedIn, setIsLoggedIn, isLoggedInLoading } = useAppStore();

  function setShowScanner(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Hero06 />
      < IntroInfoCard />
      < HomeCollections />
      < HomeNewsHighlights />
      
    </>
  );
};

export default HomePage;

