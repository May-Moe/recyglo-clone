# RecyGlo Clone - React Website

A modern, responsive React-based clone of the RecyGlo website, a leading waste management and ESG data analytics platform serving businesses across Asia-Pacific.

## Overview

This project is a complete frontend implementation of the RecyGlo website built with React 19, TypeScript, and Tailwind CSS. It features a professional design with smooth animations, responsive layouts, and comprehensive content sections showcasing waste management and sustainability solutions.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS for a polished, professional appearance
- **Smooth Animations**: Scroll-triggered animations and hover effects for enhanced user experience
- **Multiple Pages**: Home, About, Solutions, Resources, Articles, and Contact pages
- **Service Showcase**: Detailed presentation of 6 core services with descriptions
- **Testimonials**: Auto-rotating carousel featuring client testimonials
- **Blog Section**: Articles and resources grid with category filtering
- **Contact Form**: Functional contact form for customer inquiries
- **SEO Optimized**: Semantic HTML and proper meta tags for search engine optimization

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Server**: Express.js (Node.js)
- **Package Manager**: pnpm

## Project Structure

```
recyglo-clone/
├── client/
│   ├── public/              # Static assets (favicon, robots.txt)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── CompanyValues.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Solutions.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── Articles.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── App.tsx          # Main app component with routing
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles and design tokens
│   └── index.html           # HTML template
├── server/
│   └── index.ts             # Express server configuration
├── Dockerfile               # Docker configuration for GCP
├── cloudbuild.yaml          # Google Cloud Build configuration
├── GCP_DEPLOYMENT.md        # Deployment guide for GCP
├── package.json             # Project dependencies
└── README.md                # This file
```

## Design System

### Color Palette

- **Primary**: Deep Forest Green (#1B5E20) - Trust and environmental commitment
- **Secondary**: Warm Earth Tone (#D4A574) - Approachability
- **Accent**: Vibrant Lime Green (#76FF03) - CTAs and highlights
- **Background**: Off-white (#F8F9F7) - Clean, professional
- **Text**: Dark Charcoal (#2C3E50) - High readability

### Typography

- **Display Font**: Poppins Bold (700) - Headlines and emphasis
- **Body Font**: Inter Regular (400) - Body text and descriptions
- **Line Heights**: 1.6 for body text, 1.2 for headlines

### Component Spacing

The design uses a consistent spacing system based on Tailwind's default scale with custom container padding for responsive layouts.

## Getting Started

### Prerequisites

- Node.js 22 or higher
- pnpm 10.4.1 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd recyglo-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm preview` - Preview production build
- `pnpm check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## Deployment

### GCP Cloud Run (Recommended)

The project includes Docker configuration and Cloud Build setup for easy deployment to Google Cloud Run.

1. Set up GCP project and enable required APIs
2. Build and push Docker image:
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/recyglo-clone
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy recyglo-clone \
  --image gcr.io/$PROJECT_ID/recyglo-clone \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

For detailed deployment instructions, see [GCP_DEPLOYMENT.md](./GCP_DEPLOYMENT.md)

### Other Deployment Options

- **Firebase Hosting**: For static-only deployment
- **Compute Engine**: For more control over the infrastructure
- **App Engine**: For automatic scaling and management

## Pages and Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with hero, services, testimonials, and blog |
| `/about` | About | Company information, mission, vision, and team |
| `/solutions` | Solutions | Detailed service offerings and implementation process |
| `/resources` | Resources | Tools, guides, and FAQs |
| `/articles` | Articles | Blog posts and articles listing |
| `/contact` | Contact | Contact form and business information |

## Key Components

### Header
Responsive navigation with mobile menu toggle, language selector, and contact CTA button.

### Hero
Full-width hero section with background image, headline, subtitle, and call-to-action buttons.

### Services
Grid layout showcasing 6 main service offerings with icons and descriptions.

### Testimonials
Auto-rotating carousel displaying client testimonials with navigation controls.

### CompanyValues
Three-column layout presenting Mission, Vision, and Goal statements.

### BlogSection
Featured articles grid with category badges and read more links.

### Footer
Comprehensive footer with navigation links, services, locations, contact info, and social links.

## Customization

### Updating Colors

Edit the color variables in `client/src/index.css`:

```css
:root {
  --primary: #1B5E20;
  --accent: #76FF03;
  /* ... other colors ... */
}
```

### Adding New Pages

1. Create a new component in `client/src/pages/`
2. Add the route in `client/src/App.tsx`
3. Update navigation links in `client/src/components/Header.tsx`

### Modifying Content

Content is hardcoded in components. To update:
1. Edit the relevant component file
2. Update arrays or text directly in the component
3. For dynamic content, consider adding a CMS integration

## Performance Optimization

- Images are optimized and served from cloud storage
- Lazy loading for images and components
- Code splitting via Vite
- CSS minification and tree-shaking
- Responsive images with appropriate sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance
- Focus indicators for interactive elements

## Security

- Content Security Policy headers
- No sensitive data in frontend code
- Environment variables for configuration
- HTTPS enforced in production

## Environment Variables

Create a `.env.production` file for production configuration:

```env
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=RecyGlo
```

## Troubleshooting

### Development Server Issues

If the dev server won't start:
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Build Errors

Check for TypeScript errors:
```bash
pnpm check
```

### Styling Issues

Clear Tailwind cache:
```bash
rm -rf .next node_modules/.cache
pnpm build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is a clone for educational and demonstration purposes.

## Support

For issues or questions:
1. Check the [GCP_DEPLOYMENT.md](./GCP_DEPLOYMENT.md) for deployment help
2. Review component documentation in code comments
3. Check Tailwind and React documentation

## Future Enhancements

- Add backend API integration
- Implement database for dynamic content
- Add user authentication
- Create admin dashboard
- Implement real contact form submission
- Add multi-language support
- Integrate with analytics platforms
- Add PWA capabilities

## Changelog

### Version 1.0.0 (Initial Release)
- Complete React implementation of RecyGlo website
- All main pages and components
- Responsive design
- GCP deployment configuration
- Docker support

---

**Last Updated**: April 2026
**Version**: 1.0.0
