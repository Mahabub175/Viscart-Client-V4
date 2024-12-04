import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import Navbar from "@/components/Shared/Navbar/Navbar";
import GlobalCart from "@/components/Shared/Product/GlobalCart";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <GlobalCart />
      <BackToTop />
      <LandingFooter />
    </>
  );
};

export default LandingLayout;
