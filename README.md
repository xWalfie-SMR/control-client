# Control Client

A lightweight Windows client that connects to the Discord AI Bot server via WebSocket to execute PC automation commands. This client captures screenshots and performs keyboard, mouse, and typing actions based on AI-generated instructions.

## Overview

Control Client is the companion application to the Discord AI Bot that runs on Windows machines. It establishes a secure WebSocket connection to the bot's Socket.IO server, listens for commands, captures screenshots when requested, and executes PC control actions such as keyboard shortcuts, mouse clicks, and text input.

## Features

- **Real-time WebSocket Connection**: Secure connection to Discord AI Bot server using Socket.IO
- **Screenshot Capture**: Captures and transmits screen content to the bot for AI analysis
- **Keyboard Control**: Executes single key presses and key combinations
- **Mouse Control**: Performs left and right mouse clicks at specified coordinates
- **Text Input**: Types text strings into the active window
- **Action Delays**: Supports wait/delay actions for precise timing
- **Automatic Reconnection**: Maintains persistent connection with automatic retry logic

## Prerequisites

- **Operating System**: Windows 10 or higher
- **Node.js**: Version 18.x or higher
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
npm install
```

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
├── src/
│   └── config.json            # Server connection configuration
├── .gitattributes             # Git line ending configuration
├── .gitignore                 # Git ignore patterns
├── LICENSE                    # MIT License
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
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

## System Requirements

### Minimum Requirements

- **OS**: Windows 10 (64-bit)
- **RAM**: 512 MB available
- **CPU**: Any modern processor
- **Network**: Stable internet connection
- **Permissions**: User-level permissions (admin not required for most actions)

### Recommended Requirements

- **OS**: Windows 11 (64-bit)
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

## Dependencies

### Production Dependencies

- **socket.io-client** (^4.8.3): WebSocket client for real-time communication

### Development Dependencies

- **@types/node** (^25.1.0): TypeScript definitions for Node.js
- **nodemon** (^3.1.11): Development server with auto-restart
- **ts-node** (^10.9.2): TypeScript execution for Node.js
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
- [ ] Cross-platform support (macOS, Linux)
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

- [Socket.IO](https://socket.io/) - WebSocket communication framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime

## Disclaimer

This software is intended for personal automation and educational purposes. Users are responsible for ensuring compliance with all applicable laws and regulations when using this software. The authors assume no liability for misuse or damages resulting from the use of this software.