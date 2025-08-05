import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  GraduationCap,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  Target,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus
} from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalSearches: 8923,
      totalUsers: 1247,
      totalColleges: 1593,
      totalStates: 28,
      searchGrowth: 12.5,
      userGrowth: 8.2,
      collegeGrowth: 3.1,
      conversionRate: 15.8
    },
    trends: {
      searches: [1200, 1350, 1420, 1380, 1560, 1680, 1750, 1820, 1950, 2100, 1980, 2150],
      users: [850, 920, 980, 1050, 1120, 1180, 1240, 1310, 1380, 1450, 1520, 1580],
      colleges: [1450, 1470, 1490, 1510, 1530, 1550, 1570, 1590, 1610, 1630, 1650, 1670]
    },
    topColleges: [
      { name: 'AIIMS Delhi', searches: 1247, growth: 15.2, category: 'medical' },
      { name: 'JIPMER Puducherry', searches: 892, growth: 8.7, category: 'medical' },
      { name: 'Maulana Azad Medical College', searches: 756, growth: -2.1, category: 'medical' },
      { name: 'Government Medical College', searches: 634, growth: 12.3, category: 'medical' },
      { name: 'King George Medical University', searches: 587, growth: 6.8, category: 'medical' }
    ],
    stateDistribution: [
      { state: 'Maharashtra', colleges: 145, percentage: 9.1 },
      { state: 'Tamil Nadu', colleges: 132, percentage: 8.3 },
      { state: 'Karnataka', colleges: 128, percentage: 8.0 },
      { state: 'Uttar Pradesh', colleges: 125, percentage: 7.8 },
      { state: 'Andhra Pradesh', colleges: 118, percentage: 7.4 }
    ],
    searchPatterns: [
      { pattern: 'MBBS Admissions', count: 3240, percentage: 36.3 },
      { pattern: 'NEET Cutoff', count: 2150, percentage: 24.1 },
      { pattern: 'Medical College Rankings', count: 1680, percentage: 18.8 },
      { pattern: 'Dental Colleges', count: 1250, percentage: 14.0 },
      { pattern: 'State Quota', count: 603, percentage: 6.8 }
    ],
    insights: [
      { type: 'positive', title: 'High Search Growth', description: 'Searches increased by 12.5% this month', icon: TrendingUp },
      { type: 'info', title: 'New Colleges Added', description: '23 new colleges added to database', icon: Plus },
      { type: 'warning', title: 'Regional Disparity', description: 'Some states have limited college options', icon: AlertTriangle },
      { type: 'success', title: 'User Engagement', description: 'Average session duration increased by 18%', icon: Activity }
    ]
  })

  useEffect(() => {
    // Simulate loading analytics data
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [timeRange])

  const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              {change > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-success-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-danger-500" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const InsightCard = ({ insight }) => {
    const Icon = insight.icon
    const colorMap = {
      positive: 'success',
      negative: 'danger',
      warning: 'warning',
      info: 'primary',
      success: 'success'
    }
    const color = colorMap[insight.type]

    return (
      <div className="card">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900`}>
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-neutral-900 dark:text-white">{insight.title}</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{insight.description}</p>
          </div>
        </div>
      </div>
    )
  }

  const TrendChart = ({ data, title, color = 'primary' }) => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-content">
        <div className="h-48 flex items-end justify-between space-x-1">
          {data.map((value, index) => {
            const maxValue = Math.max(...data)
            const height = (value / maxValue) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-neutral-500 mt-1">{index + 1}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>Analytics - Medical Admissions Platform</title>
        <meta name="description" content="Comprehensive analytics and insights for medical college admissions in India." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Comprehensive insights and trends for medical college admissions
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="input"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button className="btn btn-secondary" onClick={() => setLoading(true)}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button className="btn btn-primary">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Searches"
                  value={analytics.overview.totalSearches.toLocaleString()}
                  change={analytics.overview.searchGrowth}
                  icon={Search}
                  color="warning"
                />
                <StatCard
                  title="Active Users"
                  value={analytics.overview.totalUsers.toLocaleString()}
                  change={analytics.overview.userGrowth}
                  icon={Users}
                  color="medical"
                />
                <StatCard
                  title="Total Colleges"
                  value={analytics.overview.totalColleges.toLocaleString()}
                  change={analytics.overview.collegeGrowth}
                  icon={GraduationCap}
                  color="primary"
                />
                <StatCard
                  title="Conversion Rate"
                  value={`${analytics.overview.conversionRate}%`}
                  change={2.1}
                  icon={Target}
                  color="success"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <TrendChart
                  data={analytics.trends.searches}
                  title="Search Trends"
                  color="warning"
                />
                <TrendChart
                  data={analytics.trends.users}
                  title="User Growth"
                  color="medical"
                />
                <TrendChart
                  data={analytics.trends.colleges}
                  title="College Growth"
                  color="primary"
                />
              </div>

              {/* Insights and Top Colleges */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Key Insights */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Key Insights</h2>
                  <div className="space-y-3">
                    {analytics.insights.map((insight, index) => (
                      <InsightCard key={index} insight={insight} />
                    ))}
                  </div>
                </div>

                {/* Top Colleges */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Most Searched Colleges</h3>
                  </div>
                  <div className="card-content">
                    <div className="space-y-4">
                      {analytics.topColleges.map((college, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-white">{college.name}</p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">{college.searches} searches</p>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-1 ${
                            college.growth > 0 ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {college.growth > 0 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span className="text-sm">{Math.abs(college.growth)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Search Patterns */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Search Patterns</h3>
                  </div>
                  <div className="card-content">
                    <div className="space-y-4">
                      {analytics.searchPatterns.map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                            <span className="text-neutral-900 dark:text-white">{pattern.pattern}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{ width: `${pattern.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 w-12 text-right">
                              {pattern.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* State Distribution */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">College Distribution by State</h3>
                  </div>
                  <div className="card-content">
                    <div className="space-y-4">
                      {analytics.stateDistribution.map((state, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-neutral-400" />
                            <span className="text-neutral-900 dark:text-white">{state.state}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {state.colleges}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              ({state.percentage}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Performance Metrics</h3>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-8 w-8 text-success-600" />
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">98.5%</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-8 w-8 text-primary-600" />
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">2.3s</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg Response Time</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-8 w-8 text-warning-600" />
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">15.8%</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Conversion Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-medical-100 dark:bg-medical-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="h-8 w-8 text-medical-600" />
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 dark:text-white">4.8/5</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">User Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Analytics