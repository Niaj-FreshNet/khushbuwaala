import { NoticeBar } from "@/components/Modules/Shop/NoticeBar";
import { ShopBanner } from "@/components/Modules/Shop/ShopBanner";
import { ClientShopProducts } from "@/components/Modules/Shop/ClientShopProducts";

type ShopShellProps = {
  // banner
  bannerHeading: string;
  bannerText: string;
  bannerLink?: string;
  bannerImages: { desktop: string; mobile: string };
  bannerAlt: string;

  // product inputs
  initialPage: number;
  categoryId?: string;
  categoryName?: string;
  specification?: string;
  section?: string;
  minPrice?: number;
  maxPrice?: number;
  accords?: string;
  perfumeNotes?: string;
  performance?: string;
  sortBy?: string;

  // behavior
  lockCategory?: boolean; // ✅ category pages can lock the category
  noticesHeading?: string;
};

export function ShopShell({
  bannerHeading,
  bannerText,
  bannerLink = "/shop",
  bannerImages,
  bannerAlt,

  initialPage,
  categoryId,
  categoryName,
  specification,
  section,
  minPrice,
  maxPrice,
  accords,
  perfumeNotes,
  performance,
  sortBy,

  lockCategory = false,
  noticesHeading = "World's Finest Perfume Oils",
}: ShopShellProps) {

  const notices = [
    "🚚 Free Nationwide Shipping on Orders Over ৳1000",
    "🔥 Up to 50% Off on Selected Premium Items",
    "✨ Authentic Quality Guaranteed - 100% Original Products",
    "🏪 Visit Our Banasree Outlet for In-Person Experience",
    "💝 Special Gift Wrapping Available for All Orders",
  ];

  return (
    <div className="w-full mx-auto mt-8 md:mt-10">
      {/* <ShopBanner
        heading={bannerHeading}
        text={bannerText}
        buttonText="Shop Now"
        link={bannerLink}
        images={bannerImages}
        altText={bannerAlt}
        variant="premium"
      /> */}

      <div className="py-0 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <NoticeBar heading={noticesHeading} notices={notices} interval={4500} />
      </div>

      <div id="products" className="bg-white pt-0 pb-8">
        <ClientShopProducts
          initialPage={initialPage}
          categoryId={categoryId}
          categoryName={categoryName}
          specification={specification}
          section={section}
          minPrice={minPrice}
          maxPrice={maxPrice}
          accords={accords}
          perfumeNotes={perfumeNotes}
          performance={performance}
          sortBy={sortBy}
          lockCategory={lockCategory}   // ✅ IMPORTANT
        />
      </div>
    </div>
  );
}
