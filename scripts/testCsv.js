#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.join(__dirname, '..', 'src', 'CSVFILES', 'sample-medical-colleges.csv')

console.log('Testing CSV parsing...')
console.log('CSV Path:', csvPath)

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  console.log('CSV Content length:', csvContent.length)
  console.log('First 200 chars:', csvContent.substring(0, 200))
  
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
    trimValues: true
  })
  
  console.log('Parsed rows:', result.data.length)
  console.log('First row:', result.data[0])
  
  // Test simple processing
  const firstRow = result.data[0]
  console.log('College Name:', firstRow['College Name'])
  console.log('State:', firstRow['State'])
  
  // Test ID generation
  const name = firstRow['College Name']
  const state = firstRow['State']
  const namePart = name ? name.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : 'unknown'
  const statePart = state ? state.toString().toLowerCase().replace(/\s+/g, '-') : 'unknown'
  const id = `${namePart}-${statePart}`
  
  console.log('Generated ID:', id)
  
} catch (error) {
  console.error('Error:', error.message)
  console.error('Stack:', error.stack)
}