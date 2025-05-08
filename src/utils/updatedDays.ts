


// Sample timestamps (current time and previous days)



// Format a timestamp to a relative date string
export const getRelativeTimeString = (epochSeconds: number) => {
    if (!epochSeconds) return 'Invalid date';

    const timestamp = new Date(epochSeconds * 1000);
    const now = new Date();

    // Reset hours to compare just the dates
    const timestampDate = new Date(timestamp) as any;
    timestampDate.setHours(0, 0, 0, 0);

    const nowDate = new Date(now) as any;
    nowDate.setHours(0, 0, 0, 0);

    // Get the difference in days
    const diffTime = nowDate - timestampDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
};