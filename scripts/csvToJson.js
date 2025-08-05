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

// Utility functions
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

const normalizeCollegeName = (name) => {
  if (!name) return ''
  const str = name.toString().trim()
  const noParentheses = str.replace(/\([^)]*\)/g, '') // Remove parentheses content
  const noSpecialChars = noParentheses.replace(/[^\w\s-]/g, '') // Remove special characters
  const normalized = noSpecialChars.replace(/\s+/g, ' ') // Normalize spaces
  return normalized.trim()
}

const generateId = (name, state) => {
  const normalizedName = normalizeCollegeName(name).toLowerCase().replace(/\s+/g, '-')
  const normalizedState = state ? state.toLowerCase().replace(/\s+/g, '-') : 'unknown'
  return `${normalizedName}-${normalizedState}`
}

// Data processors for different file types
const processors = {
  // Medical Colleges Processor
  'medical-colleges': (row) => {
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
  },

  // Dental Colleges Processor
  'dental-colleges': (row) => {
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
  },

  // Generic Processor (for unknown file types)
  'generic': (row) => {
    const processed = {}
    
    // Process each column
    Object.keys(row).forEach(key => {
      const value = row[key]
      
      // Try to determine data type and process accordingly
      if (typeof value === 'string') {
        if (value.match(/^\d+$/)) {
          processed[key] = parseInt(value)
        } else if (value.match(/^\d+\.\d+$/)) {
          processed[key] = parseFloat(value)
        } else if (['true', 'false', 'yes', 'no', '1', '0'].includes(value.toLowerCase())) {
          processed[key] = parseBoolean(value)
        } else {
          processed[key] = cleanText(value)
        }
      } else {
        processed[key] = value
      }
    })
    
    return processed
  }
}

// Determine processor type based on filename
const getProcessorType = (filename) => {
  const lowerFilename = filename.toLowerCase()
  
  if (lowerFilename.includes('medical') || lowerFilename.includes('mbbs')) {
    return 'medical-colleges'
  } else if (lowerFilename.includes('dental') || lowerFilename.includes('bds')) {
    return 'dental-colleges'
  } else {
    return 'generic'
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
    const processorType = getProcessorType(path.basename(filePath))
    const processor = processors[processorType]
    
    console.log(`   Using processor: ${processorType}`)
    
    // Process each row
    const processedData = result.data
      .filter(row => Object.keys(row).some(key => row[key] && row[key].toString().trim()))
      .map((row, index) => {
        try {
          return processor(row)
        } catch (error) {
          console.error(`   Error processing row ${index + 1}:`, error.message)
          return null
        }
      })
      .filter(item => item !== null)
    
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
      recordCount: processedData.length,
      processorType
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

// Generate statistics
const generateStatistics = (results) => {
  const successful = results.filter(r => !r.error)
  const failed = results.filter(r => r.error)
  
  const totalRecords = successful.reduce((sum, r) => sum + r.recordCount, 0)
  const processorStats = {}
  
  successful.forEach(result => {
    processorStats[result.processorType] = (processorStats[result.processorType] || 0) + result.recordCount
  })
  
  return {
    totalFiles: results.length,
    successfulFiles: successful.length,
    failedFiles: failed.length,
    totalRecords,
    processorStats
  }
}

// Main conversion function
const main = async () => {
  try {
    console.log('🔄 Starting CSV to JSON conversion...')
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
    
    // Generate and display statistics
    const stats = generateStatistics(results)
    
    console.log('\n📈 Conversion Summary:')
    console.log(`   Total files: ${stats.totalFiles}`)
    console.log(`   Successful: ${stats.successfulFiles}`)
    console.log(`   Failed: ${stats.failedFiles}`)
    console.log(`   Total records: ${stats.totalRecords}`)
    
    if (Object.keys(stats.processorStats).length > 0) {
      console.log('\n📊 Records by processor:')
      Object.entries(stats.processorStats).forEach(([processor, count]) => {
        console.log(`   ${processor}: ${count} records`)
      })
    }
    
    if (stats.failedFiles > 0) {
      console.log('\n❌ Failed conversions:')
      results.filter(r => r.error).forEach(result => {
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