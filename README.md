# How Many Chips

A Next.js website for calculating poker chip distributions for home games, deployed to Netlify.

## Features

- Calculate optimal chip distributions based on number of players and buy-ins
- Support for fractional buy-ins
- Custom chip types and values
- Responsive design that works on mobile and desktop
- Saves preferences in local storage

## Development

This is a [Next.js](https://nextjs.org/) project.

### Getting Started

First, navigate to the Next.js app directory and install dependencies:

```bash
cd next-app
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

## Deployment

This project is configured for deployment on Netlify using the `@netlify/plugin-nextjs` plugin.

To deploy:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically build and deploy the site from the `next-app` directory

## License

ISC License
