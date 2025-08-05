# Excel to CSV Conversion Guide

## Overview

The Medical Admissions Platform includes a comprehensive Excel to CSV conversion system that automatically processes Excel files from the `/src/EXCEL` directory and converts them into properly organized CSV files for counselling data analysis.

## 🎯 Features

- **Multi-sheet Support**: Processes all sheets in Excel workbooks
- **Intelligent Organization**: Automatically categorizes files by type (AIQ, State, etc.)
- **Smart Directory Structure**: Organizes output into appropriate subdirectories
- **Data Validation**: Cleans and validates data during conversion
- **Error Handling**: Graceful error handling with detailed logging
- **Batch Processing**: Handles multiple Excel files in a single run
- **CSV Escaping**: Properly handles commas, quotes, and special characters

## 📁 Directory Structure

```
src/
├── EXCEL/                           # Input directory for Excel files
│   ├── aiq-counselling-2024.xlsx
│   ├── karnataka-state-counselling-2024.xlsx
│   ├── dental-counselling-2024.xlsx
│   └── combined-counselling-data-2024.xlsx
└── data/                           # Output directory for CSV files
    ├── AIQ/                        # AIQ counselling data
    │   ├── aiq-counselling-2024-aiq-counselling.csv
    │   └── combined-counselling-data-2024-aiq-counselling.csv
    ├── state/                      # State counselling data
    │   └── karnataka/              # Karnataka state data
    │       ├── karnataka-state-counselling-2024-karnataka-counselling.csv
    │       └── combined-counselling-data-2024-karnataka-counselling.csv
    └── dental-counselling-2024-dental-counselling.csv
```

## 🚀 Quick Start

### 1. Place Excel Files
Place your Excel files in the `src/EXCEL` directory.

### 2. Run Conversion
```bash
npm run excel-to-csv
```

### 3. Check Output
Converted CSV files will be organized in `src/data/` subdirectories.

## 📋 Supported Excel Formats

- **`.xlsx`** - Modern Excel format (recommended)
- **`.xls`** - Legacy Excel format
- **`.XLSX`** - Case variations
- **`.XLS`** - Case variations

## 🔧 Available Scripts

### 1. Excel to CSV Conversion
```bash
npm run excel-to-csv
```
- **Purpose**: Convert Excel files to CSV format
- **Features**: Multi-sheet processing, intelligent organization
- **Output**: Organized CSV files in appropriate directories

### 2. Create Sample Excel Files
```bash
npm run create-sample-excel
```
- **Purpose**: Generate sample Excel files for testing
- **Features**: Creates AIQ, Karnataka, and Dental counselling data
- **Output**: Sample files in `src/EXCEL/` directory

## 📊 File Organization Logic

### AIQ Counselling Files
- **Detection**: Filename or sheet name contains "aiq"
- **Output Directory**: `src/data/AIQ/`
- **Example**: `aiq-counselling-2024.xlsx` → `src/data/AIQ/`

### Karnataka State Counselling Files
- **Detection**: Filename or sheet name contains "karnataka" or "kea"
- **Output Directory**: `src/data/state/karnataka/`
- **Example**: `karnataka-state-counselling-2024.xlsx` → `src/data/state/karnataka/`

### Other State Counselling Files
- **Detection**: Filename or sheet name contains state names
- **Output Directory**: `src/data/state/{state-name}/`
- **Supported States**: All Indian states and union territories

### Generic Files
- **Detection**: No specific keywords found
- **Output Directory**: `src/data/`
- **Example**: `dental-counselling-2024.xlsx` → `src/data/`

## 📝 Example Usage

### 1. Create Sample Data
```bash
npm run create-sample-excel
```

### 2. Convert to CSV
```bash
npm run excel-to-csv
```

### 3. Check Results
```bash
# Check AIQ files
ls src/data/AIQ/

# Check Karnataka files
ls src/data/state/karnataka/

# Check main data directory
ls src/data/
```

## 🔍 Data Processing

### Text Cleaning
- Removes extra whitespace
- Normalizes spaces
- Trims leading/trailing spaces

### CSV Escaping
- Handles commas in data fields
- Escapes quotes properly
- Handles newlines in data

### Filename Sanitization
- Removes special characters
- Converts spaces to hyphens
- Converts to lowercase

### Sheet Processing
- Processes all sheets in Excel files
- Uses sheet names in output filenames
- Handles empty sheets gracefully

## 📊 Sample Data Structure

### AIQ Counselling Data
```csv
Round,Category,Rank,Candidate Name,State,College Name,Course,Seat Type,Allotted,Reporting Date,Status
Round 1,General,1,Aarav Kumar,Delhi,AIIMS New Delhi,MBBS,AIQ,Yes,2024-08-15,Reported
Round 1,OBC,45,Priya Sharma,Maharashtra,JIPMER Puducherry,MBBS,AIQ,Yes,2024-08-16,Reported
```

