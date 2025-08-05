import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

const CollegeDetails = () => {
  const { id } = useParams()

  return (
    <>
      <Helmet>
        <title>College Details - Medical Admissions Platform</title>
        <meta name="description" content="Detailed information about medical colleges." />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              College Details
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              Detailed college information for ID: {id}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollegeDetails