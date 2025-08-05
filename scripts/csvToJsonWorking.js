#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Papa from 'papaparse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'src', 'CSVFILES'),
  outputDir: path.join(__dirname, '..', 'src', 'data'),
  supportedFormats: ['.csv', '.CSV'],
  encoding: 'utf-8'
}

// Utility functions - simplified to avoid recursion
const cleanText = (text) => {
  if (!text) return ''
  return text.toString().trim().replace(/\s+/g, ' ')
}

const parseNumber = (value) => {
  if (!value) return 0
  const num = parseInt(value.toString().replace(/[^\d]/g, ''))
  return isNaN(num) ? 0 : num
}

const parseBoolean = (value) => {
  if (!value) return false
  const str = value.toString().toLowerCase()
  return ['yes', 'true', '1', 'y'].includes(str)
}

const parseFloat = (value) => {
  if (!value) return null
  const num = parseFloat(value.toString().replace(/[^\d.-]/g, ''))
  return isNaN(num) ? null : num
}

// Simple ID generation without recursion
const generateId = (name, state) => {
  const nameStr = name ? name.toString() : 'unknown'
  const stateStr = state ? state.toString() : 'unknown'
  
  const namePart = nameStr.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const statePart = stateStr.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  return `${namePart}-${statePart}`
}

// Medical Colleges Processor
const processMedicalCollege = (row) => {
  try {
    return {
      id: generateId(row['College Name'], row['State']),
      name: cleanText(row['College Name']),
      state: cleanText(row['State']),
      city: cleanText(row['City']),
      type: cleanText(row['Type']),
      management: cleanText(row['Management']),
      university: cleanText(row['University']),
      recognitionStatus: cleanText(row['Recognition Status']),
      academicYear: cleanText(row['Academic Year']),
      courses: [{
        name: 'MBBS',
        duration: '5.5 years',
        seats: parseNumber(row['MBBS Total Seats']),
        recognitionStatus: cleanText(row['Recognition Status']),
        fees: {
          government: parseNumber(row['MBBS Govt Fee']),
          private: parseNumber(row['MBBS Private Fee']),
          nri: parseNumber(row['MBBS NRI Fee'])
        }
      }],
      seatMatrix: {
        mbbs: {
          total: parseNumber(row['MBBS Total Seats']),
          aiq: parseNumber(row['MBBS AIQ Seats']),
          state: parseNumber(row['MBBS State Seats']),
          categories: {
            general: parseNumber(row['MBBS General']),
            sc: parseNumber(row['MBBS SC']),
            st: parseNumber(row['MBBS ST']),
            obc: parseNumber(row['MBBS OBC']),
            ews: parseNumber(row['MBBS EWS'])
          }
        }
      },
      fees: {
        mbbs: {
          government: parseNumber(row['MBBS Govt Fee']),
          private: parseNumber(row['MBBS Private Fee']),
          nri: parseNumber(row['MBBS NRI Fee'])
        }
      },
      bond: {
        required: parseBoolean(row['Bond Required']),
        duration: parseNumber(row['Bond Duration']),
        amount: parseNumber(row['Bond Amount']),
        description: cleanText(row['Bond Description'])
      },
      contact: {
        address: cleanText(row['Address']),
        phone: cleanText(row['Phone']),
        email: cleanText(row['Email']),
        website: cleanText(row['Website'])
      },
      coordinates: {
        latitude: parseFloat(row['Latitude']),
        longitude: parseFloat(row['Longitude'])
      },
      lastUpdated: new Date().toISOString(),
      source: 'NMC',
      confidence: 'high'
    }
  } catch (error) {
    console.error('Error in processMedicalCollege:', error.message)
    return null
  }
}

// Dental Colleges Processor
const processDentalCollege = (row) => {
  try {
    return {
      id: generateId(row['College Name'], row['State']),
      name: cleanText(row['College Name']),
      state: cleanText(row['State']),
      city: cleanText(row['City']),
      type: cleanText(row['Type']),
      management: cleanText(row['Management']),
      university: cleanText(row['University']),
      recognitionStatus: cleanText(row['Recognition Status']),
      academicYear: cleanText(row['Academic Year']),
      courses: [{
        name: 'BDS',
        duration: '5 years',
        seats: parseNumber(row['BDS Total Seats']),
        recognitionStatus: cleanText(row['Recognition Status']),
        fees: {
          government: parseNumber(row['BDS Govt Fee']),
          private: parseNumber(row['BDS Private Fee']),
          nri: parseNumber(row['BDS NRI Fee'])
        }
      }],
      seatMatrix: {
        bds: {
          total: parseNumber(row['BDS Total Seats']),
          aiq: parseNumber(row['BDS AIQ Seats']),
          state: parseNumber(row['BDS State Seats']),
          categories: {
            general: parseNumber(row['BDS General']),
            sc: parseNumber(row['BDS SC']),
            st: parseNumber(row['BDS ST']),
            obc: parseNumber(row['BDS OBC']),
            ews: parseNumber(row['BDS EWS'])
          }
        }
      },
      fees: {
        bds: {
          government: parseNumber(row['BDS Govt Fee']),
          private: parseNumber(row['BDS Private Fee']),
          nri: parseNumber(row['BDS NRI Fee'])
        }
      },
      bond: {
        required: parseBoolean(row['Bond Required']),
        duration: parseNumber(row['Bond Duration']),
        amount: parseNumber(row['Bond Amount']),
        description: cleanText(row['Bond Description'])
      },
      contact: {
        address: cleanText(row['Address']),
        phone: cleanText(row['Phone']),
        email: cleanText(row['Email']),
        website: cleanText(row['Website'])
      },
      coordinates: {
        latitude: parseFloat(row['Latitude']),
        longitude: parseFloat(row['Longitude'])
      },
      lastUpdated: new Date().toISOString(),
      source: 'DCI',
      confidence: 'high'
    }
  } catch (error) {
    console.error('Error in processDentalCollege:', error.message)
    return null
  }
}

