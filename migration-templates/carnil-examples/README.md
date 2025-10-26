# Carnil SDK Examples

This repository contains example applications demonstrating various use cases and integrations of the Carnil SDK.

## Examples

### 1. Basic Usage (`basic-usage/`)
Minimal example showing basic Carnil SDK integration.

### 2. Next.js App (`nextjs-app/`)
Full-featured Next.js application with Carnil SDK integration.

### 3. React Example (`react-example/`)
React application demonstrating Carnil UI components.

### 4. SaaS Dashboard (`saas-dashboard/`)
Complete SaaS dashboard with payment management, analytics, and more.

## Getting Started

### Install Dependencies

Install dependencies for all examples:

```bash
pnpm install:all
```

Or install for a specific example:

```bash
cd basic-usage
pnpm install
```

### Run Examples

Run any example in development mode:

```bash
# Basic usage
pnpm dev:basic

# Next.js app
pnpm dev:nextjs

# React example
pnpm dev:react

# SaaS dashboard
pnpm dev:saas
```

### Build Examples

Build all examples:

```bash
pnpm build:all
```

Or build a specific example:

```bash
cd nextjs-app
pnpm build
```

## Requirements

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

## Carnil SDK Packages

These examples use the following Carnil SDK packages:

- `@carnil/core` - Core SDK
- `@carnil/stripe` - Stripe integration
- `@carnil/razorpay` - Razorpay integration
- `@carnil/react` - React components
- `@carnil/next` - Next.js integration
- `@carnil/webhooks` - Webhook handling
- `@carnil/analytics` - Analytics dashboard
- `@carnil/pricing-editor` - Pricing model editor
- `@carnil/compliance` - Compliance tools
- `@carnil/globalization` - Internationalization

## Documentation

For detailed documentation, visit [Carnil SDK Documentation](https://github.com/YOUR_ORG/carnil-core).

## License

MIT
