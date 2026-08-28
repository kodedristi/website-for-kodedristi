# Kodedristi Software - Next.js React App

A modern, fully-responsive enterprise software architecture showcase built with **Next.js**, **React**, **Framer Motion**, and **GSAP**. Features smooth animations, loading effects, and a sophisticated design system.

## 🎨 Features

- **Multi-Page Application**: 6 fully-built pages with seamless navigation
- **Advanced Animations**: Framer Motion + GSAP for smooth, professional interactions
- **Loading Effects**: Custom page loader with spinning animation
- **Responsive Design**: Mobile-first, optimized for all screen sizes
- **Design System**: Tailwind CSS with custom color palette (30+ colors)
- **Component Architecture**: Reusable components for Navigation, Footer, Sidebar
- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS v4

## 📁 Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with design system
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Home page
│   ├── team/
│   │   └── page.tsx            # Team page
│   ├── portfolio/
│   │   └── page.tsx            # Portfolio page
│   ├── insights/
│   │   └── page.tsx            # Blog/Insights page
│   ├── contact/
│   │   └── page.tsx            # Contact form page
│   └── careers/
│       └── page.tsx            # Careers/Jobs page
├── components/
│   ├── Navigation.tsx          # Top nav + mobile menu
│   ├── Sidebar.tsx             # Left social sidebar
│   ├── Footer.tsx              # Footer component
│   ├── PageLoader.tsx          # Animated page loader
│   └── pages/
│       ├── Home.tsx            # Home page content
│       ├── Team.tsx            # Team page content
│       ├── Portfolio.tsx       # Portfolio page content
│       ├── Insights.tsx        # Insights/blog page
│       ├── Contact.tsx         # Contact form
│       └── Careers.tsx         # Careers/jobs listing
├── tailwind.config.ts          # Tailwind + design system colors
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Recommended: 20+)
- npm, yarn, or pnpm

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎭 Pages Overview

### Home (`/`)
- Hero section with gradient text
- 4 service cards with hover effects
- Methodology section with 3 steps
- Smooth animations with staggered delays

### Team (`/team`)
- Hero introduction
- 6-member team grid with grayscale hover effect
- "Join the team" CTA card
- Philosophy section with values
- Animated number counters

### Portfolio (`/portfolio`)
- Large featured projects grid
- Asymmetrical card layout
- 5 diverse project showcases
- CTA section at bottom

### Insights (`/insights`)
- Blog article cards with images
- Category tags and dates
- Hover animations
- Newsletter subscription form
- Gradient CTA buttons

### Contact (`/contact`)
- Split layout: addresses + form
- 3 office locations
- Elegant form inputs
- Decorative images with grayscale hover
- Form state management

### Careers (`/careers`)
- Job listings grid (5 positions)
- Department badges
- "Build your own role" card
- Company perks section
- Retention stats showcase

## 🎬 Animation Features

### Framer Motion
- **Page transitions**: Smooth fade-in animations
- **Container variants**: Staggered item animations
- **Interactive elements**: Hover effects with scale/y transform
- **Navigation menu**: Spring animation drawer
- **Image hover**: Scale + grayscale transitions

### GSAP
- **Page loader**: Rotating spinner with GSAP
- **Custom timing**: Advanced easing functions
- **Performance**: GPU-accelerated animations

### Loading Effects
- Custom animated loader on page load
- 2-second display duration
- Logo fade-in animation
- Smooth exit transition

## 🎨 Design System

### Colors (30+ Custom Colors)
- **Primary**: `#28147c` (Deep Purple)
- **Secondary**: `#006d3f` (Forest Green)
- **Surface Colors**: Light grays (#f8f9fa)
- **Tertiary**: `#00321b` (Dark Green)

### Typography
- **Font**: Manrope (Google Fonts)
- **Weights**: 200, 300, 400, 500, 600, 700, 800
- **Applied globally** via Tailwind variable

### Border Radius
- Default: 0.25rem
- lg: 0.5rem
- xl: 1.5rem
- full: 9999px

## 📱 Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `md:` (640px - 1024px)
- **Desktop**: `lg:` (1024px+)

## 🔧 Key Dependencies

```json
{
  "next": "16.2.0",
  "react": "^19",
  "framer-motion": "^11.0.8",
  "gsap": "^3.12.2",
  "tailwindcss": "^4.2.0"
}
```

## 💡 Component Usage Examples

### Navigation with Menu
```tsx
<Navigation />  // Top nav + mobile drawer menu
```

### Sidebar with Social Links
```tsx
<Sidebar />     // Left fixed sidebar
```

### Page Loader
```tsx
<PageLoader />  // Auto-hides after 2 seconds
```

### Animated Container
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  Content here
</motion.div>
```

## 🎯 Best Practices Used

✅ **Client-side rendering** with 'use client' for interactive components
✅ **Reusable component architecture** to avoid duplication
✅ **Responsive design** - mobile-first approach
✅ **Performance optimized** - image lazy loading, CSS-in-JS
✅ **Accessibility** - semantic HTML, ARIA labels
✅ **Type safety** - Full TypeScript support
✅ **Modern animations** - Framer Motion best practices
✅ **Clean code** - Modular, well-organized structure

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# or use Vercel CLI:
vercel
```

### Deploy to Other Platforms

Build the project:
```bash
pnpm build
```

The `.next` folder contains the optimized build ready for deployment.

## 📝 Customization

### Change Colors
Edit `/tailwind.config.ts`:
```ts
colors: {
  'primary': '#YourColor',
  'secondary': '#YourColor',
  // ... update color palette
}
```

### Add New Pages
1. Create `/app/your-page/page.tsx`
2. Create component in `/components/pages/YourPage.tsx`
3. Add link to `Navigation.tsx`

### Modify Animations
Update variant configs in page components:
```tsx
const containerVariants = {
  // Customize timing and effects
  hidden: { opacity: 0, y: 20 },
  visible: { ... }
}
```

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
lsof -i :3000
kill -9 <PID>
# or use a different port:
PORT=3001 pnpm dev
```

**Styles not applying?**
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

**Animations not smooth?**
- Check browser hardware acceleration is enabled
- Verify no console errors
- Test in Chrome DevTools Performance tab

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP Docs](https://gsap.com/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 📄 License

This project is created with v0.app and is available for use.

---

**Built with ❤️ using Next.js, React, Framer Motion, and GSAP**
