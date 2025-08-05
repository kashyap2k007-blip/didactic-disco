#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

console.log('🚀 Setting up Medical Admissions Platform...\n')

// Check Node.js version
const nodeVersion = process.version
const requiredVersion = '18.0.0'
const currentVersion = nodeVersion.replace('v', '')

if (parseFloat(currentVersion) < parseFloat(requiredVersion)) {
  console.error(`❌ Node.js ${requiredVersion} or higher is required. Current version: ${nodeVersion}`)
  process.exit(1)
}

console.log(`✅ Node.js version: ${nodeVersion}`)

// Check if package.json exists
const packageJsonPath = path.join(projectRoot, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this script from the project root.')
  process.exit(1)
}

// Install dependencies
console.log('\n📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Dependencies installed successfully')
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message)
  process.exit(1)
}

// Install additional Tailwind plugins
console.log('\n🎨 Installing Tailwind CSS plugins...')
try {
  execSync('npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio', { 
    stdio: 'inherit', 
    cwd: projectRoot 
  })
  console.log('✅ Tailwind plugins installed successfully')
} catch (error) {
  console.error('❌ Failed to install Tailwind plugins:', error.message)
  process.exit(1)
}

// Create .env file if it doesn't exist
const envPath = path.join(projectRoot, '.env')
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️  Creating .env file...')
  const envContent = `# Medical Admissions Platform Environment Variables
VITE_APP_NAME="Medical Admissions Platform"
VITE_APP_URL="https://medicaladmissions.in"
VITE_API_URL="https://api.medicaladmissions.in"
VITE_GOOGLE_ANALYTICS_ID=""
VITE_SENTRY_DSN=""
NODE_ENV="development"
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env file created')
} else {
  console.log('✅ .env file already exists')
}

// Create data directories
console.log('\n📁 Creating data directories...')
const dataDirs = [
  path.join(projectRoot, 'data', 'raw'),
  path.join(projectRoot, 'src', 'data')
]

dataDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }
})

// Process sample data
console.log('\n📊 Processing sample data...')
try {
  execSync('npm run process-data', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Sample data processed successfully')
} catch (error) {
  console.error('❌ Failed to process data:', error.message)
  process.exit(1)
}

// Build the project
console.log('\n🔨 Building the project...')
try {
  execSync('npm run build', { stdio: 'inherit', cwd: projectRoot })
  console.log('✅ Project built successfully')
} catch (error) {
  console.error('❌ Failed to build project:', error.message)
  process.exit(1)
}

console.log('\n🎉 Setup completed successfully!')
console.log('\n📋 Next steps:')
console.log('1. Start development server: npm run dev')
console.log('2. Open http://localhost:3000 in your browser')
console.log('3. Add your college data CSV files to data/raw/')
console.log('4. Run npm run process-data to update the database')
console.log('5. Deploy to your preferred platform (see DEPLOYMENT.md)')

console.log('\n📚 Documentation:')
console.log('- README.md - Project overview and features')
console.log('- DEPLOYMENT.md - Detailed deployment instructions')
console.log('- package.json - Available scripts and dependencies')

console.log('\n🚀 Happy coding!')