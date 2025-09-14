"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { Trophy, Calendar, Users, Zap, Star, ChevronRight, Sword, Target, Crown, Smartphone, BookOpen, Shield,  } from 'lucide-react';
import { AuroraText } from "@/components/magicui/aurora-text";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function MainNav() {
  const navItems = [
    {
      name: "Tournament",
      link: "#tournaments",
    },
    {
      name: "Rules",
      link: "#rules",
    },
    {
      name: "Partner",
      link: "#partners",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" className="text-white">Login</NavbarButton>
            <NavbarButton variant="primary">Register</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
               Register
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <DummyContent />

      {/* Navbar */}
    </div>
  );
}

const DummyContent = () => {
   const words = [
    {
      text: "Mobile",
    },
    {
      text: "Gaming",
    },
    {
      text: "Tournament",
    },
    {
      text: "Platform",
    },
    {
      text: "for",
    },
    {
      text: "BGMI",
      className: "text-blue-500 dark:text-blue-500",
    },

  ];
  

  const tournaments = [
    {
      id: 1,
      name: "BGMI MOBILE MASTERS",
      game: "BGMI",
      prize: "₹5,00,000",
      players: 500,
      date: "Dec 15, 2025",
      status: "upcoming",
      image: "🎯",
      mode: "Squad (4v4)"
    },
    {
      id: 2,
      name: "FREE FIRE WORLD SERIES",
      game: "Free Fire",
      prize: "₹10,00,000",
      players: 800,
      date: "Dec 20, 2025",
      status: "upcoming",
      image: "🔥",
      mode: "Squad (4v4)"
    },
    {
      id: 3,
      name: "BGMI PRO LEAGUE",
      game: "BGMI",
      prize: "₹7,50,000",
      players: 320,
      date: "Dec 10, 2025",
      status: "live",
      image: "⚡",
      mode: "Squad (4v4)"
    }
  ];

  

  const developers = [
    {
      name: "Arjun Sharma",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format",
      tech: "TOURNAMENT ARRANGEMENTS"
    },
    {
      name: "Vikash Agarahari",
      role: "Website designer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format",
      tech: "Full Stack Developer"
    },
    {
      name: "Amresh Yadav",
      role: "Tournament Head",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face&auto=format",
      tech: "BGMI MASTER"
    }
  ];

  const rules = [
    {
      title: "Registration Rules",
      points: [
        "Players must be 16+ years old to participate",
        "Valid government ID required for verification",
        "One account per player, multiple accounts will result in disqualification",
        "Registration closes 24 hours before tournament start"
      ]
    },
    {
      title: "Match Rules",
      points: [
        "Squad matches only (4 players per team)",
        "Classic mode matches on Erangel, Miramar, Sanhok maps",
        "Match duration: 30 minutes maximum",
        "No emulators allowed - mobile devices only"
      ]
    },
    {
      title: "Fair Play",
      points: [
        "Zero tolerance for cheating, hacking, or exploiting",
        "Screen recording mandatory during matches",
        "Abusive language or toxic behavior results in immediate ban",
        "All devices subject to inspection before matches"
      ]
    },
    {
      title: "Prize Distribution",
      points: [
        "Winners announced within 48 hours of tournament end",
        "Prizes transferred to registered bank accounts only",
        "Tax deductions as per Indian government regulations",
        "Minimum 7 days processing time for prize distribution"
      ]
    }
  ];

  const stats = [
    { label: "Active Players", value: "50K+", icon: Users },
    { label: "Total Prize Pool", value: "₹2Cr+", icon: Trophy },
    { label: "Tournaments", value: "150+", icon: Target },
    { label: "Champions", value: "500+", icon: Crown }
  ];

  return (
    <div>
    <div>
  <div className="max-w-7xl mx-auto text-center pt-16 sm:pt-24 px-4">
    {/* Top badge */}
    <div className="mb-6 sm:mb-8 flex justify-center">
      <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
        <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-yellow-400" />
        <span className="text-xs sm:text-sm">
          Live BGMI & Free Fire Tournaments!
        </span>
      </div>
    </div>

    {/* Heading */}
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl lg:text-[130px] leading-tight">
      TANDAV <AuroraText>ESPORTS</AuroraText>
    </h1>

    {/* Typewriter - center on mobile */}
    <div className="mt-2 sm:mt-4 md:ml-[150px] lg:ml-[290px]">
      <TypewriterEffectSmooth words={words} />
    </div>

    {/* Highlights */}
    <div className="w-full px-2 sm:px-4 py-4 sm:py-1">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-4">
        {/* Mobile Only */}
        <div className="flex items-center space-x-2 text-purple-400">
          <Smartphone className="w-5 h-5 sm:w-6 lg:w-7 lg:h-7" />
          <span className="font-semibold text-sm sm:text-lg lg:text-xl">
            Mobile Only
          </span>
        </div>

        {/* Dot */}
        <div className="hidden sm:block w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>

        {/* Prize */}
        <div className="flex items-center space-x-2 text-pink-400">
          <Trophy className="w-5 h-5 sm:w-6 lg:w-7 lg:h-7" />
          <span className="font-semibold text-sm sm:text-lg lg:text-xl">
            ₹50L+ Prizes
          </span>
        </div>

        {/* Dot */}
        <div className="hidden sm:block w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>

        {/* Players */}
        <div className="flex items-center space-x-2 text-blue-400">
          <Users className="w-5 h-5 sm:w-6 lg:w-7 lg:h-7" />
          <span className="font-semibold text-sm sm:text-lg lg:text-xl">
            10K+ Players
          </span>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 lg:my-7 mt-6">
      <button className="w-full sm:w-auto shadow-[inset_0_0_0_2px_#616467] text-white px-8 sm:px-12 py-3 rounded tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 cursor-pointer">
        Join Now
      </button>

      <button className="w-full sm:w-auto hover:bg-green-500 bg-blue-500 cursor-pointer text-white px-8 sm:px-12 py-3 rounded">
        Watch Live
      </button>
    </div>
  </div>
</div>

 {/* Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-500/30">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section id="tournaments" className="relative z-10 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured Tournaments
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">The biggest mobile gaming competitions with massive prizes</p>
          </div>

         {/* tournament tabs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-500/10 to-black/20 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl lg:text-4xl">{tournament.image}</div>
                    <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'live' 
                        ? 'bg-red-500/20 text-red-400 animate-pulse' 
                        : tournament.status === 'upcoming'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {tournament.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{tournament.game}</p>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
                    <div className="text-center">
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-green-400">{tournament.prize}</div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-blue-400">{tournament.players}</div>
                      <div className="text-xs text-gray-400">Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-purple-400">{tournament.mode}</div>
                      <div className="text-xs text-gray-400">Mode</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center text-xs sm:text-sm text-gray-400">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      {tournament.date}
                    </div>
                    <button className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all border border-purple-500/30">
                      {tournament.status === 'live' ? 'Watch' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournament Rules */}
      <section id="rules" className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-purple-400" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tournament Rules
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">Fair play guidelines for all participants</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {rules.map((section, index) => (
              <div key={index} className="bg-gradient-to-b from-purple-500/10 to-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-purple-500/40 transition-all">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-xs sm:text-sm text-gray-300 flex items-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <button className="px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all border border-purple-500/30">
              Download Complete Rulebook
            </button>
          </div>
        </div>
      </section> 

      {/* Developers Section */}
      <section id="partners" className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-purple-400" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">The talented minds behind the platform</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {developers.map((developer, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto rounded-2xl overflow-hidden border-4 border-purple-500/20 group-hover:border-purple-500/60 transition-all group-hover:scale-105">
                    <img 
                      src={developer.image} 
                      alt={developer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                    {developer.role}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors px-4">{developer.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm px-4">{developer.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 backdrop-blur-sm border border-purple-500/20">
            <Sword className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 text-purple-400" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Dominate Mobile Gaming?
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Join thousands of BGMI and Free Fire players competing for massive prize pools. 
              Your mobile gaming legend starts here.
            </p>
            <button className="group w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg sm:text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center mx-auto">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-spin" />
              Start Your Journey
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 bg-black/40 backdrop-blur-sm border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TANDAV GAMING
            </span>
          </div>
          <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base px-4">
            India's premier destination for BGMI and Free Fire tournaments.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>

</div>

  );
};