### Karnataka State Counselling Data
```csv
Round,Category,Rank,Candidate Name,District,College Name,Course,Seat Type,Allotted,Reporting Date,Status,Merit Rank
Round 1,General,1,Kavya Gowda,Bangalore,Bangalore Medical College,MBBS,State Quota,Yes,2024-08-10,Reported,1500
Round 1,OBC,25,Arjun Shetty,Mangalore,Kasturba Medical College,MBBS,State Quota,Yes,2024-08-11,Reported,3200
```

### Dental Counselling Data
```csv
Round,Category,Rank,Candidate Name,State,College Name,Course,Seat Type,Allotted,Reporting Date,Status
Round 1,General,1,Aditi Verma,Delhi,Maulana Azad Institute of Dental Sciences,BDS,AIQ,Yes,2024-08-18,Reported
Round 1,OBC,30,Siddharth Gupta,Maharashtra,Government Dental College Mumbai,BDS,AIQ,Yes,2024-08-19,Reported
```

## 🔄 Multi-Sheet Processing

### Combined Excel Files
The system can handle Excel files with multiple sheets:

```
combined-counselling-data-2024.xlsx
├── AIQ Counselling (5 records)
├── Karnataka Counselling (5 records)
└── Dental Counselling (3 records)
```

### Output Organization
Each sheet is processed separately and organized by content:

```
src/data/
├── AIQ/
│   └── combined-counselling-data-2024-aiq-counselling.csv
├── state/karnataka/
│   └── combined-counselling-data-2024-karnataka-counselling.csv
└── combined-counselling-data-2024-dental-counselling.csv
```

## ⚠️ Troubleshooting

### Common Issues

#### 1. "No Excel files found"
- **Cause**: No Excel files in `src/EXCEL` directory
- **Solution**: Place Excel files in the correct directory

#### 2. "Error processing sheet"
- **Cause**: Corrupted or unsupported Excel format
- **Solution**: Check Excel file format and try saving as `.xlsx`

#### 3. "Empty sheet"
- **Cause**: Sheet contains no data
- **Solution**: Check Excel file content

#### 4. "Permission denied"
- **Cause**: File access permissions
- **Solution**: Check file permissions and directory access

### Debug Steps

1. **Check Excel Format**:
   ```bash
   file src/EXCEL/your-file.xlsx
   ```

2. **Validate Excel Content**:
   - Open Excel file manually
   - Check for data in sheets
   - Verify sheet names

3. **Test with Sample Data**:
   ```bash
   npm run create-sample-excel
   npm run excel-to-csv
   ```

4. **Check Output Directories**:
   ```bash
   ls -la src/data/
   ls -la src/data/AIQ/
   ls -la src/data/state/karnataka/
   ```

## 🔧 Customization

### Adding New State Support
1. Update `determineOutputPath` function in `scripts/excelToCsv.js`
2. Add state name pattern matching
3. Create corresponding output directory

### Modifying Output Format
1. Edit CSV generation logic in `convertSheetToCsv` function
2. Update field mappings
3. Test with sample data

### Custom Validation
1. Add validation functions
2. Integrate with processing pipeline
3. Handle validation errors

## 📈 Performance

### Processing Speed
- **Small files (< 1000 rows)**: < 1 second
- **Medium files (1000-10000 rows)**: 1-5 seconds
- **Large files (> 10000 rows)**: 5-30 seconds

### Memory Usage
- **Efficient processing**: Processes one sheet at a time
- **Minimal memory footprint**: No large data structures in memory
- **Streaming approach**: Suitable for large files

## 🔄 Integration with Other Tools

### CSV to JSON Conversion
After converting Excel to CSV, you can convert to JSON:

```bash
# Convert Excel to CSV
npm run excel-to-csv

# Convert CSV to JSON
npm run csv-to-json-minimal
```

### Database Import
Converted CSV files can be imported into the database:

```bash
# Convert Excel to CSV
npm run excel-to-csv

# Import to database
npm run migrate-data
```

## 📚 Best Practices

### Excel File Preparation
1. **Use consistent formatting**
2. **Include clear headers**
3. **Remove empty rows and columns**
4. **Use `.xlsx` format**
5. **Validate data before conversion**

### File Naming
1. **Use descriptive names**
2. **Include date stamps if needed**
3. **Avoid special characters**
4. **Use consistent naming convention**

### Data Quality
1. **Check for missing values**
2. **Validate data types**
3. **Ensure proper date formats**
4. **Test with sample data**

## 🆘 Support

### Getting Help
1. **Check this documentation first**
2. **Review error messages carefully**
3. **Test with sample files**
4. **Check file formats**

### Common Solutions
- **Format issues**: Convert to `.xlsx` format
- **Empty output**: Check Excel file content
- **Missing data**: Validate Excel structure
- **Permission errors**: Check file permissions

### Reporting Issues
When reporting issues, include:
- Excel file sample (first few rows)
- Error message
- Expected vs actual output
- File format and size

---

**Excel to CSV Conversion Status**: ✅ **Working**
**Supported Formats**: `.xlsx`, `.xls`
**Last Updated**: August 2025
**Version**: 1.0.0