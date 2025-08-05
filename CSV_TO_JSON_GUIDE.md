# CSV to JSON Conversion Guide

## Overview

The Medical Admissions Platform includes a comprehensive CSV to JSON conversion system that automatically processes CSV files from the `/src/CSVFILES` directory and converts them into properly formatted JSON files for use in the application.

## 🎯 Features

- **Automatic Processing**: Converts CSV files to JSON format
- **Multiple File Support**: Processes all CSV files in the input directory
- **Data Validation**: Validates and cleans data during conversion
- **Error Handling**: Graceful error handling with detailed logging
- **Flexible Output**: Generates properly structured JSON files
- **Batch Processing**: Handles multiple files in a single run

## 📁 Directory Structure

```
src/
├── CSVFILES/                    # Input directory for CSV files
│   ├── sample-medical-colleges.csv
│   ├── sample-dental-colleges.csv
│   └── your-csv-files.csv
└── data/                       # Output directory for JSON files
    ├── sample-medical-colleges.json
    ├── sample-dental-colleges.json
    └── your-csv-files.json
```

## 🚀 Quick Start

### 1. Place CSV Files
Place your CSV files in the `src/CSVFILES` directory.

### 2. Run Conversion
```bash
npm run csv-to-json-minimal
```

### 3. Check Output
Converted JSON files will be available in `src/data/` directory.

## 📋 Supported CSV Formats

### Medical Colleges CSV Structure
```csv
College Name,State,City,Type,Management,University,Recognition Status,Academic Year,MBBS Total Seats,MBBS AIQ Seats,MBBS State Seats,MBBS General,MBBS SC,MBBS ST,MBBS OBC,MBBS EWS,MBBS Govt Fee,MBBS Private Fee,MBBS NRI Fee,Bond Required,Bond Duration,Bond Amount,Bond Description,Address,Phone,Email,Website,Latitude,Longitude
```

### Dental Colleges CSV Structure
```csv
College Name,State,City,Type,Management,University,Recognition Status,Academic Year,BDS Total Seats,BDS AIQ Seats,BDS State Seats,BDS General,BDS SC,BDS ST,BDS OBC,BDS EWS,BDS Govt Fee,BDS Private Fee,BDS NRI Fee,Bond Required,Bond Duration,Bond Amount,Bond Description,Address,Phone,Email,Website,Latitude,Longitude
```

## 🔧 Available Scripts

### 1. Minimal Conversion (Recommended)
```bash
npm run csv-to-json-minimal
```
- **Purpose**: Basic CSV to JSON conversion
- **Features**: Simple processing, no complex transformations
- **Best for**: Most use cases

### 2. Simple Conversion
```bash
npm run csv-to-json-simple
```
- **Purpose**: Advanced processing with error handling
- **Features**: Multiple processors, detailed logging
- **Status**: Has recursion issues (not recommended)

### 3. Working Conversion
```bash
npm run csv-to-json-working
```
- **Purpose**: Enhanced processing with better error handling
- **Features**: Improved ID generation, data validation
- **Status**: Has recursion issues (not recommended)

### 4. Original Conversion
```bash
npm run csv-to-json
```
- **Purpose**: Full-featured conversion system
- **Features**: Multiple processors, analytics, caching
- **Status**: Has recursion issues (not recommended)

## 📊 Output Format

### Medical College JSON Structure
```json
{
  "id": "college-name-state",
  "name": "College Name",
  "state": "State",
  "city": "City",
  "type": "Government/Private",
  "management": "Management Type",
  "university": "University Name",
  "recognitionStatus": "Recognized/Not Recognized",
  "academicYear": "2024-25",
  "courses": [
    {
      "name": "MBBS",
      "duration": "5.5 years",
      "seats": 100,
      "recognitionStatus": "Recognized",
      "fees": {
        "government": 1500,
        "private": 1500,
        "nri": 1500
      }
    }
  ],
  "seatMatrix": {
    "mbbs": {
      "total": 100,
      "aiq": 15,
      "state": 85,
      "categories": {
        "general": 50,
        "sc": 15,
        "st": 7,
        "obc": 20,
        "ews": 8
      }
    }
  },
  "fees": {
    "mbbs": {
      "government": 1500,
      "private": 1500,
      "nri": 1500
    }
  },
  "bond": {
    "required": false,
    "duration": 0,
    "amount": 0,
    "description": ""
  },
  "contact": {
    "address": "Full Address",
    "phone": "Phone Number",
    "email": "Email Address",
    "website": "Website URL"
  },
  "coordinates": {
    "latitude": 28.5673,
    "longitude": 77.209
  },
  "lastUpdated": "2025-08-05T17:47:39.385Z",
  "source": "NMC",
  "confidence": "high"
}
```

### Dental College JSON Structure
Similar to medical colleges but with:
- Course name: "BDS"
- Duration: "5 years"
- Source: "DCI"
- Seat matrix key: "bds"

## 🔍 Data Processing

### Text Cleaning
- Removes extra whitespace
- Normalizes spaces
- Trims leading/trailing spaces

### Number Parsing
- Extracts numeric values from strings
- Handles currency symbols and formatting
- Converts to integers for counts and fees

### Boolean Parsing
- Converts "yes", "true", "1", "y" to `true`
- Converts "no", "false", "0", "n" to `false`

### ID Generation
- Creates unique IDs from college name and state
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters

### Coordinate Parsing
- Converts latitude/longitude to float values
- Handles missing coordinates gracefully

## 📝 Example Usage