// Convert single CSV file to JSON
const convertCsvToJson = async (filePath) => {
  try {
    console.log(`📄 Processing: ${path.basename(filePath)}`)
    
    // Read CSV file
    const csvContent = fs.readFileSync(filePath, CONFIG.encoding)
    
    // Parse CSV
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      trimHeaders: true,
      trimValues: true
    })
    
    if (result.errors.length > 0) {
      console.warn(`⚠️  CSV parsing warnings for ${path.basename(filePath)}:`)
      result.errors.forEach(error => {
        console.warn(`   Row ${error.row}: ${error.message}`)
      })
    }
    
    // Determine processor type
    const filename = path.basename(filePath).toLowerCase()
    let processor = null
    
    if (filename.includes('medical') || filename.includes('mbbs')) {
      processor = processMedicalCollege
      console.log('   Using processor: medical-colleges')
    } else if (filename.includes('dental') || filename.includes('bds')) {
      processor = processDentalCollege
      console.log('   Using processor: dental-colleges')
    } else {
      console.log('   Using processor: generic')
      processor = (row) => row // Return as-is for generic files
    }
    
    // Process each row
    const processedData = []
    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i]
      
      // Skip empty rows
      if (!Object.keys(row).some(key => row[key] && row[key].toString().trim())) {
        continue
      }
      
      try {
        const processed = processor(row)
        if (processed) {
          processedData.push(processed)
        }
      } catch (error) {
        console.error(`   Error processing row ${i + 1}:`, error.message)
      }
    }
    
    // Generate output filename
    const baseName = path.basename(filePath, path.extname(filePath))
    const outputFileName = `${baseName}.json`
    const outputPath = path.join(CONFIG.outputDir, outputFileName)
    
    // Write JSON file
    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2), CONFIG.encoding)
    
    console.log(`✅ Converted: ${processedData.length} records → ${outputFileName}`)
    
    return {
      inputFile: path.basename(filePath),
      outputFile: outputFileName,
      recordCount: processedData.length
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message)
    return {
      inputFile: path.basename(filePath),
      error: error.message
    }
  }
}

// Get all CSV files from input directory
const getCsvFiles = () => {
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.log(`📁 Creating input directory: ${CONFIG.inputDir}`)
    fs.mkdirSync(CONFIG.inputDir, { recursive: true })
    return []
  }
  
  const files = fs.readdirSync(CONFIG.inputDir)
  return files
    .filter(file => CONFIG.supportedFormats.includes(path.extname(file)))
    .map(file => path.join(CONFIG.inputDir, file))
}

// Ensure output directory exists
const ensureOutputDir = () => {
  if (!fs.existsSync(CONFIG.outputDir)) {
    console.log(`📁 Creating output directory: ${CONFIG.outputDir}`)
    fs.mkdirSync(CONFIG.outputDir, { recursive: true })
  }
}

// Main conversion function
const main = async () => {
  try {
    console.log('🔄 Starting CSV to JSON conversion (Working)...')
    console.log(`📂 Input directory: ${CONFIG.inputDir}`)
    console.log(`📂 Output directory: ${CONFIG.outputDir}`)
    
    // Ensure directories exist
    ensureOutputDir()
    
    // Get CSV files
    const csvFiles = getCsvFiles()
    
    if (csvFiles.length === 0) {
      console.log('📝 No CSV files found in input directory.')
      console.log(`   Please place CSV files in: ${CONFIG.inputDir}`)
      console.log('   Supported formats:', CONFIG.supportedFormats.join(', '))
      return
    }
    
    console.log(`📊 Found ${csvFiles.length} CSV file(s) to process`)
    
    // Process each file
    const results = []
    for (const filePath of csvFiles) {
      const result = await convertCsvToJson(filePath)
      results.push(result)
    }
    
    // Display summary
    const successful = results.filter(r => !r.error)
    const failed = results.filter(r => r.error)
    const totalRecords = successful.reduce((sum, r) => sum + r.recordCount, 0)
    
    console.log('\n📈 Conversion Summary:')
    console.log(`   Total files: ${results.length}`)
    console.log(`   Successful: ${successful.length}`)
    console.log(`   Failed: ${failed.length}`)
    console.log(`   Total records: ${totalRecords}`)
    
    if (failed.length > 0) {
      console.log('\n❌ Failed conversions:')
      failed.forEach(result => {
        console.log(`   ${result.inputFile}: ${result.error}`)
      })
    }
    
    console.log('\n🎉 CSV to JSON conversion completed!')
    
  } catch (error) {
    console.error('❌ Conversion failed:', error)
    process.exit(1)
  }
}

// Run conversion if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main