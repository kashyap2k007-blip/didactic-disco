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
    
    // Process each row - minimal processing
    const processedData = []
    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i]
      
      // Skip empty rows
      if (!Object.keys(row).some(key => row[key] && row[key].toString().trim())) {
        continue
      }
      
      try {
        // Create a simple object without complex processing
        const processed = {
          id: `${row['College Name']?.toString().toLowerCase().replace(/\s+/g, '-')}-${row['State']?.toString().toLowerCase().replace(/\s+/g, '-')}`,
          name: row['College Name']?.toString().trim() || '',
          state: row['State']?.toString().trim() || '',
          city: row['City']?.toString().trim() || '',
          type: row['Type']?.toString().trim() || '',
          management: row['Management']?.toString().trim() || '',
          university: row['University']?.toString().trim() || '',
          recognitionStatus: row['Recognition Status']?.toString().trim() || '',
          academicYear: row['Academic Year']?.toString().trim() || '',
          courses: [{
            name: 'MBBS',
            duration: '5.5 years',
            seats: parseInt(row['MBBS Total Seats']?.toString().replace(/[^\d]/g, '') || '0'),
            recognitionStatus: row['Recognition Status']?.toString().trim() || '',
            fees: {
              government: parseInt(row['MBBS Govt Fee']?.toString().replace(/[^\d]/g, '') || '0'),
              private: parseInt(row['MBBS Private Fee']?.toString().replace(/[^\d]/g, '') || '0'),
              nri: parseInt(row['MBBS NRI Fee']?.toString().replace(/[^\d]/g, '') || '0')
            }
          }],
          seatMatrix: {
            mbbs: {
              total: parseInt(row['MBBS Total Seats']?.toString().replace(/[^\d]/g, '') || '0'),
              aiq: parseInt(row['MBBS AIQ Seats']?.toString().replace(/[^\d]/g, '') || '0'),
              state: parseInt(row['MBBS State Seats']?.toString().replace(/[^\d]/g, '') || '0'),
              categories: {
                general: parseInt(row['MBBS General']?.toString().replace(/[^\d]/g, '') || '0'),
                sc: parseInt(row['MBBS SC']?.toString().replace(/[^\d]/g, '') || '0'),
                st: parseInt(row['MBBS ST']?.toString().replace(/[^\d]/g, '') || '0'),
                obc: parseInt(row['MBBS OBC']?.toString().replace(/[^\d]/g, '') || '0'),
                ews: parseInt(row['MBBS EWS']?.toString().replace(/[^\d]/g, '') || '0')
              }
            }
          },
          fees: {
            mbbs: {
              government: parseInt(row['MBBS Govt Fee']?.toString().replace(/[^\d]/g, '') || '0'),
              private: parseInt(row['MBBS Private Fee']?.toString().replace(/[^\d]/g, '') || '0'),
              nri: parseInt(row['MBBS NRI Fee']?.toString().replace(/[^\d]/g, '') || '0')
            }
          },
          bond: {
            required: ['yes', 'true', '1', 'y'].includes(row['Bond Required']?.toString().toLowerCase() || ''),
            duration: parseInt(row['Bond Duration']?.toString().replace(/[^\d]/g, '') || '0'),
            amount: parseInt(row['Bond Amount']?.toString().replace(/[^\d]/g, '') || '0'),
            description: row['Bond Description']?.toString().trim() || ''
          },
          contact: {
            address: row['Address']?.toString().trim() || '',
            phone: row['Phone']?.toString().trim() || '',
            email: row['Email']?.toString().trim() || '',
            website: row['Website']?.toString().trim() || ''
          },
          coordinates: {
            latitude: parseFloat(row['Latitude']?.toString() || '0'),
            longitude: parseFloat(row['Longitude']?.toString() || '0')
          },
          lastUpdated: new Date().toISOString(),
          source: 'NMC',
          confidence: 'high'
        }
        
        processedData.push(processed)
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
    console.log('🔄 Starting CSV to JSON conversion (Minimal)...')
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