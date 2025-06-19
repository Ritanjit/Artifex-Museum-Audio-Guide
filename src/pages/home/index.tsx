import Hero06 from "@/components/hero-06/hero-06";
import HomeCollections from "../../components/collections/homeCollections";
// import HomeNewsHighlights from "@/components/bulletin/homeNews";
import IntroInfoCard from "@/components/Introduction/intro";
import HomeNewsEventsHighlights from "@/components/bulletin/homeNews";

const HomePage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero06 />
      <IntroInfoCard />
      <HomeCollections />
      <HomeNewsEventsHighlights />
    </div>
  );
};

export default HomePage;

