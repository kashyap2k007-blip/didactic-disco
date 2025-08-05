#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import databaseService from '../src/services/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Sample data for initial population
const sampleMedicalColleges = [
  {
    id: 'aiims-new-delhi-delhi',
    name: 'All India Institute of Medical Sciences, New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    management: 'Government',
    university: 'AIIMS',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      mbbs: {
        total: 100,
        aiq: 15,
        state: 85,
        categories: {
          general: 50,
          sc: 15,
          st: 7,
          obc: 20,
          ews: 8
        }
      }
    },
    fees: {
      mbbs: {
        government: 1500,
        private: 1500,
        nri: 1500
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
      phone: '011-26588500',
      email: 'info@aiims.edu',
      website: 'https://www.aiims.edu'
    },
    coordinates: {
      latitude: 28.5673,
      longitude: 77.2090
    },
    source: 'NMC',
    confidence: 'high'
  },
  {
    id: 'jipmer-puducherry-puducherry',
    name: 'Jawaharlal Institute of Postgraduate Medical Education and Research',
    state: 'Puducherry',
    city: 'Puducherry',
    type: 'Government',
    management: 'Government',
    university: 'JIPMER',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      mbbs: {
        total: 150,
        aiq: 22,
        state: 128,
        categories: {
          general: 75,
          sc: 22,
          st: 11,
          obc: 30,
          ews: 12
        }
      }
    },
    fees: {
      mbbs: {
        government: 1200,
        private: 1200,
        nri: 1200
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'Dhanvantri Nagar, Puducherry',
      phone: '0413-2272380',
      email: 'info@jipmer.edu.in',
      website: 'https://www.jipmer.edu.in'
    },
    coordinates: {
      latitude: 11.9416,
      longitude: 79.8083
    },
    source: 'NMC',
    confidence: 'high'
  },
  {
    id: 'maulana-azad-medical-college-delhi',
    name: 'Maulana Azad Medical College',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    management: 'Government',
    university: 'Delhi University',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      mbbs: {
        total: 200,
        aiq: 30,
        state: 170,
        categories: {
          general: 100,
          sc: 30,
          st: 15,
          obc: 40,
          ews: 15
        }
      }
    },
    fees: {
      mbbs: {
        government: 1800,
        private: 1800,
        nri: 1800
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'MAMC Complex, Bahadur Shah Zafar Marg, New Delhi',
      phone: '011-23239271',
      email: 'info@mamc.ac.in',
      website: 'https://www.mamc.ac.in'
    },
    coordinates: {
      latitude: 28.6562,
      longitude: 77.2410
    },
    source: 'NMC',
    confidence: 'high'
  },
  {
    id: 'king-george-medical-university-lucknow',
    name: 'King George Medical University',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    type: 'Government',
    management: 'Government',
    university: 'KGMU',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      mbbs: {
        total: 180,
        aiq: 27,
        state: 153,
        categories: {
          general: 90,
          sc: 27,
          st: 13,
          obc: 36,
          ews: 14
        }
      }
    },
    fees: {
      mbbs: {
        government: 1600,
        private: 1600,
        nri: 1600
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'Shah Mina Road, Chowk, Lucknow',
      phone: '0522-2257450',
      email: 'info@kgmu.org',
      website: 'https://www.kgmu.org'
    },
    coordinates: {
      latitude: 26.8467,
      longitude: 80.9462
    },
    source: 'NMC',
    confidence: 'high'
  },
  {
    id: 'government-medical-college-mumbai',
    name: 'Government Medical College, Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    management: 'Government',
    university: 'MUHS',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      mbbs: {
        total: 150,
        aiq: 22,
        state: 128,
        categories: {
          general: 75,
          sc: 22,
          st: 11,
          obc: 30,
          ews: 12
        }
      }
    },
    fees: {
      mbbs: {
        government: 1400,
        private: 1400,
        nri: 1400
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'St. George Hospital Campus, Mumbai',
      phone: '022-22621861',
      email: 'info@gmcmumbai.edu.in',
      website: 'https://www.gmcmumbai.edu.in'
    },
    coordinates: {
      latitude: 18.9290,
      longitude: 72.8347
    },
    source: 'NMC',
    confidence: 'high'
  }
]

