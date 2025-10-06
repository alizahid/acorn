<img src="apps/mobile/assets/artwork/acorn.png" width="128" />

# Acorn

Reddit for mobile

- [Website](https://acorn.blue/)
- [TestFlight](https://testflight.apple.com/join/uKWP3MFB)

## Developing

Acorn is built using React Native, but it's only designed with iOS in mind. And thus, you'll need a Mac to run Acorn locally.

### Prerequisites

This [guide](https://reactnative.dev/docs/set-up-your-environment) should cover the basic setup for React Native development, which includes [Xcode](https://developer.apple.com/xcode), [Node.js](https://nodejs.org), and [Watchman](https://facebook.github.io/watchman).

Then you need these four dependencies;

> You can install EAS CLI using [NPM](https://www.npmjs.com) and the rest using [Homebrew](https://brew.sh).

- [Bun](https://bun.sh)
- [EAS CLI](https://github.com/expo/eas-cli)
- [Fastlane](https://fastlane.tools)
- [CocoaPods](https://cocoapods.org)

And finally, an [Expo](https://expo.dev) account.

#### Installing

Once you download Xcode from App Store, open Terminal and install the rest of the dependencies;

```bash
brew install fastlane cocoapods watchman node oven-sh/bun/bun
npm i -g eas-cli
```

### Environment variables

For development / personal builds, you don't need any environment variables. But since the build scripts expect `.env` files, you can create them by running these commands in the `apps/mobile` directory;

```bash
touch .env.local
touch .env.production.local
```

### Setting up

#### Clone repo

```bash
git clone https://github.com/alizahid/acorn.git
cd acorn
```

#### Install dependencies

```bash
bun i
```

#### Start server

You can either run `bun dev` from the project root, which will spin up both the mobile and web apps.

Or you can navigate to `apps/mobile` and run `bun dev` there, which will only spin up the mobile app.

It's preferred to run `bun dev` from from the project root so we can clear cache before spinning up the apps.

### Building

#### Development

Here's how you can generate a build for simulator while developing;

1. Run `bun build:sim` inside `apps/mobile`
1. EAS Build will generate a compressed archive. Extract `Acorn.app` from it
1. Drag and drop `Acorn.app` into your simulator
1. Run `bun dev` at the root or inside `apps/mobile`
1. Done

#### Production

Building for production (for your own device) is pretty much the same as building for development;

1. Run `bun build:preview` inside `apps/mobile`
1. EAS CLI will guide you through setting up your Expo project and Apple developer account credentials. Make sure to register your devices with Apple through Expo
1. EAS Build will generate a `build.ipa` file
1. You can now AirDrop the `build.ipa` to your devices, or use Xcode to install them
1. Done

### Formatting

Acorn uses Biome to lint and format code.

You can run the following command at the root of your repo to make sure things are how they should be;

```bash
bun lint; bun lint:types
```
