import { format, formatDistance, isAfter, isBefore, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format a date to Spanish locale
 */
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
}

/**
 * Get relative time (e.g., "hace 2 días")
 */
export function getRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es });
}

/**
 * Format currency (MXN or USD)
 */
export function formatCurrency(amount: number, currency: 'MXN' | 'USD' = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as: (XXX) XXX-XXXX for 10 digits
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // Format as: +XX (XXX) XXX-XXXX for international
    if (cleaned.length > 10) {
        const country = cleaned.slice(0, cleaned.length - 10);
        const area = cleaned.slice(-10, -7);
        const first = cleaned.slice(-7, -4);
        const last = cleaned.slice(-4);
        return `+${country} (${area}) ${first}-${last}`;
    }

    return phone;
}

/**
 * Calculate commission splits
 */
export interface CommissionSplit {
    total: number;
    anthony: number;
    gloria: number;
}

export function calculateCommission(
    propertyValue: number,
    commissionPercentage: number,
    splitWithBroker: boolean = false
): CommissionSplit {
    const total = propertyValue * (commissionPercentage / 100);

    if (splitWithBroker) {
        // 50% split with broker first, then 30/70 Anthony/Gloria
        const afterBrokerSplit = total / 2;
        return {
            total: afterBrokerSplit,
            anthony: afterBrokerSplit * 0.30,
            gloria: afterBrokerSplit * 0.70,
        };
    } else {
        // Direct 30/70 split
        return {
            total,
            anthony: total * 0.30,
            gloria: total * 0.70,
        };
    }
}

/**
 * Check if a date is upcoming within X days
 */
export function isUpcoming(date: string | Date, daysAhead: number): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return isAfter(dateObj, new Date()) && isBefore(dateObj, futureDate);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Mexican phone number
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 12; // 10 digits or +52 XXXXXXXXXX
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Class name utility (like clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get days between two dates
 */
export function daysBetween(date1: string | Date, date2: string | Date): number {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Parse CSV data
 */
export function parseCSV(csvText: string): string[][] {
    const lines = csvText.split('\n');
    return lines.map(line => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    });
}

/**
 * Convert array to CSV
 */
export function arrayToCSV(data: any[], headers: string[]): string {
    const rows = [headers.join(',')];

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        rows.push(values.join(','));
    });

    return rows.join('\n');
}

/**
 * Download file client-side
 */
export function downloadFile(content: string, filename: string, type: string = 'text/csv'): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
