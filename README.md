# Control Client

A lightweight Windows client that connects to the Discord AI Bot server via WebSocket to execute PC automation commands. This client captures screenshots and performs keyboard, mouse, and typing actions based on AI-generated instructions.

## Overview

Control Client is the companion application to the Discord AI Bot that runs on Windows machines. It establishes a secure WebSocket connection to the bot's Socket.IO server, listens for commands, captures screenshots when requested, and executes PC control actions such as keyboard shortcuts, mouse clicks, and text input using the nut.js automation library.

## Features

- **Real-time WebSocket Connection**: Secure connection to Discord AI Bot server using Socket.IO
- **Screenshot Capture**: Captures and transmits screen content to the bot for AI analysis
- **Keyboard Control**: Executes single key presses and key combinations
- **Mouse Control**: Performs left and right mouse clicks at specified coordinates
- **Text Input**: Types text strings into the active window
- **Action Delays**: Supports wait/delay actions for precise timing
- **Automatic Reconnection**: Maintains persistent connection with automatic retry logic

## Prerequisites

- **Operating System**: Windows 10+ or Linux
- **Node.js**: Version 18.x LTS or higher
- **Network Access**: Outbound HTTPS connection to bot server (default: port 3000)
- **Discord AI Bot Server**: Must be running and accessible

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/xWalfie-SMR/control-client.git
cd control-client
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to ESLint peer dependency conflicts.

### 3. Configure Server Connection

Edit `src/config.json` to point to your Discord AI Bot server:

```json
{
  "wssServer": "wss://your-server-domain:3000"
}
```

Replace `your-server-domain` with the actual domain or IP address where your Discord AI Bot server is running.

## Usage

### Running the Client

Start the control client:

```bash
npm start
```

The client will:
1. Connect to the configured WebSocket server
2. Wait for incoming commands from the Discord AI Bot
3. Execute actions and return results (screenshots, confirmations)
4. Automatically reconnect if the connection is lost

### Development Mode

For development with automatic restart on file changes:

```bash
npm run dev
```

## Project Structure

```
control-client/
├── packages/                  # Pre-built nut.js packages (local dependencies)
│   ├── nut-tree-configs-4.2.0.tgz
│   ├── nut-tree-default-clipboard-provider-4.2.0.tgz
│   ├── nut-tree-libnut-4.2.0.tgz
│   ├── nut-tree-libnut-linux-2.7.1.tgz
│   ├── nut-tree-nut-js-4.2.0.tgz
│   ├── nut-tree-provider-interfaces-4.2.0.tgz
│   └── nut-tree-shared-4.2.0.tgz
├── src/
│   ├── types/
│   │   └── actions.ts         # Action type definitions
│   ├── config.json            # Server connection configuration
│   └── index.ts               # Main application entry point
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow
├── .husky/                    # Git hooks
│   └── pre-commit             # Pre-commit linting hook
├── .gitattributes             # Git line ending configuration
├── .gitignore                 # Git ignore patterns
├── eslint.config.js           # ESLint configuration
├── LICENSE                    # MIT License
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration (development)
├── tsconfig.build.json        # TypeScript configuration (production build)
└── README.md                  # This file
```

## How It Works

### Connection Flow

1. Client reads `config.json` for server URL
2. Establishes WebSocket connection to Discord AI Bot server
3. Listens for events from the server

### Event Handling

#### `request_screenshot`

Triggered when the AI needs visual context.

**Received Data:**
```json
{
  "userId": "discord-user-id",
  "prompt": "user's command"
}
```

**Actions:**
1. Captures current screen
2. Encodes screenshot as base64 PNG
3. Emits `screenshot_unvalidated` event with data

#### `execute_actions`

Triggered when the AI requests PC control.

**Received Data:**
```json
{
  "userId": "discord-user-id",
  "actions": [
    { "type": "key", "key": "enter" },
    { "type": "click", "button": "left", "x": 100, "y": 200 }
  ]
}
```

**Supported Action Types:**

- **Key Press**: `{ "type": "key", "key": "win" }`
- **Key Combination**: `{ "type": "key_combination", "keys": ["ctrl", "c"] }`
- **Type Text**: `{ "type": "type", "text": "Hello" }`
- **Mouse Click**: `{ "type": "click", "button": "left", "x": 100, "y": 200 }`
- **Wait**: `{ "type": "wait", "ms": 500 }`

## Configuration

### WebSocket Server URL

The `config.json` file contains the server connection details:

```json
{
  "wssServer": "wss://vm.xwalfie.dev:3000"
}
```

**Format:** `wss://[domain-or-ip]:[port]`

- Protocol must be `wss://` (secure WebSocket)
- Domain/IP must match the Discord AI Bot server
- Port must match the Socket.IO server port (default: 3000)

### Firewall Configuration

Ensure outbound connections are allowed to:
- Protocol: HTTPS/WSS
- Port: 3000 (or configured port)
- Destination: Discord AI Bot server address

## Security Considerations

- **Secure Connection**: Uses WSS (WebSocket Secure) over TLS/SSL
- **Server Validation**: Only connects to configured server URL
- **Screenshot Validation**: Server validates screenshot format before processing
- **User Authorization**: Actions are tied to Discord user IDs for tracking
- **Local Execution**: All actions execute locally; no sensitive data transmitted except screenshots

## Built-in Packages

This project includes pre-built nut.js packages in the `packages/` directory to avoid dependency on npm registry subscriptions. These packages are automatically installed when you run `npm install --legacy-peer-deps`.

### Included Packages

