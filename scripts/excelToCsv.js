#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'src', 'EXCEL'),
  outputDir: path.join(__dirname, '..', 'src', 'data'),
  supportedFormats: ['.xlsx', '.xls', '.XLSX', '.XLS'],
  encoding: 'utf-8'
}

// Utility functions
const cleanText = (text) => {
  if (!text) return ''
  return text.toString().trim().replace(/\s+/g, ' ')
}

const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase()
}

const determineOutputPath = (filename, sheetName) => {
  const lowerFilename = filename.toLowerCase()
  const lowerSheetName = sheetName.toLowerCase()
  
  // AIQ Counselling files
  if (lowerFilename.includes('aiq') || lowerSheetName.includes('aiq')) {
    return path.join(CONFIG.outputDir, 'AIQ')
  }
  
  // Karnataka State Counselling files
  if (lowerFilename.includes('karnataka') || lowerSheetName.includes('karnataka') || 
      lowerFilename.includes('kea') || lowerSheetName.includes('kea')) {
    return path.join(CONFIG.outputDir, 'state', 'karnataka')
  }
  
  // Other state counselling files
  if (lowerFilename.includes('state') || lowerSheetName.includes('state')) {
    // Extract state name from filename or sheet name
    const stateMatch = lowerFilename.match(/(delhi|maharashtra|tamil-nadu|kerala|andhra-pradesh|telangana|gujarat|rajasthan|punjab|haryana|uttar-pradesh|bihar|west-bengal|odisha|assam|manipur|meghalaya|nagaland|tripura|arunachal-pradesh|mizoram|sikkim|goa|chhattisgarh|jharkhand|himachal-pradesh|uttarakhand|chandigarh|dadra-nagar-haveli|daman-diu|lakshadweep|andaman-nicobar|puducherry)/)
    if (stateMatch) {
      return path.join(CONFIG.outputDir, 'state', stateMatch[1])
    }
  }
  
  // Default to main data directory
  return CONFIG.outputDir
}

const processSheet = (worksheet, sheetName, filename) => {
  try {
    // Convert worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false
    })
    
    if (jsonData.length === 0) {
      console.log(`   ⚠️  Sheet "${sheetName}" is empty`)
      return null
    }
    
    // Get headers from first row
    const headers = jsonData[0].map(header => cleanText(header))
    
    // Process data rows
    const processedData = []
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      const processedRow = {}
      
      headers.forEach((header, index) => {
        if (header) {
          processedRow[header] = cleanText(row[index] || '')
        }
      })
      
      // Only add row if it has some data
      if (Object.values(processedRow).some(value => value && value.trim())) {
        processedData.push(processedRow)
      }
    }
    
    return {
      headers,
      data: processedData,
      rowCount: processedData.length
    }
    
  } catch (error) {
    console.error(`   ❌ Error processing sheet "${sheetName}":`, error.message)
    return null
  }
}

const convertSheetToCsv = (sheetData, outputPath, filename, sheetName) => {
  try {
    if (!sheetData || sheetData.data.length === 0) {
      return null
    }
    
    // Create CSV content
    const headers = sheetData.headers
    const csvRows = [headers.join(',')]
    
    sheetData.data.forEach(row => {
      const csvRow = headers.map(header => {
        const value = row[header] || ''
        // Escape commas and quotes in CSV
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      csvRows.push(csvRow.join(','))
    })
    
    const csvContent = csvRows.join('\n')
    
    // Generate output filename
    const baseName = path.basename(filename, path.extname(filename))
    const sanitizedSheetName = sanitizeFilename(sheetName)
    const outputFileName = `${baseName}-${sanitizedSheetName}.csv`
    const outputFilePath = path.join(outputPath, outputFileName)
    
    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true })
    }
    
    // Write CSV file
    fs.writeFileSync(outputFilePath, csvContent, CONFIG.encoding)
    
    return {
      outputFile: outputFileName,
      outputPath: outputFilePath,
      rowCount: sheetData.rowCount,
      headerCount: sheetData.headers.length
    }
    
  } catch (error) {
    console.error(`   ❌ Error converting sheet "${sheetName}" to CSV:`, error.message)
    return null
  }
}

