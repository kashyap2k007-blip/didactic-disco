import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from '@components/Layout'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorBoundary from '@components/ErrorBoundary'

// Lazy load components for better performance
const Home = lazy(() => import('@components/Home'))
const Search = lazy(() => import('@components/Search'))
const CollegeDetails = lazy(() => import('@components/CollegeDetails'))
const Analytics = lazy(() => import('@components/Analytics'))
const About = lazy(() => import('@components/About'))
const Admin = lazy(() => import('@components/Admin'))
const NotFound = lazy(() => import('@components/NotFound'))

function App() {
  return (
    <>
      <Helmet>
        <title>Medical Admissions Platform - India's Complete Medical & Dental College Database</title>
        <meta name="description" content="Privacy-first medical admissions platform for India. Complete national database with 1,275+ medical & 318+ dental colleges. Advanced search, analytics, and transparency tools." />
        <link rel="canonical" href="https://medicaladmissions.in" />
      </Helmet>
      
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </>
  )
}

export default App