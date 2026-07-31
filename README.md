# MovieBooking

An Expo (SDK 57) + React Native + TypeScript movie booking app.

## Getting started

```bash
npm install
npm start
```

## Project structure

```
assets/          fonts, icons, images, lottie
src/
  api/           axios instance, endpoints, movie API calls
  components/    common/, movie/, seat/
  constants/     colors, typography, spacing, images, config
  hooks/         data-fetching hooks
  navigation/    root navigator, route names, param types
  screens/       Home, Search, Details, Trailer, Booking
  services/      trailer service
  store/         global state
  theme/         theme tokens
  types/         shared TypeScript types
  utils/         date, helpers, image
  App.tsx        app root
```

## Environment

Copy your keys into `.env` (git-ignored).
