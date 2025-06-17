import Hero06 from "@/components/hero-06/hero-06";
import HomeCollections from "../../components/collections/homeCollections";
// import HomeNewsHighlights from "@/components/bulletin/homeNews";
import IntroInfoCard from "@/components/Introduction/intro";
import HomeNewsEventsHighlights from "@/components/bulletin/homeNews";

const HomePage = () => {

  return (

    <>
      < Hero06 />
      < IntroInfoCard />
      < HomeCollections />
      < HomeNewsEventsHighlights />
    </>

  );
};

export default HomePage;

