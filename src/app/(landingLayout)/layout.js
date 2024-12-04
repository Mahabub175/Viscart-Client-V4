import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import Navbar from "@/components/Shared/Navbar/Navbar";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <BackToTop />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
