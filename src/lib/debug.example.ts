/**
 * Example: How to use the API debugger
 * 
 * This file demonstrates various ways to debug external API calls
 */

import { apiDebugger, debugAPI } from './debug';
import axios from 'axios';

// Example 1: Basic API call with debugging wrapper
export async function exampleAPICall() {
    const result = await apiDebugger.wrapAPICall(
        'ExampleAPI',
        'https://api.example.com/data',
        async () => {
            const response = await axios.get('https://api.example.com/data', {
                params: { key: 'value' }
            });
            return response;
        },
        { key: 'value' } // Parameters for logging
    );

    return result.data;
}

// Example 2: Custom logging
export function exampleLogging() {
    // Information log
    apiDebugger.log('info', 'MyService', 'Processing started');

    // Warning log
    apiDebugger.log('warn', 'MyService', 'Deprecated feature used');

    // Error log
    apiDebugger.log('error', 'MyService', 'Failed to process', {
        reason: 'Invalid input',
        code: 400
    });

    // Quick debug helper
    debugAPI('MyService', 'Checkpoint reached', { state: 'active' });
}

// Example 3: Setting a breakpoint for debugging
export async function debuggableFunction(songName: string) {
    apiDebugger.log('debug', 'SongSearch', 'Starting search', { songName });

    // 🔍 BREAKPOINT: Set a breakpoint on the next line in VS Code
    // When debugging, execution will pause here
    const result = await apiDebugger.wrapAPICall(
        'MusicAPI',
        'https://musicapi.example.com/search',
        async () => {
            // This is where your actual API call goes
            // You can step through this code in the debugger
            const response = await axios.get('https://musicapi.example.com/search', {
                params: { q: songName }
            });
            return response;
        },
        { q: songName }
    );

    return result.data;
}

// Example 4: Error handling with debugging
export async function exampleErrorHandling() {
    try {
        await apiDebugger.wrapAPICall(
            'FailingAPI',
            'https://api.example.com/fail',
            async () => {
                throw new Error('API is down');
            }
        );
    } catch (error) {
        // The error will already be logged by the debugger
        // Handle it appropriately
        apiDebugger.log('info', 'FailingAPI', 'Falling back to cache');
        return { cached: true };
    }
}