const sampleDentalColleges = [
  {
    id: 'maulana-azad-institute-of-dental-sciences-delhi',
    name: 'Maulana Azad Institute of Dental Sciences',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    management: 'Government',
    university: 'Delhi University',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      bds: {
        total: 50,
        aiq: 8,
        state: 42,
        categories: {
          general: 25,
          sc: 8,
          st: 4,
          obc: 10,
          ews: 3
        }
      }
    },
    fees: {
      bds: {
        government: 2000,
        private: 2000,
        nri: 2000
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'MAMC Complex, Bahadur Shah Zafar Marg, New Delhi',
      phone: '011-23239271',
      email: 'info@maids.ac.in',
      website: 'https://www.maids.ac.in'
    },
    coordinates: {
      latitude: 28.6562,
      longitude: 77.2410
    },
    source: 'DCI',
    confidence: 'high'
  },
  {
    id: 'government-dental-college-mumbai',
    name: 'Government Dental College, Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    management: 'Government',
    university: 'MUHS',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      bds: {
        total: 40,
        aiq: 6,
        state: 34,
        categories: {
          general: 20,
          sc: 6,
          st: 3,
          obc: 8,
          ews: 3
        }
      }
    },
    fees: {
      bds: {
        government: 1800,
        private: 1800,
        nri: 1800
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'St. George Hospital Campus, Mumbai',
      phone: '022-22621861',
      email: 'info@gdcmumbai.edu.in',
      website: 'https://www.gdcmumbai.edu.in'
    },
    coordinates: {
      latitude: 18.9290,
      longitude: 72.8347
    },
    source: 'DCI',
    confidence: 'high'
  },
  {
    id: 'government-dental-college-chennai',
    name: 'Government Dental College, Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Government',
    management: 'Government',
    university: 'TNMGRMU',
    recognitionStatus: 'Recognized',
    academicYear: '2024-25',
    seatMatrix: {
      bds: {
        total: 60,
        aiq: 9,
        state: 51,
        categories: {
          general: 30,
          sc: 9,
          st: 4,
          obc: 12,
          ews: 5
        }
      }
    },
    fees: {
      bds: {
        government: 1600,
        private: 1600,
        nri: 1600
      }
    },
    bond: {
      required: false,
      duration: 0,
      amount: 0,
      description: ''
    },
    contact: {
      address: 'Park Town, Chennai',
      phone: '044-25305000',
      email: 'info@gdcchennai.edu.in',
      website: 'https://www.gdcchennai.edu.in'
    },
    coordinates: {
      latitude: 13.0827,
      longitude: 80.2707
    },
    source: 'DCI',
    confidence: 'high'
  }
]

async function migrateData() {
  try {
    console.log('🚀 Starting data migration...')
    
    // Initialize database
    await databaseService.initialize()
    
    console.log('📊 Migrating medical colleges...')
    for (const college of sampleMedicalColleges) {
      try {
        await databaseService.createMedicalCollege(college)
        console.log(`✅ Added: ${college.name}`)
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Skipped (already exists): ${college.name}`)
        } else {
          console.error(`❌ Error adding ${college.name}:`, error.message)
        }
      }
    }
    
    console.log('🦷 Migrating dental colleges...')
    for (const college of sampleDentalColleges) {
      try {
        await databaseService.createMedicalCollege(college) // Using same table structure
        console.log(`✅ Added: ${college.name}`)
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Skipped (already exists): ${college.name}`)
        } else {
          console.error(`❌ Error adding ${college.name}:`, error.message)
        }
      }
    }
    
    // Get statistics
    const stats = await databaseService.getStatistics()
    console.log('\n📈 Migration completed! Database statistics:')
    console.log(`   Medical Colleges: ${stats.totalMedicalColleges}`)
    console.log(`   Dental Colleges: ${stats.totalDentalColleges}`)
    console.log(`   Total Colleges: ${stats.totalColleges}`)
    console.log(`   States Covered: ${stats.statesCovered}`)
    
    console.log('\n🎉 Data migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await databaseService.close()
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData()
}

export default migrateData