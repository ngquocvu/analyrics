/**
 * Debug utilities for external API calls
 * Enhanced logging and debugging support for YouTube, Spotify, and other APIs
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface APIDebugOptions {
    serviceName: string;
    endpoint: string;
    params?: Record<string, any>;
    headers?: Record<string, any>;
}

interface APIResponseDebug {
    status: number;
    data?: any;
    error?: any;
    duration: number;
}

class APIDebugger {
    private isDebugMode: boolean;

    constructor() {
        this.isDebugMode = process.env.NODE_ENV === 'development' ||
            process.env.NEXT_PUBLIC_DEBUG_API === 'true';
    }

    /**
     * Log API request details
     */
    logRequest(options: APIDebugOptions): number {
        const timestamp = Date.now();

        if (this.isDebugMode) {
            console.group(`🔵 [${options.serviceName}] API Request`);
            console.log('📍 Endpoint:', options.endpoint);
            if (options.params) {
                console.log('📋 Params:', this.sanitizeSecrets(options.params));
            }
            if (options.headers) {
                console.log('📝 Headers:', this.sanitizeSecrets(options.headers));
            }
            console.log('⏰ Time:', new Date().toISOString());
            console.groupEnd();
        }

        return timestamp;
    }

    /**
     * Log API response details
     */
    logResponse(
        serviceName: string,
        startTime: number,
        response: APIResponseDebug
    ): void {
        const duration = Date.now() - startTime;

        if (this.isDebugMode) {
            const emoji = response.error ? '🔴' : '🟢';
            console.group(`${emoji} [${serviceName}] API Response (${duration}ms)`);
            console.log('📊 Status:', response.status);

            if (response.data) {
                console.log('📦 Data:', response.data);
            }

            if (response.error) {
                console.error('❌ Error:', response.error);
            }

            console.log('⏱️ Duration:', `${duration}ms`);
            console.groupEnd();
        }
    }

    /**
     * Create a breakpoint-friendly wrapper for API calls
     */
    async wrapAPICall<T>(
        serviceName: string,
        endpoint: string,
        callFn: () => Promise<T>,
        params?: Record<string, any>
    ): Promise<T> {
        const startTime = this.logRequest({ serviceName, endpoint, params });

        try {
            // 🔍 DEBUGGER BREAKPOINT: Step through external API calls here
            const result = await callFn();

            this.logResponse(serviceName, startTime, {
                status: 200,
                data: result,
                duration: Date.now() - startTime
            });

            return result;
        } catch (error: any) {
            this.logResponse(serviceName, startTime, {
                status: error.response?.status || 500,
                error: error.message || error,
                duration: Date.now() - startTime
            });

            throw error;
        }
    }

    /**
     * Remove sensitive data from logs
     */
    private sanitizeSecrets(obj: Record<string, any>): Record<string, any> {
        const sensitiveKeys = ['key', 'token', 'secret', 'password', 'api_key', 'apikey'];
        const sanitized = { ...obj };

        Object.keys(sanitized).forEach(key => {
            if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
                const value = String(sanitized[key]);
                sanitized[key] = value.length > 8
                    ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
                    : '***';
            }
        });

        return sanitized;
    }

    /**
     * Custom log method with styling
     */
    log(level: LogLevel, service: string, message: string, data?: any): void {
        if (!this.isDebugMode && level !== 'error') return;

        const icons = {
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            debug: '🐛'
        };

        const prefix = `${icons[level]} [${service}]`;

        switch (level) {
            case 'error':
                console.error(prefix, message, data || '');
                break;
            case 'warn':
                console.warn(prefix, message, data || '');
                break;
            default:
                console.log(prefix, message, data || '');
        }
    }
}

// Export singleton instance
export const apiDebugger = new APIDebugger();

// Helper function for quick debugging
export const debugAPI = (service: string, message: string, data?: any) => {
    apiDebugger.log('debug', service, message, data);
};
