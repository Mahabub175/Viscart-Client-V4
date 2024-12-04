import Banner from "@/components/LandingPages/Home/Banner";
import NewArrivalProducts from "@/components/LandingPages/Home/Products/NewArrivalProducts";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart website.",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <NewArrivalProducts />
    </div>
  );
};

export default page;
