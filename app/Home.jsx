'use client';
import React from 'react';
import '@/app/globals.css';
import { FloatingDockHome } from './components/FloatingDock';
import SpotlightHome from './components/Home';
import { Spotlight } from '@/components/ui/spotlight';
import { Features } from '@/app/components/Features';
import AutoNoteWorking from './components/AutoNoteWorking';
import WhyChooseAutoBook from './components/WhyChooseAutoBook';
import GithubInfo from './components/GithubInfo';

const HomeComponent = () => {
  return (
    <main className="md:container h-screen mx-auto *:p-0 *:m-0">
      <Spotlight
        className="-top-5 left-20 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="fixed flex justify-center w-full left-0 z-50 bottom-3">
        <FloatingDockHome />
      </div>
      <section id="home">
        <SpotlightHome />
      </section>
      <section id="features" className="py-10">
        <Features />
      </section>
      <section id="autoNoteWorking" className="py-10">
        <AutoNoteWorking />
      </section>
      <section id="whyChooseAutoBook" className="py-10">
        <WhyChooseAutoBook />
      </section>
      <section id="githubInfo" className="py-10">
        <GithubInfo />
      </section>
    </main>
  );
};

export default HomeComponent;
