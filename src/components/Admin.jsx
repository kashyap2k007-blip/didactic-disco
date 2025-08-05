import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Database,
  Users,
  BarChart3,
  Settings,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Database as DatabaseIcon,
  BarChart as BarChartIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Bell,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

// Admin Sub-components
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalColleges: 0,
    totalUsers: 0,
    totalSearches: 0,
    systemHealth: 'healthy'
  })

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalColleges: 1593,
      totalUsers: 1247,
      totalSearches: 8923,
      systemHealth: 'healthy'
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Colleges</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalColleges.toLocaleString()}</p>
            </div>
            <Database className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Active Users</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-medical-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Searches</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalSearches.toLocaleString()}</p>
            </div>
            <Search className="h-8 w-8 text-warning-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">System Health</p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${stats.systemHealth === 'healthy' ? 'bg-success-500' : 'bg-danger-500'}`} />
                <p className="text-lg font-semibold text-neutral-900 dark:text-white capitalize">{stats.systemHealth}</p>
              </div>
            </div>
            <Activity className="h-8 w-8 text-success-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {[
                { action: 'New college added', college: 'AIIMS Delhi', time: '2 hours ago', type: 'success' },
                { action: 'Data updated', college: 'JIPMER Puducherry', time: '4 hours ago', type: 'info' },
                { action: 'User registration', college: 'Dr. Priya Sharma', time: '6 hours ago', type: 'info' },
                { action: 'System backup', college: 'Database backup completed', time: '1 day ago', type: 'success' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'success' ? 'bg-success-500' : 'bg-primary-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.action}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.college} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add College</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Sync Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DataManagement = () => {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    // Simulate loading college data
    setTimeout(() => {
      setColleges([
        { id: 1, name: 'AIIMS Delhi', type: 'medical', state: 'Delhi', status: 'active', seats: 100 },
        { id: 2, name: 'JIPMER Puducherry', type: 'medical', state: 'Puducherry', status: 'active', seats: 150 },
        { id: 3, name: 'Maulana Azad Medical College', type: 'medical', state: 'Delhi', status: 'active', seats: 200 },
        { id: 4, name: 'Government Dental College', type: 'dental', state: 'Maharashtra', status: 'active', seats: 80 }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || college.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Management</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Manage college data and information</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New College</span>
        </button>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="medical">Medical</option>
              <option value="dental">Dental</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading colleges...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">State</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Seats</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredColleges.map((college) => (
                    <tr key={college.id} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="py-3 px-4 text-neutral-900 dark:text-white">{college.name}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${college.type === 'medical' ? 'badge-primary' : 'badge-success'}`}>
                          {college.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{college.state}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${college.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {college.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{college.seats}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm text-danger-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    searches: { total: 8923, trend: 'up', percentage: 12 },
    users: { total: 1247, trend: 'up', percentage: 8 },
    colleges: { total: 1593, trend: 'up', percentage: 3 },
    performance: { score: 98, trend: 'up', percentage: 2 }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Analytics & Insights</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Platform performance and user analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analytics).map(([key, data]) => (
          <div key={key} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 capitalize">
                  {key === 'searches' ? 'Total Searches' : 
                   key === 'users' ? 'Active Users' :
                   key === 'colleges' ? 'Total Colleges' : 'Performance Score'}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {key === 'performance' ? `${data.total}%` : data.total.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {data.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-success-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-500" />
                  )}
                  <span className={`text-sm ${data.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                    {data.percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Search Trends</h3>
          </div>
          <div className="card-content">
            <div className="h-64 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              Chart visualization would go here
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Popular Colleges</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {[
                { name: 'AIIMS Delhi', searches: 1247, trend: 'up' },
                { name: 'JIPMER Puducherry', searches: 892, trend: 'up' },
                { name: 'Maulana Azad Medical College', searches: 756, trend: 'down' },
                { name: 'Government Medical College', searches: 634, trend: 'up' }
              ].map((college, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{college.name}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{college.searches} searches</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    college.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {college.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Dr. Priya Sharma', email: 'priya@example.com', role: 'admin', status: 'active', lastLogin: '2 hours ago' },
        { id: 2, name: 'Dr. Rajesh Kumar', email: 'rajesh@example.com', role: 'moderator', status: 'active', lastLogin: '1 day ago' },
        { id: 3, name: 'Dr. Anjali Patel', email: 'anjali@example.com', role: 'user', status: 'inactive', lastLogin: '1 week ago' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">User Management</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Manage platform users and permissions</p>
        </div>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="card">
        <div className="card-content">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="py-3 px-4 text-neutral-900 dark:text-white">{user.name}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${
                          user.role === 'admin' ? 'badge-danger' :
                          user.role === 'moderator' ? 'badge-warning' : 'badge-primary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{user.lastLogin}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm text-danger-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    dataSync: false,
    maintenanceMode: false
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">System Settings</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Configure platform settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">General Settings</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Auto Backup</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Automatically backup data daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Send email notifications for updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Data Sync</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sync with external data sources</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.dataSync}
                  onChange={(e) => handleSettingChange('dataSync', e.target.checked)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Enable maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Data Operations</h3>
          </div>
          <div className="card-content space-y-4">
            <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
              <UploadIcon className="h-4 w-4" />
              <span>Import Data</span>
            </button>
            <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
              <DownloadIcon className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
              <DatabaseIcon className="h-4 w-4" />
              <span>Backup Database</span>
            </button>
            <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Sync External Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Admin = () => {
  const location = useLocation()
  const currentPath = location.pathname.split('/admin/')[1] || ''

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: currentPath === '' },
    { name: 'Data Management', href: '/admin/data', icon: Database, current: currentPath === 'data' },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity, current: currentPath === 'analytics' },
    { name: 'User Management', href: '/admin/users', icon: Users, current: currentPath === 'users' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: currentPath === 'settings' }
  ]

  return (
    <>
      <Helmet>
        <title>Admin - Medical Admissions Platform</title>
        <meta name="description" content="Admin panel for managing medical college data, users, and system settings." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Panel</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage the Medical Admissions Platform
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="btn btn-ghost">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-neutral-900 dark:text-white font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Content */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data" element={<DataManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Admin