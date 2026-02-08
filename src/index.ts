import { io } from 'socket.io-client';
import { Action } from './types/actions.js';
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
	console.log('Executing actions:', JSON.stringify(data.actions, null, 2));
	try {
		for (const action of data.actions) {
			switch (action.type) {
			case 'key':
				await execAsync(`wtype -k "${action.key}"`);
				break;
			case 'click':
				await execAsync(`hyprctl dispatch cursorpos ${action.x} ${action.y}`);
				await execAsync(`hyprctl dispatch click ${action.button === 'left' ? '1' : '3'}`);
				break;
			case 'wait':
				await new Promise(resolve => setTimeout(resolve, action.ms));
				break;
			case 'type':
				await execAsync(`wtype "${action.text.replace(/"/g, '\\"')}"`);
				break;
			case 'key_combination':
				await execAsync(`wtype -k "${action.keys.join('+')}"`);
				break;
			}
		}
	}
	catch (error) {
		console.error('Error executing actions:', error);
	}
});
