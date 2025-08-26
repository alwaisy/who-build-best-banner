# Umami Analytics Usage Guide

This document explains how Umami analytics is configured and used in the OpenSource VR project.

## Overview

Umami is a privacy-focused, open-source web analytics platform that provides insights into website usage without compromising user privacy. This project uses the `nuxt-umami` module for seamless integration.

## Configuration

### 1. Module Installation

The project uses `nuxt-umami` version 3.2.0, which is configured in `package.json`:

```json
{
  "dependencies": {
    "nuxt-umami": "3.2.0"
  }
}
```

### 2. Nuxt Configuration

In `nuxt.config.ts`, Umami is configured as follows:

```typescript
export default defineNuxtConfig({
  modules: [
    // ... other modules
    "nuxt-umami",
  ],
  
  umami: {
    autoTrack: true,      // Automatically track page views
    useDirective: true    // Enable v-umami directive for custom tracking
  },
  
  // ... rest of config
});
```

### 3. Environment Variables

To connect to your Umami instance, you need to set up environment variables. Create a `.env` file in your project root:

```env
# Umami Configuration
NUXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NUXT_PUBLIC_UMAMI_HOST=https://your-umami-instance.com
NUXT_PUBLIC_UMAMI_DOMAINS=your-domain.com
```

## Usage Patterns

### 1. Automatic Page Tracking

With `autoTrack: true`, Umami automatically tracks page views without any additional code. This captures:

- Page visits
- Referrer information
- User agent details
- Session duration

### 2. Custom Event Tracking

The project uses the `v-umami` directive extensively for custom event tracking. Here are the patterns used:

#### Navigation Tracking

```vue
<NuxtLink
  :to="to"
  v-umami="{
    name: 'navbar_navigation',
    link: label,
    destination: to,
    location: 'navbar',
    device: 'desktop',
  }"
>
  {{ label }}
</NuxtLink>
```

#### Footer Link Tracking

```vue
<NuxtLink
  :to="item.to"
  v-umami="{
    name: 'footer_link_click',
    link: item.key,
    section: section.key,
    location: 'footer',
  }"
>
  {{ item.label }}
</NuxtLink>
```

#### Project Card Tracking

```vue
<NuxtLink
  :to="link"
  v-umami="{
    name: 'project_card_click',
    project_title: title,
    category: category,
    stars: stars,
    source: 'homepage',
    link: link,
  }"
>
  <!-- Card content -->
</NuxtLink>
```

#### Theme Toggle Tracking

```vue
<Button
  @click="toggleTheme"
  v-umami="{
    name: 'theme_toggle',
    from: isDark ? 'dark' : 'light',
    to: isDark ? 'light' : 'dark',
    component: 'theme_toggle_button',
  }"
>
  <!-- Button content -->
</Button>
```

#### Form Submission Tracking

```vue
<a
  href="https://tally.so/r/3lGy1o"
  target="_blank"
  v-umami="{
    name: 'project_submission_start',
    page: 'submit',
    source: 'cta_button',
    destination: 'tally_form',
  }"
>
  Submit Your Project
</a>
```

### 3. Programmatic Tracking

The project also uses programmatic tracking in some components:

```javascript
// Track page view
onMounted(() => {
  umTrackView();
  
  // Identify user with custom properties
  umIdentify({
    userType: "contributor",
    experience: "developer",
    platform: "desktop",
    source: "submit_page",
  });
});
```

## Event Categories

The project tracks several categories of events:

### 1. Navigation Events

- `navbar_navigation` - Main navigation clicks
- `footer_link_click` - Footer link interactions

### 2. Content Events

- `project_card_click` - Project card interactions
- `project_submission_start` - Form submission initiation

### 3. UI Events

- `theme_toggle` - Dark/light mode switching

### 4. User Identification

- Custom user properties for segmentation

## Privacy Features

### 1. Developer Mode

The project includes a special plugin (`plugins/itsmebob.client.ts`) that allows developers to disable tracking:

```javascript
// Visit your site with ?itsmebob parameter
// Example: https://yoursite.com?itsmebob
// This disables Umami tracking for that session
```

### 2. GDPR Compliance

Umami is designed to be GDPR compliant by default:

- No cookies required
- No personal data collection
- IP addresses are hashed
- Data is stored locally on your server

## Best Practices

### 1. Event Naming Convention

Use descriptive, consistent event names:

- Use snake_case for event names
- Include context in the name (e.g., `navbar_navigation`)
- Be specific about the action (e.g., `_click`, `_start`, `_toggle`)

### 2. Event Properties

Include relevant context in event properties:

- `location` - Where the event occurred (navbar, footer, etc.)
- `device` - Device type (desktop, mobile)
- `source` - Source of the interaction
- `destination` - Where the user is going

### 3. User Identification

Use `umIdentify()` sparingly and only for non-personal data:

- User type (contributor, visitor)
- Experience level (developer, beginner)
- Platform information
- Source of visit

## Monitoring and Analysis

### 1. Key Metrics to Track

- **Page Views**: Most visited pages
- **Navigation Patterns**: How users move through the site
- **Content Engagement**: Which projects get the most clicks
- **User Behavior**: Theme preferences, device usage
- **Conversion Funnel**: From homepage to project submission

### 2. Custom Dashboards

Create custom dashboards in Umami to track:

- Project card click-through rates
- Navigation usage patterns
- Theme preference distribution
- Form submission conversion rates

## Troubleshooting

### 1. Events Not Tracking

Check that:

- Environment variables are set correctly
- The `v-umami` directive is properly formatted
- The Umami instance is accessible
- No ad blockers are interfering

### 2. Development vs Production

- Use the `?itsmebob` parameter to disable tracking during development
- Test events in production environment
- Verify environment variables are set in production

### 3. Data Privacy

- Ensure your Umami instance is properly secured
- Regularly review collected data
- Implement data retention policies
- Consider user consent mechanisms if required by law

## Advanced Usage

### 1. Custom Event Properties

You can add any custom properties to events:

```vue
<button
  v-umami="{
    name: 'custom_event',
    custom_property: 'value',
    user_segment: 'premium',
    feature_used: 'advanced_search'
  }"
>
  Custom Action
</button>
```

### 2. Conditional Tracking

Track events conditionally based on user state:

```vue
<button
  v-umami="isLoggedIn ? {
    name: 'authenticated_action',
    user_type: 'logged_in'
  } : {
    name: 'anonymous_action',
    user_type: 'anonymous'
  }"
>
  Action Button
</button>
```

### 3. A/B Testing Integration

Use Umami events to track A/B test variants:

```vue
<div
  v-umami="{
    name: 'ab_test_view',
    variant: 'control',
    test_name: 'homepage_layout'
  }"
>
  <!-- A/B test content -->
</div>
```

## Conclusion

Umami analytics provides comprehensive, privacy-focused tracking for the OpenSource VR project. The implementation follows best practices for event tracking, user privacy, and data collection. Regular monitoring of these analytics will help improve user experience and understand how visitors interact with the VR project directory.