const convertExcelToCsv = async (filePath) => {
  try {
    console.log(`📄 Processing: ${path.basename(filePath)}`)
    
    // Read Excel file
    const workbook = XLSX.readFile(filePath)
    const sheetNames = workbook.SheetNames
    
    console.log(`   📊 Found ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}`)
    
    const results = []
    
    // Process each sheet
    for (const sheetName of sheetNames) {
      console.log(`   📋 Processing sheet: "${sheetName}"`)
      
      const worksheet = workbook.Sheets[sheetName]
      const sheetData = processSheet(worksheet, sheetName, path.basename(filePath))
      
      if (sheetData) {
        // Determine output path based on file content
        const outputPath = determineOutputPath(path.basename(filePath), sheetName)
        console.log(`   📁 Output directory: ${path.relative(CONFIG.outputDir, outputPath)}`)
        
        const csvResult = convertSheetToCsv(sheetData, outputPath, path.basename(filePath), sheetName)
        
        if (csvResult) {
          results.push({
            sheetName,
            ...csvResult
          })
          
          console.log(`   ✅ Converted: ${csvResult.rowCount} rows → ${csvResult.outputFile}`)
        }
      }
    }
    
    return {
      inputFile: path.basename(filePath),
      totalSheets: sheetNames.length,
      convertedSheets: results.length,
      results
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message)
    return {
      inputFile: path.basename(filePath),
      error: error.message
    }
  }
}

const getExcelFiles = () => {
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

const ensureOutputDirs = () => {
  const dirs = [
    CONFIG.outputDir,
    path.join(CONFIG.outputDir, 'AIQ'),
    path.join(CONFIG.outputDir, 'state'),
    path.join(CONFIG.outputDir, 'state', 'karnataka')
  ]
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Creating directory: ${dir}`)
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

const generateStatistics = (results) => {
  const successful = results.filter(r => !r.error)
  const failed = results.filter(r => r.error)
  
  let totalSheets = 0
  let totalRows = 0
  let totalFiles = 0
  
  const outputStats = {}
  
  successful.forEach(result => {
    totalSheets += result.convertedSheets
    totalFiles++
    
    result.results.forEach(sheetResult => {
      totalRows += sheetResult.rowCount
      
      const relativePath = path.relative(CONFIG.outputDir, path.dirname(sheetResult.outputPath))
      outputStats[relativePath] = (outputStats[relativePath] || 0) + 1
    })
  })
  
  return {
    totalFiles: results.length,
    successfulFiles: successful.length,
    failedFiles: failed.length,
    totalSheets,
    totalRows,
    outputStats
  }
}

const main = async () => {
  try {
    console.log('🔄 Starting Excel to CSV conversion...')
    console.log(`📂 Input directory: ${CONFIG.inputDir}`)
    console.log(`📂 Output directory: ${CONFIG.outputDir}`)
    
    // Ensure directories exist
    ensureOutputDirs()
    
    // Get Excel files
    const excelFiles = getExcelFiles()
    
    if (excelFiles.length === 0) {
      console.log('📝 No Excel files found in input directory.')
      console.log(`   Please place Excel files in: ${CONFIG.inputDir}`)
      console.log('   Supported formats:', CONFIG.supportedFormats.join(', '))
      return
    }
    
    console.log(`📊 Found ${excelFiles.length} Excel file(s) to process`)
    
    // Process each file
    const results = []
    for (const filePath of excelFiles) {
      const result = await convertExcelToCsv(filePath)
      results.push(result)
    }
    
    // Generate and display statistics
    const stats = generateStatistics(results)
    
    console.log('\n📈 Conversion Summary:')
    console.log(`   Total files: ${stats.totalFiles}`)
    console.log(`   Successful: ${stats.successfulFiles}`)
    console.log(`   Failed: ${stats.failedFiles}`)
    console.log(`   Total sheets: ${stats.totalSheets}`)
    console.log(`   Total rows: ${stats.totalRows}`)
    
    if (Object.keys(stats.outputStats).length > 0) {
      console.log('\n📊 Files by output directory:')
      Object.entries(stats.outputStats).forEach(([dir, count]) => {
        console.log(`   ${dir}: ${count} file(s)`)
      })
    }
    
    if (stats.failedFiles > 0) {
      console.log('\n❌ Failed conversions:')
      results.filter(r => r.error).forEach(result => {
        console.log(`   ${result.inputFile}: ${result.error}`)
      })
    }
    
    console.log('\n🎉 Excel to CSV conversion completed!')
    
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