- **@nut-tree/nut-js** (4.2.0): Core automation library
- **@nut-tree/libnut** (4.2.0): Native automation provider
- **@nut-tree/libnut-linux** (2.7.1): Linux-specific native bindings (built from source)
- **@nut-tree/default-clipboard-provider** (4.2.0): Clipboard operations
- **@nut-tree/provider-interfaces** (4.2.0): Provider interface definitions
- **@nut-tree/shared** (4.2.0): Shared utilities
- **@nut-tree/configs** (4.2.0): Configuration utilities

The native Linux module (`libnut-linux`) was built from the [nut-tree/libnut-core](https://github.com/nut-tree/libnut-core) repository and is included to ensure compatibility without requiring users to compile from source.

## System Requirements

### Minimum Requirements

- **OS**: Windows 10 (64-bit) or Linux (64-bit)
- **RAM**: 512 MB available
- **CPU**: Any modern processor
- **Network**: Stable internet connection
- **Permissions**: User-level permissions (admin not required for most actions)

### Recommended Requirements

- **OS**: Windows 11 or modern Linux distribution
- **RAM**: 1 GB available
- **Network**: Broadband connection (for fast screenshot transmission)

## Troubleshooting

### Connection Failed

**Symptoms:** Client cannot connect to server

**Solutions:**
- Verify `wssServer` URL in `config.json` is correct
- Ensure Discord AI Bot server is running
- Check firewall allows outbound connections on port 3000
- Confirm SSL certificates on server are valid

### Screenshot Not Captured

**Symptoms:** Screenshot requests fail or timeout

**Solutions:**
- Verify Windows display settings are standard
- Check client has permission to capture screen
- Ensure adequate memory is available
- Try restarting the client

### Actions Not Executing

**Symptoms:** Commands received but not executed

**Solutions:**
- Check console logs for error messages
- Verify action format matches expected schema
- Ensure client has focus/permissions for actions
- Restart client and retry

### Native Module Issues

**Symptoms:** nut.js fails to load or crashes

**Solutions:**
- **Linux**: Ensure X11 libraries are installed (`libx11-dev`, `libxtst-dev` on Ubuntu/Debian)
- **Windows**: Ensure Visual C++ Redistributables are installed
- Try rebuilding native modules: `npm rebuild`
- Check Node.js version is 18.x or higher

## Dependencies

### Production Dependencies

- **@nut-tree/nut-js** (4.2.0): Native system automation library
- **@nut-tree/libnut-linux** (2.7.1): Linux native bindings for PC control
- **screenshot-desktop** (^1.15.3): Screen capture library
- **socket.io-client** (^4.8.3): WebSocket client for real-time communication

### Development Dependencies

- **@eslint/js** (^10.0.1): ESLint core
- **@typescript-eslint/eslint-plugin** (^8.54.0): TypeScript ESLint plugin
- **@typescript-eslint/parser** (^8.54.0): TypeScript ESLint parser
- **@types/node** (^25.1.0): TypeScript definitions for Node.js
- **@types/screenshot-desktop** (^1.15.0): TypeScript definitions for screenshot-desktop
- **eslint** (^9.39.2): JavaScript/TypeScript linter
- **globals** (^17.3.0): Global variables for ESLint
- **husky** (^9.1.7): Git hooks manager
- **lint-staged** (^16.2.7): Run linters on staged files
- **nodemon** (^3.1.11): Development server with auto-restart
- **ts-node** (^10.9.2): TypeScript execution for Node.js
- **tsx** (^4.21.0): TypeScript execution with watch mode
- **typescript** (^5.9.3): TypeScript compiler

## Development

### Building from Source

Compile TypeScript to JavaScript:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Code Standards

- Written in TypeScript for type safety
- ES2020 module syntax
- NodeNext module resolution
- Strict type checking enabled
- ESLint with TypeScript rules
- Pre-commit hooks for automatic linting

### Available Scripts

- **`npm run dev`**: Run in development mode with hot reload
- **`npm run build`**: Build TypeScript to JavaScript
- **`npm start`**: Run the compiled application
- **`npm run lint`**: Check code for linting errors
- **`npm run lint:fix`**: Automatically fix linting errors
- **`npm run typecheck`**: Run TypeScript type checking
- **`npm run validate`**: Run lint, typecheck, and build

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code Guidelines

- Follow existing TypeScript configuration
- Maintain type safety (no `any` types)
- Add comments for complex logic
- Test on Windows 10 and 11

## Roadmap

Future features under consideration:

- [ ] Multi-monitor screenshot support
- [ ] Action queue management
- [ ] Execution confirmation screenshots
- [ ] Custom action macros
- [ ] GUI configuration tool
- [ ] Action recording and playback

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**xWalfie** (Aram Aljundi Alkhouli)

## Links

- **Repository**: https://github.com/xWalfie-SMR/control-client
- **Issues**: https://github.com/xWalfie-SMR/control-client/issues
- **Discord AI Bot**: https://github.com/xWalfie-SMR/discord-ai

## Related Projects

- [Discord AI Bot](https://github.com/xWalfie-SMR/discord-ai) - The companion Discord bot server

## Acknowledgments

- [nut.js](https://github.com/nut-tree/nut.js) - Native UI automation library
- [libnut-core](https://github.com/nut-tree/libnut-core) - Native automation bindings
- [screenshot-desktop](https://github.com/bencevans/screenshot-desktop) - Cross-platform screenshot library
- [Socket.IO](https://socket.io/) - WebSocket communication framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime

## Disclaimer

This software is intended for personal automation and educational purposes. Users are responsible for ensuring compliance with all applicable laws and regulations when using this software. The authors assume no liability for misuse or damages resulting from the use of this software.