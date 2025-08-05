#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Sample AIQ Counselling Data
const aiqCounsellingData = [
  {
    'Round': 'Round 1',
    'Category': 'General',
    'Rank': 1,
    'Candidate Name': 'Aarav Kumar',
    'State': 'Delhi',
    'College Name': 'AIIMS New Delhi',
    'Course': 'MBBS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-15',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 1',
    'Category': 'OBC',
    'Rank': 45,
    'Candidate Name': 'Priya Sharma',
    'State': 'Maharashtra',
    'College Name': 'JIPMER Puducherry',
    'Course': 'MBBS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-16',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 1',
    'Category': 'SC',
    'Rank': 120,
    'Candidate Name': 'Rahul Singh',
    'State': 'Uttar Pradesh',
    'College Name': 'Maulana Azad Medical College',
    'Course': 'MBBS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-17',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 2',
    'Category': 'General',
    'Rank': 250,
    'Candidate Name': 'Ananya Patel',
    'State': 'Gujarat',
    'College Name': 'King George Medical University',
    'Course': 'MBBS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-20',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 2',
    'Category': 'EWS',
    'Rank': 89,
    'Candidate Name': 'Vikram Reddy',
    'State': 'Telangana',
    'College Name': 'Government Medical College Mumbai',
    'Course': 'MBBS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-21',
    'Status': 'Reported'
  }
]

// Sample Karnataka State Counselling Data
const karnatakaCounsellingData = [
  {
    'Round': 'Round 1',
    'Category': 'General',
    'Rank': 1,
    'Candidate Name': 'Kavya Gowda',
    'District': 'Bangalore',
    'College Name': 'Bangalore Medical College',
    'Course': 'MBBS',
    'Seat Type': 'State Quota',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-10',
    'Status': 'Reported',
    'Merit Rank': 1500
  },
  {
    'Round': 'Round 1',
    'Category': 'OBC',
    'Rank': 25,
    'Candidate Name': 'Arjun Shetty',
    'District': 'Mangalore',
    'College Name': 'Kasturba Medical College',
    'Course': 'MBBS',
    'Seat Type': 'State Quota',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-11',
    'Status': 'Reported',
    'Merit Rank': 3200
  },
  {
    'Round': 'Round 1',
    'Category': 'SC',
    'Rank': 50,
    'Candidate Name': 'Lakshmi Devi',
    'District': 'Mysore',
    'College Name': 'Mysore Medical College',
    'Course': 'MBBS',
    'Seat Type': 'State Quota',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-12',
    'Status': 'Reported',
    'Merit Rank': 4500
  },
  {
    'Round': 'Round 2',
    'Category': 'General',
    'Rank': 100,
    'Candidate Name': 'Rohan Kumar',
    'District': 'Hubli',
    'College Name': 'Karnataka Institute of Medical Sciences',
    'Course': 'MBBS',
    'Seat Type': 'State Quota',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-15',
    'Status': 'Reported',
    'Merit Rank': 5800
  },
  {
    'Round': 'Round 2',
    'Category': 'ST',
    'Rank': 15,
    'Candidate Name': 'Meera Naik',
    'District': 'Belgaum',
    'College Name': 'Belgaum Institute of Medical Sciences',
    'Course': 'MBBS',
    'Seat Type': 'State Quota',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-16',
    'Status': 'Reported',
    'Merit Rank': 7200
  }
]

// Sample Dental Counselling Data
const dentalCounsellingData = [
  {
    'Round': 'Round 1',
    'Category': 'General',
    'Rank': 1,
    'Candidate Name': 'Aditi Verma',
    'State': 'Delhi',
    'College Name': 'Maulana Azad Institute of Dental Sciences',
    'Course': 'BDS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-18',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 1',
    'Category': 'OBC',
    'Rank': 30,
    'Candidate Name': 'Siddharth Gupta',
    'State': 'Maharashtra',
    'College Name': 'Government Dental College Mumbai',
    'Course': 'BDS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-19',
    'Status': 'Reported'
  },
  {
    'Round': 'Round 2',
    'Category': 'SC',
    'Rank': 75,
    'Candidate Name': 'Neha Yadav',
    'State': 'Tamil Nadu',
    'College Name': 'Government Dental College Chennai',
    'Course': 'BDS',
    'Seat Type': 'AIQ',
    'Allotted': 'Yes',
    'Reporting Date': '2024-08-22',
    'Status': 'Reported'
  }
]

const createExcelFile = (data, filename, sheetName) => {
  try {
    // Create workbook
    const workbook = XLSX.utils.book_new()
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'src', 'EXCEL', filename)
    XLSX.writeFile(workbook, outputPath)
    
    console.log(`✅ Created: ${filename} with ${data.length} records`)
    
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message)
  }
}

const main = async () => {
  try {
    console.log('🔄 Creating sample Excel files...')
    
    // Ensure EXCEL directory exists
    const excelDir = path.join(__dirname, '..', 'src', 'EXCEL')
    if (!fs.existsSync(excelDir)) {
      fs.mkdirSync(excelDir, { recursive: true })
    }
    
    // Create sample files
    createExcelFile(aiqCounsellingData, 'aiq-counselling-2024.xlsx', 'AIQ Counselling')
    createExcelFile(karnatakaCounsellingData, 'karnataka-state-counselling-2024.xlsx', 'Karnataka Counselling')
    createExcelFile(dentalCounsellingData, 'dental-counselling-2024.xlsx', 'Dental Counselling')
    
    // Create a multi-sheet file
    const multiSheetWorkbook = XLSX.utils.book_new()
    
    // Add AIQ sheet
    const aiqWorksheet = XLSX.utils.json_to_sheet(aiqCounsellingData)
    XLSX.utils.book_append_sheet(multiSheetWorkbook, aiqWorksheet, 'AIQ Counselling')
    
    // Add Karnataka sheet
    const karnatakaWorksheet = XLSX.utils.json_to_sheet(karnatakaCounsellingData)
    XLSX.utils.book_append_sheet(multiSheetWorkbook, karnatakaWorksheet, 'Karnataka Counselling')
    
    // Add Dental sheet
    const dentalWorksheet = XLSX.utils.json_to_sheet(dentalCounsellingData)
    XLSX.utils.book_append_sheet(multiSheetWorkbook, dentalWorksheet, 'Dental Counselling')
    
    // Write multi-sheet file
    const multiSheetPath = path.join(excelDir, 'combined-counselling-data-2024.xlsx')
    XLSX.writeFile(multiSheetWorkbook, multiSheetPath)
    
    console.log(`✅ Created: combined-counselling-data-2024.xlsx with 3 sheets`)
    
    console.log('\n🎉 Sample Excel files created successfully!')
    console.log('📁 Files created in: src/EXCEL/')
    
  } catch (error) {
    console.error('❌ Error creating sample files:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main