
import  Hero  from "@/components/landing-page/Aceternity/Hero";
import  HowItWorks  from "@/components/landing-page/HowItWorks";
import  FAQ  from "@/components/landing-page/FAQ";
import  Footer  from "@/components/landing-page/Footer";
import  ScrollToTop  from "@/components/landing-page/ScrollToTop";
import { Team } from "@/components/landing-page/Aceternity/Team";
import JoinWaitlist from "@/components/landing-page/Aceternity/join-waitlist";
import Investor from "@/components/landing-page/Aceternity/Investor";
import HeroParallaxDemo from "@/components/landing-page/Aceternity/hero-parralax";

function App() {
  return (
    <>
      <Hero />
      <Investor />
      <HeroParallaxDemo/>
      <HowItWorks />
      <Team/>
      <JoinWaitlist/>
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;