# Database Integration Guide

## Overview

The Medical Admissions Platform now includes a comprehensive database integration system that provides:

- **SQLite Database**: Local database for development and small-scale deployments
- **API Service Layer**: Client-side service with caching and fallback mechanisms
- **Data Migration**: Automated data population from CSV/JSON sources
- **Analytics Tracking**: Search and view analytics
- **Fallback System**: Graceful degradation to static data

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Service   │    │   Database      │
│   Components    │───▶│   (Client-side) │───▶│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Data   │    │   Caching       │    │   Analytics     │
│   (Fallback)    │    │   (5 min TTL)   │    │   Tables        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Schema

### Medical Colleges Table
```sql
CREATE TABLE medical_colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  management TEXT NOT NULL,
  university TEXT,
  recognition_status TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  total_seats INTEGER DEFAULT 0,
  aiq_seats INTEGER DEFAULT 0,
  state_seats INTEGER DEFAULT 0,
  general_seats INTEGER DEFAULT 0,
  sc_seats INTEGER DEFAULT 0,
  st_seats INTEGER DEFAULT 0,
  obc_seats INTEGER DEFAULT 0,
  ews_seats INTEGER DEFAULT 0,
  govt_fee INTEGER DEFAULT 0,
  private_fee INTEGER DEFAULT 0,
  nri_fee INTEGER DEFAULT 0,
  bond_required BOOLEAN DEFAULT FALSE,
  bond_duration INTEGER DEFAULT 0,
  bond_amount INTEGER DEFAULT 0,
  bond_description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  latitude REAL,
  longitude REAL,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'NMC',
  confidence TEXT DEFAULT 'high',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Dental Colleges Table
```sql
CREATE TABLE dental_colleges (
  -- Same structure as medical_colleges
  -- Source defaults to 'DCI'
)
```

### Analytics Tables
```sql
-- Search Analytics
CREATE TABLE search_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  filters TEXT,
  results_count INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- College Views
CREATE TABLE college_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id TEXT NOT NULL,
  college_type TEXT NOT NULL,
  session_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- User Sessions
CREATE TABLE user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  pages_visited TEXT,
  total_searches INTEGER DEFAULT 0
)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install sqlite sqlite3
```

### 2. Create Data Directory
```bash
mkdir -p data
```

### 3. Run Data Migration
```bash
npm run migrate-data
```

### 4. Build the Project
```bash
npm run build
```

## Usage

### Database Service (Server-side)
```javascript
import databaseService from './src/services/database.js'

// Initialize database
await databaseService.initialize()

// Get medical colleges
const colleges = await databaseService.getMedicalColleges({
  state: 'Delhi',
  type: 'Government'
})

// Get statistics
const stats = await databaseService.getStatistics()

// Log analytics
await databaseService.logSearch('AIIMS', {}, 15)
await databaseService.logCollegeView('aiims-delhi', 'medical')
```

### API Service (Client-side)
```javascript
import apiService from './src/services/api.js'

// Get colleges with caching
const colleges = await apiService.getMedicalColleges({
  state: 'Delhi'
})

// Search colleges
const results = await apiService.searchColleges('AIIMS', {
  type: 'medical'
})

// Get college details
const college = await apiService.getCollegeById('aiims-delhi', 'medical')

// Log analytics
await apiService.logSearch('AIIMS', {}, 15)
await apiService.logCollegeView('aiims-delhi', 'medical')
```

## Data Migration

### Automatic Migration
The platform includes sample data that gets automatically populated:

```bash
npm run migrate-data
```

### Custom Data Migration
To migrate your own data:

1. **Prepare CSV Files**:
   - Place CSV files in `data/raw/` directory
   - Follow the expected column structure

2. **Run Processing**:
   ```bash
   npm run process-data
   ```

3. **Run Migration**:
   ```bash
   npm run migrate-data
   ```

### Expected CSV Structure

#### Medical Colleges CSV
```csv
College Name,State,City,Type,Management,University,Recognition Status,Academic Year,MBBS Total Seats,MBBS AIQ Seats,MBBS State Seats,MBBS General,MBBS SC,MBBS ST,MBBS OBC,MBBS EWS,MBBS Govt Fee,MBBS Private Fee,MBBS NRI Fee,Bond Required,Bond Duration,Bond Amount,Bond Description,Address,Phone,Email,Website,Latitude,Longitude
```

#### Dental Colleges CSV
```csv
College Name,State,City,Type,Management,University,Recognition Status,Academic Year,BDS Total Seats,BDS AIQ Seats,BDS State Seats,BDS General,BDS SC,BDS ST,BDS OBC,BDS EWS,BDS Govt Fee,BDS Private Fee,BDS NRI Fee,Bond Required,Bond Duration,Bond Amount,Bond Description,Address,Phone,Email,Website,Latitude,Longitude
```

## API Endpoints (Future)

When you implement a backend API, the following endpoints should be available:

### GET /api/medical-colleges
Query parameters:
- `state`: Filter by state
- `type`: Filter by type (Government/Private)
- `management`: Filter by management
- `search`: Search in name, city, university
- `limit`: Limit results
- `offset`: Pagination offset

### GET /api/dental-colleges
Same parameters as medical colleges

### GET /api/medical-colleges/:id
Get specific medical college by ID

### GET /api/dental-colleges/:id
Get specific dental college by ID

### GET /api/statistics
Get platform statistics

### POST /api/analytics/search
Log search analytics

### POST /api/analytics/view
Log college view analytics

## Caching Strategy

### Client-side Caching
- **Cache Duration**: 5 minutes
- **Cache Keys**: Based on query parameters
- **Cache Invalidation**: Automatic TTL-based expiration

### Cache Management
```javascript
// Clear all cache
apiService.clearCache()