### 1. Create Sample CSV File
```csv
College Name,State,City,Type,Management,University,Recognition Status,Academic Year,MBBS Total Seats,MBBS AIQ Seats,MBBS State Seats,MBBS General,MBBS SC,MBBS ST,MBBS OBC,MBBS EWS,MBBS Govt Fee,MBBS Private Fee,MBBS NRI Fee,Bond Required,Bond Duration,Bond Amount,Bond Description,Address,Phone,Email,Website,Latitude,Longitude
Sample Medical College,Karnataka,Bangalore,Government,Government,KU,Recognized,2024-25,150,22,128,75,22,11,30,12,1400,1400,1400,false,0,0,,Sample Address,080-12345678,info@sample.edu,https://www.sample.edu,12.9716,77.5946
```

### 2. Run Conversion
```bash
npm run csv-to-json-minimal
```

### 3. Check Output
```json
[
  {
    "id": "sample-medical-college-karnataka",
    "name": "Sample Medical College",
    "state": "Karnataka",
    "city": "Bangalore",
    "type": "Government",
    "management": "Government",
    "university": "KU",
    "recognitionStatus": "Recognized",
    "academicYear": "2024-25",
    "courses": [
      {
        "name": "MBBS",
        "duration": "5.5 years",
        "seats": 150,
        "recognitionStatus": "Recognized",
        "fees": {
          "government": 1400,
          "private": 1400,
          "nri": 1400
        }
      }
    ],
    "seatMatrix": {
      "mbbs": {
        "total": 150,
        "aiq": 22,
        "state": 128,
        "categories": {
          "general": 75,
          "sc": 22,
          "st": 11,
          "obc": 30,
          "ews": 12
        }
      }
    },
    "fees": {
      "mbbs": {
        "government": 1400,
        "private": 1400,
        "nri": 1400
      }
    },
    "bond": {
      "required": false,
      "duration": 0,
      "amount": 0,
      "description": ""
    },
    "contact": {
      "address": "Sample Address",
      "phone": "080-12345678",
      "email": "info@sample.edu",
      "website": "https://www.sample.edu"
    },
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "lastUpdated": "2025-08-05T17:47:39.385Z",
    "source": "NMC",
    "confidence": "high"
  }
]
```

## ⚠️ Troubleshooting

### Common Issues

#### 1. "Maximum call stack size exceeded"
- **Cause**: Recursion in processing functions
- **Solution**: Use `npm run csv-to-json-minimal` (recommended)

#### 2. "No CSV files found"
- **Cause**: No CSV files in `src/CSVFILES` directory
- **Solution**: Place CSV files in the correct directory

#### 3. "Error processing row"
- **Cause**: Invalid data in CSV row
- **Solution**: Check CSV format and data quality

#### 4. "CSV parsing warnings"
- **Cause**: Malformed CSV data
- **Solution**: Validate CSV file format

### Debug Steps

1. **Check CSV Format**:
   ```bash
   head -5 src/CSVFILES/your-file.csv
   ```

2. **Validate CSV Structure**:
   - Ensure headers match expected format
   - Check for missing commas
   - Verify data types

3. **Test with Sample Data**:
   - Use provided sample files
   - Compare with working examples

4. **Check File Encoding**:
   - Ensure files are UTF-8 encoded
   - Remove BOM if present

## 🔄 Integration with Database

### Automatic Database Population
After converting CSV to JSON, you can populate the database:

```bash
# Convert CSV to JSON
npm run csv-to-json-minimal

# Populate database
npm run migrate-data
```

### Manual Database Import
```javascript
import databaseService from './src/services/database.js'
import fs from 'fs'

// Load converted JSON
const colleges = JSON.parse(fs.readFileSync('src/data/your-file.json', 'utf8'))

// Import to database
for (const college of colleges) {
  await databaseService.createMedicalCollege(college)
}
```

## 📈 Performance

### Processing Speed
- **Small files (< 1000 rows)**: < 1 second
- **Medium files (1000-10000 rows)**: 1-5 seconds
- **Large files (> 10000 rows)**: 5-30 seconds

### Memory Usage
- **Efficient processing**: Processes one row at a time
- **Minimal memory footprint**: No large data structures in memory
- **Streaming approach**: Suitable for large files

## 🔧 Customization

### Adding New Processors
1. Create processor function in script
2. Add processor mapping logic
3. Update documentation

### Modifying Output Format
1. Edit the object structure in processing functions
2. Update field mappings
3. Test with sample data

### Custom Validation
1. Add validation functions
2. Integrate with processing pipeline
3. Handle validation errors

## 📚 Best Practices

### CSV File Preparation
1. **Use consistent formatting**
2. **Include all required columns**
3. **Validate data before conversion**
4. **Use UTF-8 encoding**
5. **Remove empty rows**

### Data Quality
1. **Check for missing values**
2. **Validate numeric fields**
3. **Ensure proper date formats**
4. **Verify coordinate accuracy**
5. **Test with sample data**

### File Naming
1. **Use descriptive names**
2. **Include date stamps if needed**
3. **Avoid special characters**
4. **Use consistent naming convention**

## 🆘 Support

### Getting Help
1. **Check this documentation first**
2. **Review error messages carefully**
3. **Test with sample files**
4. **Check file formats and encoding**

### Common Solutions
- **Recursion errors**: Use minimal conversion script
- **Empty output**: Check CSV file format
- **Missing data**: Validate CSV structure
- **Encoding issues**: Convert to UTF-8

### Reporting Issues
When reporting issues, include:
- CSV file sample (first few rows)
- Error message
- Script used
- Expected vs actual output

---

**CSV to JSON Conversion Status**: ✅ **Working**
**Recommended Script**: `npm run csv-to-json-minimal`
**Last Updated**: August 2025
**Version**: 1.0.0