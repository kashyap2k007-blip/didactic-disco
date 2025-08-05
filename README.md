# 🏥 Medical Admissions Platform

A **privacy-first medical admissions platform** for India with complete national database of 1,275+ medical & 318+ dental colleges. Built with React 18, Vite, Tailwind CSS, and advanced search capabilities.

## ✨ Key Features

- **🔍 Advanced Search Engine**
  - Lightning-fast autocomplete with natural language processing
  - Universal search bar accepting any input (college names, courses, states, specializations)
  - Smart query understanding with automatic filter conversion
  - Fuzzy matching for college name variations
  - Keyboard shortcuts (/ for search, Esc to clear)

- **📊 Revolutionary Transparency**
  - Exact AIQ seat counting with precise numbers per college
  - Accurate State quota allocation with real seat distribution
  - Category-wise breakdown (SC/ST/OBC/General/EWS)
  - Competition ratio analysis with applicant-to-seat ratios
  - Historical comparison (2023 vs 2024)

- **🏫 Comprehensive Database**
  - **Medical Education**: 1,275+ MBBS colleges with PG programs (MD/MS/DM/M.Ch)
  - **Dental Education**: 318+ BDS colleges with MDS specializations
  - **Course-level granularity** with every program verified
  - **NMC Recognition Status Intelligence** with automated alerts
  - **Closed Institutions Section** for historical reference

- **📈 Advanced Analytics**
  - Split-screen comparative analysis (2024 vs 2023)
  - Multi-year trend visualization with interactive charts
  - Practical trend insights and cutoff stability indicators
  - Dedicated counselling data sections (AIQ, Karnataka KEA)

- **📱 Progressive Web App (PWA)**
  - Mobile-first responsive design
  - "Add to Home Screen" functionality
  - Offline capability for core data browsing
  - Touch-optimized controls
  - Cross-platform compatibility

- **🛡️ Security & Privacy**
  - Zero tracking philosophy (no analytics, cookies, external monitoring)
  - Local data storage only
  - HTTPS encryption with advanced security headers
  - Indian healthcare compliance (HDMP, Digital Personal Data Protection Act)

## 🛠 Tech Stack

| Layer            | Technology                                    |
|------------------|-----------------------------------------------|
| Frontend         | React 18, Vite, TypeScript                    |
| Styling          | Tailwind CSS, Lucide React Icons             |
| State Management | React Hooks, React Query                     |
| Search           | Fuse.js (fuzzy search)                       |
| Charts           | Chart.js, React-Chartjs-2                    |
| PWA              | Vite PWA Plugin, Workbox                     |
| Routing          | React Router DOM                             |
| Forms            | React Hook Form, Zod validation              |
| Notifications    | React Hot Toast                              |
| SEO              | React Helmet Async                           |

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** for version control

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/medical-admissions-platform.git
cd medical-admissions-platform

# Install dependencies
npm install

# Install additional Tailwind plugins
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# .env
VITE_APP_NAME="Medical Admissions Platform"
VITE_APP_URL="https://medicaladmissions.in"
VITE_API_URL="https://api.medicaladmissions.in"
VITE_GOOGLE_ANALYTICS_ID=""
VITE_SENTRY_DSN=""
NODE_ENV="production"
```

### 3. Data Processing

```bash
# Process college data (generates sample data if CSV files not found)
npm run process-data