// Get cache statistics
const stats = apiService.getCacheStats()
```

## Fallback System

The platform implements a robust fallback system:

1. **Primary**: Try API/database
2. **Fallback**: Use static JSON data
3. **Error Handling**: Graceful error messages

### Fallback Flow
```
API Request → Database → Static JSON → Error Message
     ↓           ↓           ↓           ↓
   Success    Success    Success    User Notified
```

## Analytics Features

### Search Analytics
- Track search queries
- Monitor filter usage
- Analyze result counts
- User agent tracking

### View Analytics
- College view tracking
- Session-based analytics
- Popular colleges identification

### Performance Metrics
- Response times
- Cache hit rates
- Error rates

## Production Deployment

### Database Options

#### 1. SQLite (Current)
- **Pros**: Simple, no server setup
- **Cons**: Limited concurrent users
- **Best for**: Development, small deployments

#### 2. PostgreSQL (Recommended for Production)
```javascript
// Update database service
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
```

#### 3. MongoDB
```javascript
// Update database service
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
```

### Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/medical_admissions
DATABASE_TYPE=postgresql  # sqlite, postgresql, mongodb

# API Configuration
API_BASE_URL=https://api.medicaladmissions.in
API_TIMEOUT=5000

# Analytics Configuration
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=90
```

## Monitoring and Maintenance

### Database Health Checks
```javascript
// Check database connectivity
const isHealthy = await databaseService.isHealthy()

// Get database statistics
const stats = await databaseService.getStatistics()

// Check table sizes
const tableSizes = await databaseService.getTableSizes()
```

### Backup Strategy
```bash
# SQLite backup
cp data/medical-admissions.db data/backup/$(date +%Y%m%d_%H%M%S).db

# PostgreSQL backup
pg_dump $DATABASE_URL > backup/$(date +%Y%m%d_%H%M%S).sql
```

### Data Validation
```bash
# Validate data integrity
npm run validate-data

# Check for missing data
npm run check-data-completeness
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database file exists
ls -la data/medical-admissions.db

# Check permissions
chmod 644 data/medical-admissions.db

# Recreate database
rm data/medical-admissions.db
npm run migrate-data
```

#### 2. Migration Failed
```bash
# Check CSV file format
head -5 data/raw/medical-colleges.csv

# Check file encoding
file data/raw/medical-colleges.csv

# Re-run migration with verbose logging
DEBUG=* npm run migrate-data
```

#### 3. Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm ls sqlite sqlite3
```

### Performance Optimization

#### 1. Database Indexes
```sql
-- Add indexes for better performance
CREATE INDEX idx_medical_colleges_state ON medical_colleges(state);
CREATE INDEX idx_medical_colleges_type ON medical_colleges(type);
CREATE INDEX idx_medical_colleges_search ON medical_colleges(name, city, university);
```

#### 2. Query Optimization
```javascript
// Use specific filters
const colleges = await databaseService.getMedicalColleges({
  state: 'Delhi',
  limit: 50
})

// Use pagination
const colleges = await databaseService.getMedicalColleges({
  offset: 100,
  limit: 50
})
```

#### 3. Caching Optimization
```javascript
// Increase cache duration for static data
apiService.cacheTimeout = 30 * 60 * 1000 // 30 minutes

// Preload frequently accessed data
await apiService.preloadData()
```

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket integration for live data updates
2. **Advanced Analytics**: Machine learning insights
3. **Data Synchronization**: Multi-source data integration
4. **API Rate Limiting**: Request throttling
5. **Data Export**: CSV/Excel export functionality
6. **Bulk Operations**: Batch data operations
7. **Data Validation**: Automated data quality checks

### Scalability Considerations
1. **Database Sharding**: Horizontal scaling
2. **CDN Integration**: Static asset delivery
3. **Load Balancing**: Multiple server instances
4. **Microservices**: Service decomposition
5. **Caching Layers**: Redis integration

## Support

For database integration support:

1. **Documentation**: Check this guide first
2. **Issues**: Create GitHub issue with details
3. **Community**: Join our Discord/Telegram
4. **Email**: support@medicaladmissions.in

---

**Database Integration Status**: ✅ **Complete**
**Last Updated**: August 2025
**Version**: 1.0.0