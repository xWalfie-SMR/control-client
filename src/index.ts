import { io } from 'socket.io-client';
import { Action } from './types/actions.js';
import { keyboard, mouse, Key, Button } from '@nut-tree/nut-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import config from './config.json' with { type: 'json' };

//
const execAsync = promisify(exec);

// Connect to WebSocket server
const socket = io(config.wssServer);

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    socket.emit('identify', { userId: config.userId });
});

socket.onAny((eventName, ...args) => {
    console.log('Received event:', eventName, args);
});


socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

socket.on('request_screenshot', async (data: { userId: string, prompt: string }) => {
    // Capture screenshot to temp file
    const tempFile = `/tmp/screenshot-${Date.now()}.png`;
    await execAsync(`grim -t png ${tempFile}`);
    const img = await fs.promises.readFile(tempFile);
    await fs.promises.unlink(tempFile);
    const base64 = img.toString('base64');

    // Send the screenshot to the server
    socket.emit('screenshot_unvalidated', {
        userId: data.userId,
        screenshot: `data:image/png;base64,${base64}`,
        prompt: data.prompt,
    });
});

socket.on('execute_actions', async (data: { userId: string, actions: Action[] }) => {
    try {
        for (const action of data.actions) {
            switch (action.type) {
            case 'key':
                await keyboard.pressKey(Key[action.key.charAt(0).toUpperCase() + action.key.slice(1) as keyof typeof Key]);
                await keyboard.releaseKey(Key[action.key.charAt(0).toUpperCase() + action.key.slice(1) as keyof typeof Key]);
                break;
            case 'click':
                await mouse.setPosition({ x: action.x, y: action.y });
                await mouse.click(action.button === 'left' ? Button.LEFT : Button.RIGHT);
                break;
            case 'wait':
                await new Promise(resolve => setTimeout(resolve, action.ms));
                break;
            case 'type':
                await keyboard.type(action.text);
                break;
            case 'key_combination': {
                const keys = action.keys.map(key => Key[key.charAt(0).toUpperCase() + key.slice(1) as keyof typeof Key]);
                for (const key of keys) await keyboard.pressKey(key);
                for (const key of keys.reverse()) await keyboard.releaseKey(key);
                break;
            }
            }
        }
    }
    catch (error) {
        console.error('Error executing actions:', error);
    }
});