# Validate processed data
npm run validate
```

### 4. Development Server

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### 5. Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Cloudflare Pages

1. Build the project: `npm run build`
2. Upload `dist` folder to Cloudflare Pages dashboard

### Option 4: Traditional Web Server

Copy the `dist` folder to your web server and configure:

- **Apache**: Use provided `.htaccess` file
- **Nginx**: Use provided nginx configuration
- **IIS**: Configure URL rewriting rules

## 📁 Project Structure

```
medical-admissions-platform/
├── src/
│   ├── components/           # React components
│   │   ├── Layout.jsx       # Main layout with navigation
│   │   ├── Home.jsx         # Landing page
│   │   ├── Search.jsx       # Advanced search interface
│   │   ├── Analytics.jsx    # Analytics dashboard
│   │   ├── About.jsx        # About page
│   │   ├── Admin.jsx        # Admin panel
│   │   ├── CollegeDetails.jsx # College detail page
│   │   ├── NotFound.jsx     # 404 page
│   │   ├── LoadingSpinner.jsx # Loading component
│   │   └── ErrorBoundary.jsx # Error handling
│   ├── hooks/               # Custom React hooks
│   │   └── useTheme.js      # Theme management
│   ├── data/                # JSON data files
│   │   ├── medicalColleges.json
│   │   ├── dentalColleges.json
│   │   └── statistics.json
│   ├── services/            # API services (future)
│   ├── utils/               # Utility functions
│   ├── styles/              # Additional styles
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── scripts/                 # Build and data processing scripts
│   └── processCollegeData.js
├── public/                  # Static assets
├── dist/                    # Production build output
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vercel.json              # Vercel deployment config
├── netlify.toml             # Netlify deployment config
└── README.md                # This file
```

## 📜 Available Scripts

| Script            | Purpose                                   |
|-------------------|-------------------------------------------|
| `npm run dev`     | Start development server with HMR         |
| `npm run build`   | Create production build                   |
| `npm run preview` | Preview production build locally          |
| `npm run lint`    | Run ESLint for code quality               |
| `npm run lint:fix`| Fix ESLint issues automatically           |
| `npm run process-data` | Convert CSV → JSON, generate statistics |
| `npm run validate`| Validate processed data                   |
| `npm run test`    | Run tests (when implemented)              |
| `npm run deploy`  | Build and deploy to configured platform   |

## 🔧 Configuration

### Tailwind CSS

The project uses a custom medical theme with:
- **Primary Blue**: Trust and professionalism
- **Medical Green**: Success and active states
- **Warning/Alert Colors**: For notifications
- **Error/Danger Colors**: For error states
- **Neutral Grays**: For text and backgrounds

### PWA Configuration

Progressive Web App features:
- **Service Worker**: Offline functionality
- **Manifest**: App installation
- **Icons**: Multiple sizes for different devices
- **Theme Colors**: Consistent branding

### Security Headers

Configured security headers:
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricted permissions

## 📊 Data Management

### Adding New Colleges

1. **CSV Format**: Prepare data in the required CSV format
2. **Validation**: Run `npm run validate` to check data integrity
3. **Processing**: Run `npm run process-data` to convert to JSON
4. **Deployment**: Deploy updated data with the application

### Data Sources

- **NMC**: National Medical Commission data
- **DCI**: Dental Council of India data
- **MCC**: Medical Counselling Committee data
- **State Counselling**: Various state counselling authorities

### Data Validation

The platform includes comprehensive data validation:
- **Required Fields**: Name, state, recognition status
- **Seat Matrix**: AIQ vs State quota validation
- **Fee Structure**: Government vs Private fee validation
- **Bond Requirements**: Service obligation details
- **Contact Information**: Address, phone, email validation

## 🔒 Security Features

- **Input Sanitization**: All user inputs validated and escaped
- **XSS Protection**: Content Security Policy implementation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request throttling
- **HTTPS Enforcement**: Secure communication only
- **Privacy Compliance**: GDPR and Indian data protection laws

## 📱 Mobile Optimization

- **Responsive Design**: Perfect experience on all devices
- **Touch Optimization**: Gesture-friendly navigation
- **Performance**: Sub-2-second loading times
- **Offline Support**: Core functionality without internet
- **PWA Features**: Install like native app

## 🎨 Customization

### Theme Customization

```css
/* Customize colors in tailwind.config.js */
colors: {
  primary: {
    500: '#your-primary-color',
    // ... other shades
  },
  medical: {
    500: '#your-medical-color',
    // ... other shades
  }
}
```

### Component Customization

All components are modular and can be customized:
- **Layout**: Modify navigation and footer
- **Search**: Customize filters and results display
- **Analytics**: Add new chart types and metrics
- **Admin**: Extend admin functionality

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test -- --watch
```

## 📈 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Optimize images
npm install -g imagemin-cli
imagemin src/assets/* --out-dir=dist/assets
```

### Runtime Optimization

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Service worker for static assets
- **Compression**: Gzip compression for all assets

## 🔄 Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Process data
        run: npm run process-data
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **PWA not working**:
   - Check service worker registration
   - Verify manifest.json
   - Test HTTPS requirement

3. **Performance issues**:
   - Run lighthouse audit
   - Check bundle size
   - Optimize images

4. **Data loading issues**:
   - Verify JSON file format
   - Check file paths
   - Validate data structure

## 📞 Support

- **Email**: support@medicaladmissions.in
- **Documentation**: https://docs.medicaladmissions.in
- **Issues**: https://github.com/your-org/medical-admissions-platform/issues
- **Discussions**: https://github.com/your-org/medical-admissions-platform/discussions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NMC**: National Medical Commission for official data
- **DCI**: Dental Council of India for dental college data
- **MCC**: Medical Counselling Committee for counselling data
- **React Team**: For the amazing React framework
- **Vite Team**: For the fast build tool
- **Tailwind CSS**: For the utility-first CSS framework

---

**Made with ❤️ to streamline Indian medical college admissions and empower students with transparent, accurate information.**
