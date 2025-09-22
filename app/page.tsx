"use client";

import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  Rocket,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { features, steps, upcomingFeatures, useCases } from "@/public/data";
import { useTheme } from "next-themes";
import Link from "next/link";

const AutobookLandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900" />
        <div
          className="absolute pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
      </div>
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
          isScrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-xl font-bold text-transparent">
                Autobook
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                className="rounded-full"
                size="icon"
                variant={"outline"}
                onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
              >
                {theme == "light" ? <Moon /> : <Sun />}
              </Button>
              <Link
                href={"/login"}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-blue-600 text-sm font-medium text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all duration-200"
                )}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-28 lg:flex flex-col justify-center lg:h-screen">
        {/* Background decorations */}
        <div className="absolute -top-24 left-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-violet-400/30 to-purple-400/30 blur-3xl animation-delay-2000" />

        <div className="relative mx-auto max-w-7xl text-center">
          <Badge
            variant="secondary"
            className="mb-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-400/10 dark:border-blue-900 dark:text-blue-400 transition-colors duration-200 py-2 px-4"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Autonote
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            Your notes,{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                automated
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
            Capture ideas, meetings, and code snippets — then let Autonote turn
            them into searchable, structured notes automatically.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "group bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-200"
              )}
            >
              Get Started — It&apos;s Free
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      {/* How it works */}
      <section className="relative py-16 px-4 sm:px-6 sm:py-20 lg:px-8 lg:py-24 lg:flex flex-col justify-center lg:h-screen">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              A simple flow that turns scattered thoughts into organized
              knowledge.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-5">
            {steps.map((step, index) => (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden transition-all duration-500 hover:shadow-xl border-2",
                  index === activeStep
                    ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800 scale-105 shadow-xl"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                )}
              >
                <CardContent className="p-6">
                  {/* Gradient background */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-5 bg-gradient-to-br",
                      step.color
                    )}
                  />

                  <div
                    className={cn(
                      "mb-4 text-sm font-bold transition-colors",
                      index === activeStep
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                    )}
                  >
                    {step.number}
                  </div>

                  <h3
                    className={cn(
                      "mb-3 text-lg font-semibold transition-colors",
                      index === activeStep
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-gray-900 dark:text-white"
                    )}
                  >
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </CardContent>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="relative py-16 px-4 sm:px-6 sm:py-20 lg:px-8 lg:py-24 bg-gray-50/50 dark:bg-gray-950/50 lg:flex flex-col justify-center lg:h-screen">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Features & benefits
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Designed for students, engineers, researchers, and makers who
              demand clarity.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                      <feature.icon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 sm:py-20 lg:px-8 lg:py-24 lg:flex flex-col justify-center lg:h-screen">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Perfect for every workflow
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group flex items-start space-x-3 rounded-lg p-4 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative lg:flex flex-col justify-center lg:h-screen py-16 px-4 sm:px-6 sm:py-20 lg:px-8 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30">
        {/* Background decorations */}
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 blur-3xl animate-pulse animation-delay-3000" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-400/10 dark:border-blue-900 dark:text-blue-400 transition-colors duration-200 py-2 px-4"
            >
              <Rocket className="mr-2 h-3 w-3" />
              Roadmap 2025
            </Badge>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What&apos;s coming next
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Exciting new features in development to make your note-taking
              experience even more powerful.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm hover:scale-105"
              >
                <CardContent className="p-6">
                  {/* Gradient background */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-5 bg-gradient-to-br transition-opacity group-hover:opacity-10",
                      feature.color
                    )}
                  />

                  <div className="relative">
                    {/* Header with icon and status */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 group-hover:scale-110",
                          feature.color
                        )}
                      >
                        <div className="text-white">
                          <feature.icon />
                        </div>
                      </div>

                      <Badge
                        variant={
                          feature.status === "In Development"
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          "text-xs font-medium",
                          feature.status === "In Development" &&
                            "bg-green-100 text-green-700 border-green-200",
                          feature.status === "Coming Soon" &&
                            "bg-blue-100 text-blue-700 border-blue-200",
                          feature.status === "Planned" &&
                            "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                      >
                        {feature.status}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-4">
                      {feature.description}
                    </p>

                    {/* Timeline */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="mr-1 h-3 w-3" />
                      Expected: {feature.timeline}
                    </div>
                  </div>
                </CardContent>

                {/* Hover effect border */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-opacity opacity-0 group-hover:opacity-100",
                    feature.color
                  )}
                />
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Background decorations */}
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to stop losing ideas?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-blue-100">
            Start using Autobook now and let Autonote do the heavy lifting.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={"/login"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-xl hover:bg-gray-50 hover:scale-105 transition-all duration-200"
              )}
            >
              Create your first Autonote — Free account
            </Link>
          </div>

          <p className="mt-6 text-sm text-blue-200">
            No credit card. Export anytime. Your notes are yours.
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-xl font-bold text-transparent">
              Autobook
            </span>
          </div>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Smart notes that actually behave.
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            © 2024 Autobook. All rights reserved.
          </div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AutobookLandingPage;
