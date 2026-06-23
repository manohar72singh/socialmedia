import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import NewsSection from './components/NewsSection';
import ContactForm from './components/ContactForm';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import PageHero from './components/PageHero';
import ScrollProgressBar from './components/ScrollProgressBar';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import NotFound from './components/NotFound';
import ClientLogos from './components/ClientLogos';
import Process from './components/Process';
import CaseStudies from './components/CaseStudies';
import FAQ from './components/FAQ';
import CTABanner from './components/CTABanner';
import WhatsAppButton from './components/WhatsAppButton';
import Pricing from './components/Pricing';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import Awards from './components/Awards';
import GrowthToolsHub from './components/GrowthToolsHub';

import ClientLogin from './pages/ClientLogin';
import ClientDashboard from './pages/ClientDashboard';
import ProposalView from './pages/ProposalView';
import Lenis from 'lenis';
import Analytics from './components/Analytics';
import { SettingsProvider } from './context/SettingsContext';

import AdminLogin from './pages/AdminLogin';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));
import ExitIntentPopup from './components/ExitIntentPopup';

// ── Page transition wrapper ──
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
};

function PageTransition({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

// ── Layout wrapper ──
function Layout({ children }) {
  return (
    <>
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  );
}

// ── Pages ──
function HomePage() {
  return (
    <Layout>
      <Helmet>
        <title>Tech Digi | AI-Powered Digital Marketing Agency</title>
        <meta name="description" content="Tech Digi is a next-generation AI-powered digital marketing agency. We help brands dominate with SEO, Social Media Marketing, Web Design, PPC Ads and intelligent automation." />
      </Helmet>
      <PageTransition>
        <Hero />
        <ClientLogos />
        <About />
        <Services />
        <GrowthToolsHub />
        <Process />
        <CaseStudies />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Tech Digi — AI-Powered Marketing Agency</title>
        <meta name="description" content="Learn about Tech Digi — an AI-powered marketing agency helping brands grow with data-driven strategies, cutting-edge technology, and creative excellence." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Who We Are"
          title="We Build"
          highlight="Digital Success"
          subtitle="Tech Digi is an AI-powered marketing agency combining cutting-edge technology with creative strategies to deliver exceptional results."
        />
        <About />
        <WhyUs />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function ServicesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Services | Tech Digi — SEO, Social Media, Web Design & More</title>
        <meta name="description" content="Explore Tech Digi services — SEO, Social Media Marketing, Web Design, PPC Ads, Content Marketing and AI Automation. Everything your brand needs to grow." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Our Expertise"
          title="Services That Drive"
          highlight="Growth"
          subtitle="From SEO to social media and beyond — we offer everything your brand needs to dominate the digital landscape."
        />
        <Services />
        <ROICalculator />
        <Process />
        <CaseStudies />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function PricingPage() {
  return (
    <Layout>
      <Helmet>
        <title>Pricing | Tech Digi — Digital Marketing Packages</title>
        <meta name="description" content="Transparent pricing plans for Tech Digi digital marketing services. Starter, Growth & Enterprise packages. No hidden fees, no long contracts." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Our Pricing"
          title="Simple Plans,"
          highlight="Real Results"
          subtitle="No hidden fees. No long-term contracts. Choose a plan that fits your goals and budget — and start growing today."
        />
        <Pricing />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function NewsPage() {
  return (
    <Layout>
      <Helmet>
        <title>News & Insights | Tech Digi</title>
        <meta name="description" content="Stay updated with the latest digital marketing news and industry insights from Tech Digi — your guide to the ever-changing digital landscape." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Industry Insights"
          title="Latest"
          highlight="Marketing News"
          subtitle="Stay ahead of the curve with the latest trends, tips, and news from the world of digital marketing."
        />
        <NewsSection />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function ContactPage() {
  return (
    <Layout>
      <Helmet>
        <title>Contact | Tech Digi — Book a Free Strategy Call</title>
        <meta name="description" content="Get in touch with Tech Digi. Book a free 30-minute strategy call and discover how we can grow your business with AI-powered marketing." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Get In Touch"
          title="Let's Grow Your"
          highlight="Business"
          subtitle="Have a project in mind? Book a free strategy call and our experts will create a custom growth plan for your business."
        />
        <ContactForm />
        <FAQ />
      </PageTransition>
    </Layout>
  );
}

function TermsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | Tech Digi</title>
        <meta name="description" content="Terms of Service for Tech Digi — read our terms and conditions carefully before using our services." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Legal"
          title="Terms of"
          highlight="Service"
          subtitle="Please read these terms and conditions carefully before using our services."
        />
        <Terms />
      </PageTransition>
    </Layout>
  );
}

function PrivacyPage() {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Tech Digi</title>
        <meta name="description" content="Privacy Policy for Tech Digi — how we collect, use, and protect your personal information." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Legal"
          title="Privacy"
          highlight="Policy"
          subtitle="How we collect, use, and protect your personal information."
        />
        <Privacy />
      </PageTransition>
    </Layout>
  );
}

// ── Animated Routes wrapper ──
function PortfolioPage() {
  return (
    <Layout>
      <Helmet>
        <title>Portfolio | Tech Digi — Our Work & Results</title>
        <meta name="description" content="Browse Tech Digi's portfolio of successful digital marketing campaigns — SEO, Social Media, Web Design, PPC & more with proven results." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Our Portfolio"
          title="Projects That"
          highlight="Delivered Results"
          subtitle="Real campaigns, real clients, real numbers. See how we've helped brands grow across every industry."
        />
        <Portfolio />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function TeamPage() {
  return (
    <Layout>
      <Helmet>
        <title>Our Team | Tech Digi — Expert Marketers</title>
        <meta name="description" content="Meet the Tech Digi team — expert SEO specialists, social media managers, designers and paid ads specialists driving results for our clients." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Our Team"
          title="The Experts Behind"
          highlight="Your Growth"
          subtitle="Passionate specialists who live and breathe digital marketing — each a master in their craft."
        />
        <Team />
        <Awards />
        <CTABanner />
      </PageTransition>
    </Layout>
  );
}

function BlogPage() {
  return (
    <Layout>
      <Helmet>
        <title>Blog | Tech Digi — Digital Marketing Insights</title>
        <meta name="description" content="Free digital marketing guides, SEO tips, social media strategies and expert insights from Tech Digi's team of specialists." />
      </Helmet>
      <PageTransition>
        <PageHero
          badge="Blog & Insights"
          title="Free Marketing"
          highlight="Knowledge"
          subtitle="Actionable guides, industry insights, and expert tactics — completely free from our team to you."
        />
        <Blog />
      </PageTransition>
    </Layout>
  );
}

function BlogDetailPage() {
  return (
    <Layout>
      <Helmet>
        <title>Blog Post | Tech Digi</title>
        <meta name="description" content="Read the latest insights and guides from Tech Digi." />
      </Helmet>
      <PageTransition>
        <BlogDetail />
      </PageTransition>
    </Layout>
  );
}

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem(role === 'admin' ? 'admin_token' : 'client_token');
  if (!token) {
    return <Navigate to={role === 'admin' ? '/admin-login' : '/client'} replace />;
  }
  // Optional: In a full app you'd verify the token via API here.
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/proposal/:id" element={<ProposalView />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Suspense fallback={<div className="h-screen flex items-center justify-center text-white">Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/client" element={<ClientLogin />} />
        <Route 
          path="/:username" 
          element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

// ── Scroll to top on navigation ──
function ScrollToTopNav() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ── App ──
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Analytics />
        <ScrollToTopNav />
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { background: '#1E293B', color: '#F8FAFC', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.3)' } }}
        />
        <Preloader />
        <ExitIntentPopup />
        <SettingsProvider>
          <AnimatedRoutes />
        </SettingsProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
