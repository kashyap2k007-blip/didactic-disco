import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Medical Admissions Platform</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <div className="card-header">
              <div className="mx-auto w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">404</span>
              </div>
              <h1 className="card-title text-neutral-900 dark:text-white">
                Page Not Found
              </h1>
              <p className="card-description">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="card-content">
              <div className="space-y-4">
                <Link
                  to="/"
                  className="btn btn-primary w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Link>
                
                <Link
                  to="/search"
                  className="btn btn-outline w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Colleges
                </Link>
                
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-ghost w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound