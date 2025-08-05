#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.join(__dirname, '..', 'src', 'data')

console.log('🔍 Validating Medical Admissions Platform Data...\n')

const validateCollege = (college, index, type) => {
  const errors = []
  const warnings = []

  // Required fields validation
  if (!college.name) errors.push(`Missing name`)
  if (!college.state) errors.push(`Missing state`)
  if (!college.city) errors.push(`Missing city`)
  if (!college.type) errors.push(`Missing type`)
  if (!college.management) errors.push(`Missing management`)
  if (!college.university) errors.push(`Missing university`)
  if (!college.recognitionStatus) errors.push(`Missing recognition status`)
  if (!college.academicYear) errors.push(`Missing academic year`)

  // ID validation
  if (!college.id) errors.push(`Missing ID`)
  if (college.id !== `${college.name?.toLowerCase().replace(/\s+/g, '-')}-${college.state?.toLowerCase().replace(/\s+/g, '-')}`) {
    warnings.push(`ID format mismatch: expected format based on name and state`)
  }

  // Seat matrix validation
  const seatMatrix = college.seatMatrix.mbbs || college.seatMatrix.bds
  if (seatMatrix) {
    if (seatMatrix.total < 0) errors.push(`Invalid total seats: ${seatMatrix.total}`)
    if (seatMatrix.aiq < 0) errors.push(`Invalid AIQ seats: ${seatMatrix.aiq}`)
    if (seatMatrix.state < 0) errors.push(`Invalid state seats: ${seatMatrix.state}`)
    
    // Check if AIQ + State = Total
    if (seatMatrix.aiq + seatMatrix.state !== seatMatrix.total) {
      warnings.push(`Seat allocation mismatch: AIQ (${seatMatrix.aiq}) + State (${seatMatrix.state}) ≠ Total (${seatMatrix.total})`)
    }

    // Category validation
    if (seatMatrix.categories) {
      const categorySum = Object.values(seatMatrix.categories).reduce((sum, val) => sum + (val || 0), 0)
      if (categorySum !== seatMatrix.total) {
        warnings.push(`Category sum (${categorySum}) doesn't match total seats (${seatMatrix.total})`)
      }
    }
  }

  // Fee validation
  const fees = college.fees.mbbs || college.fees.bds
  if (fees) {
    if (fees.government < 0) warnings.push(`Negative government fee: ${fees.government}`)
    if (fees.private < 0) warnings.push(`Negative private fee: ${fees.private}`)
    if (fees.nri < 0) warnings.push(`Negative NRI fee: ${fees.nri}`)
  }

  // Bond validation
  if (college.bond) {
    if (college.bond.required && college.bond.duration <= 0) {
      warnings.push(`Bond required but duration is ${college.bond.duration}`)
    }
    if (college.bond.required && college.bond.amount <= 0) {
      warnings.push(`Bond required but amount is ${college.bond.amount}`)
    }
  }

  // Contact validation
  if (college.contact) {
    if (college.contact.email && !college.contact.email.includes('@')) {
      warnings.push(`Invalid email format: ${college.contact.email}`)
    }
    if (college.contact.website && !college.contact.website.startsWith('http')) {
      warnings.push(`Website should start with http: ${college.contact.website}`)
    }
  }

  // Coordinates validation
  if (college.coordinates) {
    if (college.coordinates.latitude && (college.coordinates.latitude < -90 || college.coordinates.latitude > 90)) {
      errors.push(`Invalid latitude: ${college.coordinates.latitude}`)
    }
    if (college.coordinates.longitude && (college.coordinates.longitude < -180 || college.coordinates.longitude > 180)) {
      errors.push(`Invalid longitude: ${college.coordinates.longitude}`)
    }
  }

  // Date validation
  if (college.lastUpdated) {
    const date = new Date(college.lastUpdated)
    if (isNaN(date.getTime())) {
      errors.push(`Invalid lastUpdated date: ${college.lastUpdated}`)
    }
  }

  return { errors, warnings }
}

const validateFile = (filePath, type) => {
  console.log(`📋 Validating ${type} colleges...`)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    return { total: 0, errors: 0, warnings: 0 }
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    if (!Array.isArray(data)) {
      console.error(`❌ Invalid data format: expected array, got ${typeof data}`)
      return { total: 0, errors: 0, warnings: 0 }
    }

    let totalErrors = 0
    let totalWarnings = 0

    data.forEach((college, index) => {
      const { errors, warnings } = validateCollege(college, index, type)
      
      if (errors.length > 0 || warnings.length > 0) {
        console.log(`\n🏫 ${college.name || `College ${index + 1}`}:`)
        
        if (errors.length > 0) {
          console.log(`  ❌ Errors:`)
          errors.forEach(error => console.log(`    - ${error}`))
          totalErrors += errors.length
        }
        
        if (warnings.length > 0) {
          console.log(`  ⚠️  Warnings:`)
          warnings.forEach(warning => console.log(`    - ${warning}`))
          totalWarnings += warnings.length
        }
      }
    })

    console.log(`\n✅ ${type} colleges validation complete:`)
    console.log(`   Total colleges: ${data.length}`)
    console.log(`   Errors: ${totalErrors}`)
    console.log(`   Warnings: ${totalWarnings}`)

    return { total: data.length, errors: totalErrors, warnings: totalWarnings }
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message)
    return { total: 0, errors: 0, warnings: 0 }
  }
}

const validateStatistics = () => {
  console.log('\n📊 Validating statistics...')
  
  const statsPath = path.join(dataDir, 'statistics.json')
  
  if (!fs.existsSync(statsPath)) {
    console.error(`❌ Statistics file not found: ${statsPath}`)
    return
  }

  try {
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))
    
    // Validate total counts
    const medicalColleges = JSON.parse(fs.readFileSync(path.join(dataDir, 'medicalColleges.json'), 'utf8'))
    const dentalColleges = JSON.parse(fs.readFileSync(path.join(dataDir, 'dentalColleges.json'), 'utf8'))
    
    if (stats.total.medical !== medicalColleges.length) {
      console.warn(`⚠️  Medical college count mismatch: stats (${stats.total.medical}) vs actual (${medicalColleges.length})`)
    }
    
    if (stats.total.dental !== dentalColleges.length) {
      console.warn(`⚠️  Dental college count mismatch: stats (${stats.total.dental}) vs actual (${dentalColleges.length})`)
    }
    
    if (stats.total.combined !== medicalColleges.length + dentalColleges.length) {
      console.warn(`⚠️  Combined count mismatch: stats (${stats.total.combined}) vs actual (${medicalColleges.length + dentalColleges.length})`)
    }
    
    console.log('✅ Statistics validation complete')
  } catch (error) {
    console.error(`❌ Error validating statistics:`, error.message)
  }
}

// Main validation
const main = () => {
  const medicalResults = validateFile(path.join(dataDir, 'medicalColleges.json'), 'Medical')
  const dentalResults = validateFile(path.join(dataDir, 'dentalColleges.json'), 'Dental')
  
  validateStatistics()
  
  const totalColleges = medicalResults.total + dentalResults.total
  const totalErrors = medicalResults.errors + dentalResults.errors
  const totalWarnings = medicalResults.warnings + dentalResults.warnings
  
  console.log('\n📋 Validation Summary:')
  console.log(`   Total colleges: ${totalColleges}`)
  console.log(`   Total errors: ${totalErrors}`)
  console.log(`   Total warnings: ${totalWarnings}`)
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n🎉 All data is valid!')
  } else if (totalErrors === 0) {
    console.log('\n⚠️  Data has warnings but no errors.')
  } else {
    console.log('\n❌ Data has errors that need to be fixed.')
    process.exit(1)
  }
}

main()