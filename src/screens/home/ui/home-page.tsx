import { Container } from "@/src/shared/ui/container";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";
import { AboutSection } from "@/src/screens/home/ui/about-section";
import { BannerCarouselSection } from "@/src/screens/home/ui/banner-carousel-section";
import { BenefitsSection } from "@/src/screens/home/ui/benefits-section";
import { FeaturesSection } from "@/src/screens/home/ui/features-section";
import { HeroSection } from "@/src/screens/home/ui/hero-section";

export function HomePage() {
  return (
    <PublicLayout>
      <main className="pb-12 pt-6">
        <Container>
          <HeroSection />
          <AboutSection />
          <BannerCarouselSection />
          <FeaturesSection />
          <BenefitsSection />
        </Container>
      </main>
    </PublicLayout>
  );
}
