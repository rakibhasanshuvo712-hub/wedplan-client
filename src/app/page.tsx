import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <FeaturedServices />
      <CategoriesSection />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
