import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Wrench,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  CheckCircle,
  ChevronRight,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Star,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="MaintainPro Logo" 
              className="h-10 w-10 rounded-xl shadow-lg shadow-sky-500/20"
            />
            <span className="font-bold text-xl tracking-tight">
              MaintainPro
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="text-sm font-medium shadow-lg shadow-sky-500/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a href="#pricing" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <div className="flex gap-3 pt-3 border-t border-border">
                <ThemeToggle />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="text-sm font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="text-sm font-medium shadow-lg shadow-sky-500/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-400/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
            <div className="absolute inset-0 dot-pattern opacity-30" />
          </div>

          <div className="container px-4 md:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300 text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Trusted by 10,000+ facility managers
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-foreground">
                  Streamline Your{" "}
                  <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    Facility Maintenance
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Track requests, assign technicians, and resolve issues faster with our all-in-one platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-sky-500/20">
                      Start for free <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold">
                      View Demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm font-semibold">4.9/5</span>
                    <span className="text-sm text-muted-foreground">(2,500+ reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-sky-500/10">
                    <img
              src="/hero.webp"
              alt="Maintenance management system hero"
              className="w-full h-full object-cover"
            />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-white dark:bg-slate-900/50 border-y border-border">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Active Users", icon: Users },
                { number: "98%", label: "Satisfaction", icon: Star },
                { number: "24/7", label: "Support", icon: Clock },
                { number: "500+", label: "Companies", icon: Building2 },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-sky-600" />
                    </div>
                    <p className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">{stat.number}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 dark:bg-slate-900">
          <div className="container px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful features to manage your maintenance requests
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Wrench,
                  title: "Smart Assignment",
                  desc: "Route requests to the right technicians based on priority, category, and availability.",
                  bg: "bg-sky-600 text-white",
                },
                {
                  icon: Clock,
                  title: "Real-time Tracking",
                  desc: "Live status updates, comments, and notifications keep everyone in the loop.",
                  bg: "bg-white dark:bg-slate-800 text-foreground border border-border",
                },
                {
                  icon: ShieldCheck,
                  title: "Role-Based Access",
                  desc: "Secure access control for Admins, Technicians, and Requesters.",
                  bg: "bg-white dark:bg-slate-800 text-foreground border border-border",
                },
                {
                  icon: BarChart3,
                  title: "Analytics & Reports",
                  desc: "Detailed reports on request trends and completion rates.",
                  bg: "bg-white dark:bg-slate-800 text-foreground border border-border",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-xl transition-all duration-200 hover:shadow-lg ${feature.bg}`}
                >
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-24 bg-white dark:bg-slate-900/50">
          <div className="container px-4 md:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400 mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">3 Simple Steps to Better Maintenance</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Create a Request",
                  desc: "Submit a maintenance request with details, priority, and photos.",
                  icon: FileText,
                },
                {
                  number: "02",
                  title: "Assign & Track",
                  desc: "Assign to a technician and track progress in real-time.",
                  icon: LayoutDashboard,
                },
                {
                  number: "03",
                  title: "Resolve & Review",
                  desc: "Complete the job, add notes, and leave feedback.",
                  icon: CheckCircle,
                },
              ].map((step, i) => (
                <div key={i} className="relative p-8">
                  <div className="absolute top-8 right-8 text-6xl font-bold text-muted-foreground/10">
                    {step.number}
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 text-white">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="w-full py-24">
          <div className="container px-4 md:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400 mb-3">Testimonials</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">What Our Customers Say</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Facility Manager",
                  company: "TechCorp",
                  avatar: "S",
                  quote: "MaintainPro has reduced our average resolution time by 40%. It's a game-changer!",
                },
                {
                  name: "Mike Chen",
                  role: "Maintenance Director",
                  company: "GlobalBuild",
                  avatar: "M",
                  quote: "The analytics dashboard gives us insights we never had before. Highly recommended.",
                },
                {
                  name: "Emily Davis",
                  role: "Operations Lead",
                  company: "RetailMax",
                  avatar: "E",
                  quote: "Easy to use, excellent support, and our team loves it. Couldn't ask for more.",
                },
              ].map((testimonial, i) => (
                <Card key={i} className="p-8 border-border bg-white dark:bg-slate-900/60">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="w-full py-24">
          <div className="container px-4 md:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 p-12 md:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">Ready to Get Started?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of facility managers who trust MaintainPro to keep their operations running smoothly.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-semibold text-sky-700 hover:text-sky-800 bg-white">
                      Start Free Trial <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="mailto:sales@maintainpro.com">
                    <Button size="lg" variant="outline" className="h-14 px-10 text-base font-semibold border-white/30 text-white hover:bg-white/10">
                      Contact Sales
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="container px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
            <img 
              src="/logo.png" 
              alt="MaintainPro Logo" 
              className="h-10 w-10 rounded-xl"
            />
            <span className="text-xl font-bold text-white">MaintainPro</span>
          </div>
              <p className="text-slate-400 mb-6">
                Streamline your facility maintenance with our all-in-one platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  support@maintainpro.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} MaintainPro Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-slate-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
