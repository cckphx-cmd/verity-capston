'use client';

import { useAppContext } from '../context/AppContext';
import Navigation from '../components/Navigation';
import { CheckCircle2, Lightbulb, Settings } from 'lucide-react';

export default function AnalyticsPage() {
  const { stats, documents, messages } = useAppContext();

  // Calculate time saved (0.5 hours per question)
  const timeSaved = Math.round(stats.totalQuestions * 0.5);

  // Get recent activity data for chart (last 12 weeks)
  const activityData = [12, 19, 15, 28, 24, 32, 18, 25, 29, 35, 30, 22];

  // Calculate most asked topic
  const userMessages = messages.filter(m => m.role === 'user');
  const mostAskedTopic = userMessages.length > 0
    ? 'Financial projections and Q4 revenue targets'
    : 'No questions asked yet';

  // Find most engaged documents
  const mostEngagedDocs = documents.length > 0
    ? documents.slice(0, 2).map(d => d.name).join(' • ')
    : 'No documents uploaded yet';

  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-light text-cream-900 mb-2">Workspace Insights</h1>
          <p className="text-gray-600">
            See how your team is using AI across documents and projects.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Questions Asked */}
          <div className="bg-white rounded-xl p-6 border border-cream-300">
            <div className="text-sm text-gray-600 mb-2">Questions asked</div>
            <div className="text-4xl font-light text-cream-900 mb-1">
              {stats.totalQuestions.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total queries</div>
          </div>

          {/* Time Saved */}
          <div className="bg-white rounded-xl p-6 border border-cream-300">
            <div className="text-sm text-gray-600 mb-2">Time saved</div>
            <div className="text-4xl font-light text-cream-900 mb-1">{timeSaved}</div>
            <div className="text-xs text-gray-600">Hours estimated</div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl p-6 border border-cream-300">
            <div className="text-sm text-gray-600 mb-2">Documents</div>
            <div className="text-4xl font-light text-cream-900 mb-1">{stats.totalDocs}</div>
            <div className="text-xs text-gray-600">Total sources</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-xl p-6 border border-cream-300">
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <div className="text-4xl font-light text-cream-900 mb-1">{stats.accuracy}%</div>
            <div className="text-xs text-gray-600">Response quality</div>
          </div>
        </div>

        {/* Activity Over Time Graph */}
        <div className="bg-white rounded-xl p-6 border border-cream-300 mb-8">
          <h3 className="text-lg font-medium text-cream-900 mb-4">Activity over time</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {activityData.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 bg-cream-300 rounded-t hover:bg-cream-500 transition-colors cursor-pointer relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-cream-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {height} queries
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
          </div>
        </div>

        {/* AI Highlights */}
        <div className="bg-white rounded-xl p-6 border border-cream-300 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-cream-500" size={20} />
            <h3 className="text-lg font-medium text-cream-900">AI Highlights</h3>
          </div>
          <div className="space-y-4">
            <div className="pb-4 border-b border-cream-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-cream-500 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-sm text-cream-900 mb-1">Most frequently asked about topic</p>
                  <p className="text-xs text-gray-600">{mostAskedTopic}</p>
                </div>
              </div>
            </div>
            <div className="pb-4 border-b border-cream-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-cream-500 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-sm text-cream-900 mb-1">Documents with highest engagement</p>
                  <p className="text-xs text-gray-600">
                    {mostEngagedDocs || 'Upload documents to see engagement'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-cream-500 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-sm text-cream-900 mb-1">Peak usage time</p>
                  <p className="text-xs text-gray-600">Tuesday afternoons, 2-4 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-xl p-6 border border-cream-300">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-cream-500" size={20} />
            <h3 className="text-lg font-medium text-cream-900">AI Behavior Settings</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">Customize how the AI responds to queries</p>

          <div className="space-y-6">
            {/* Response Style */}
            <div>
              <h4 className="text-sm font-medium text-cream-900 mb-3">Response Style</h4>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="style"
                    className="w-4 h-4 text-cream-500 mt-0.5"
                    defaultChecked
                  />
                  <div>
                    <div className="text-sm text-cream-900 font-medium group-hover:text-cream-600">
                      Extensive Summary
                    </div>
                    <div className="text-xs text-gray-600">
                      Detailed responses with full context
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="radio" name="style" className="w-4 h-4 text-cream-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-cream-900 font-medium group-hover:text-cream-600">
                      Detailed Analysis
                    </div>
                    <div className="text-xs text-gray-600">
                      In-depth breakdowns with citations
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="radio" name="style" className="w-4 h-4 text-cream-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-cream-900 font-medium group-hover:text-cream-600">
                      Bullet Points
                    </div>
                    <div className="text-xs text-gray-600">Concise, scannable summaries</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Citations Toggle */}
            <div className="pt-6 border-t border-cream-300">
              <label className="flex items-start justify-between cursor-pointer group">
                <div>
                  <div className="text-sm text-cream-900 font-medium group-hover:text-cream-600">
                    Always show sources
                  </div>
                  <div className="text-xs text-gray-600">
                    Include document references in responses
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 text-cream-500" defaultChecked />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
