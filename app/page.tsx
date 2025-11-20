'use client';

import Link from 'next/link';
import { MessageSquare, User } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-8 sm:pb-16">
        {/* Beta Badge */}
        <div className="mb-6 sm:mb-8">
          <span className="text-xs font-medium text-cream-500 tracking-[1.5px]">
            AI WORKSPACE · BETA
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.2] font-normal text-cream-900 mb-4 sm:mb-6 max-w-4xl">
          Make better decisions with an AI that reads your documents like a partner.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-gray-400 leading-[1.6] mb-8 sm:mb-10 max-w-3xl">
          Upload contracts, reports, and decks. Ask questions in plain language. Get answers you can actually act on.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link
            href="/demo"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-cream-500 text-white rounded-lg font-medium hover:bg-cream-600 transition-colors text-center"
          >
            Try Interactive Demo
          </Link>
          <a
            href="https://www.youtube.com/watch?v=z2bQzpVgWzI"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white border border-cream-300 text-cream-900 rounded-lg font-medium hover:border-cream-400 transition-colors text-center"
          >
            Watch Product Overview
          </a>
        </div>

        {/* Preview Card - Responsive height */}
        <div className="bg-white rounded-2xl shadow-xl border border-cream-300 overflow-hidden">
          <div className="flex h-[400px] sm:h-[500px] md:h-[600px]">
            {/* Left Sidebar (30%) */}
            <div className="w-[30%] bg-cream-50 border-r border-cream-300 p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-cream-900 mb-1">
                  Verity
                </h3>
                <p className="text-xs text-gray-600 font-semibold">AI Workspace</p>
              </div>

              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                  Quarterly Results
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                  Acme Q4 Review
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-colors">
                  Roadmap Planning
                </button>
              </div>
            </div>

            {/* Right Chat Area (70%) */}
            <div className="w-[70%] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-cream-300 px-6 py-4 flex items-center justify-between">
                <h4 className="text-sm font-medium text-cream-900">
                  Q4 Board Deck - Draft Review
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cream-400 flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Acme Q4 Review</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-white border border-cream-300 rounded-2xl rounded-tr-sm px-5 py-3">
                    <p className="text-sm text-cream-900">
                      What are the top three risks I would highlight for the board?
                    </p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-cream-200 rounded-2xl rounded-tl-sm px-5 py-4">
                    <p className="text-sm text-cream-900 mb-3 font-medium">
                      Here are the three risks your board will care about most
                    </p>
                    <ol className="text-sm text-cream-900 space-y-2">
                      <li className="flex gap-2">
                        <span className="font-semibold">1.</span>
                        <span><strong>Market volatility</strong></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">2.</span>
                        <span><strong>Regulatory changes</strong></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold">3.</span>
                        <span><strong>Supply chain disruption</strong></span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-cream-300 p-6">
                <div className="flex items-center gap-3 bg-cream-200 rounded-lg px-4 py-3">
                  <MessageSquare size={18} className="text-cream-500" />
                  <input
                    type="text"
                    placeholder="Ask a question about your documents..."
                    className="flex-1 bg-transparent text-sm text-cream-900 placeholder:text-gray-600 focus:outline-none"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
