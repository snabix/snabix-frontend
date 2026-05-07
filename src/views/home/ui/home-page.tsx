import { Container } from "@/src/shared/ui/container";
import { PublicLayout } from "@/src/widgets/layout/ui/public-layout";
import { AboutSection } from "@/src/views/home/ui/about-section";
import { BannerCarouselSection } from "@/src/views/home/ui/banner-carousel-section";
import { BenefitsSection } from "@/src/views/home/ui/benefits-section";
import { FeaturesSection } from "@/src/views/home/ui/features-section";
import { HeroSection } from "@/src/views/home/ui/hero-section";

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
