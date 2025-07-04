'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import PDFUploader from '@/components/PDFUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const handleUploadSuccess = (filename: string) => {
    setUploadedFilename(filename);
    sessionStorage.setItem('uploadedPDF', filename);
    
    setTimeout(() => {
      router.push('/chat');
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl animate-pulse"></div>
              <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl float border-2 border-gray-100">
                {/* Reverted to previous SVG logo */}
                <svg 
                  className="h-10 w-10 sm:h-12 lg:h-16 sm:w-12 lg:w-16 mx-auto" 
                  viewBox="0 0 32 32" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient gradientTransform="rotate(25)" id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#945069" stopOpacity="1"></stop>
                      <stop offset="100%" stopColor="#86C866" stopOpacity="1"></stop>
                    </linearGradient>
                  </defs>
                  <g fill="url(#brand-gradient)">
                    <path d="M15.965 16.258l.707-.707 10.39 10.39-.707.707z"></path>
                    <path d="M4.935 26.357L26.018 5.274l.707.707L5.642 27.065z"></path>
                    <path d="M31 1v4.194h-4.194V1H31m1-1h-6.194v6.194H32V0zM31 26.806V31h-4.194v-4.194H31m1-1h-6.194V32H32v-6.194zM5.194 26.806V31H1v-4.194h4.194m1-1H0V32h6.194v-6.194z"></path>
                  </g>
                </svg>
                <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">Inferra</span>
              <br />
              <span className="text-muted-foreground">Assistant</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              Transform any PDF into an intelligent conversation. Upload your document and get 
              <span className="text-primary font-semibold"> instant, accurate answers </span>
              powered by advanced AI.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground px-2">
              Upload & Start Asking
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Simply drag and drop your PDF or click to browse. Our AI will process it instantly 
              and be ready to answer any questions you have.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <PDFUploader onUploadSuccess={handleUploadSuccess} />
          </div>
          
          {uploadedFilename && (
            <div className="text-center mt-6 sm:mt-8 space-y-3 px-4">
              <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 sm:px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium break-all sm:break-normal">Successfully uploaded: {uploadedFilename}</span>
              </div>
              <p className="text-primary font-medium flex items-center justify-center gap-2 text-sm sm:text-base">
                <Sparkles className="h-4 w-4 animate-spin" />
                Redirecting to chat...
              </p>
            </div>
          )}
        </div>

        {/* View Conversations Button - Moved here */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16 lg:mb-20 px-4">
          <Link href="/chat">
            <Button variant="outline" size="lg" className="group h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">View Conversations</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground px-2">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Experience the future of document interaction with our cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Get instant responses to your questions. Our advanced AI processes your documents 
                  in milliseconds, not minutes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Smart Conversations</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Keep track of all your conversations with intelligent history management. 
                  Resume any discussion exactly where you left off.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0 md:max-w-sm lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-green-400/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Your documents and conversations are processed with enterprise-grade security. 
                  Complete privacy guaranteed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-2">
          <Card className="max-w-4xl mx-auto relative overflow-hidden border-2 pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
            <CardHeader className="relative pb-4 sm:pb-6 p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary mr-2" />
                <span className="text-primary font-semibold text-sm sm:text-base">Ready to Get Started?</span>
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-primary ml-2" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                Experience the Future of Document Analysis
              </CardTitle>
              <CardDescription className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Join thousands of users who have transformed how they interact with documents. 
                Upload your first PDF and discover the power of AI-driven insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" className="btn-primary h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto" asChild>
                  <a href="#upload">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="truncate">Upload Your First PDF</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3 flex-shrink-0" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold border-2 hover:border-primary/50 transition-all duration-300 w-full sm:w-auto" asChild>
                  <Link href="/chat">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                    <span className="truncate">View Conversations</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}