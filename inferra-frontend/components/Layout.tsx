'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isHomePage && (
                <Link href="/">
                  <Button variant="ghost" size="sm" className="relative group h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl p-0">
                    <div className="absolute inset-0 bg-primary/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              )}
              
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group logo-container">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg sm:rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-200 sm:border-2">
                    {mounted && (
                      <svg 
                        className="logo-svg w-full h-full p-0.5 sm:p-1" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient gradientTransform="rotate(25)" id="header-brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#945069" stopOpacity="1"></stop>
                            <stop offset="100%" stopColor="#86C866" stopOpacity="1"></stop>
                          </linearGradient>
                        </defs>
                        <g fill="url(#header-brand-gradient)">
                          <path d="M15.965 16.258l.707-.707 10.39 10.39-.707.707z"></path>
                          <path d="M4.935 26.357L26.018 5.274l.707.707L5.642 27.065z"></path>
                          <path d="M31 1v4.194h-4.194V1H31m1-1h-6.194v6.194H32V0zM31 26.806V31h-4.194v-4.194H31m1-1h-6.194V32H32v-6.194zM5.194 26.806V31H1v-4.194h4.194m1-1H0V32h6.194v-6.194z"></path>
                        </g>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold text-foreground leading-tight">
                    Inferra
                  </span>
                  <span className="text-xs text-muted-foreground -mt-0.5 sm:-mt-1 leading-tight">
                    AI Assistant
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative group h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Sun className="h-3 w-3 sm:h-4 sm:w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-3 w-3 sm:h-4 sm:w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}