import { useMemo, useCallback } from 'react';

/**
 * Performance Optimization Utilities
 * React performance helpers and memoization utilities
 */

// Memoize expensive computations
export const useMemoizedValue = (computation, dependencies) => {
    return useMemo(computation, dependencies);
};

// Memoize callbacks to prevent unnecessary re-renders
export const useMemoizedCallback = (callback, dependencies) => {
    return useCallback(callback, dependencies);
};

// Deep equality check for objects (useful for useMemo dependencies)
export const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
};

// Generate unique ID for list items (stable references)
export const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Lazy load images
export const useLazyImage = (src) => {
    return useMemo(() => {
        const img = new Image();
        img.src = src;
        return src;
    }, [src]);
};

// Batch state updates (useful for multiple setState calls)
export const batchUpdates = (callback) => {
    // React 18+ automatically batches, but this ensures compatibility
    Promise.resolve().then(callback);
};

// Prevent unnecessary re-renders by checking if props changed
export const shouldComponentUpdate = (prevProps, nextProps, keysToCheck = []) => {
    if (keysToCheck.length === 0) {
        return !deepEqual(prevProps, nextProps);
    }

    return keysToCheck.some(key => prevProps[key] !== nextProps[key]);
};

// Performance monitoring helper
export const measurePerformance = (componentName, callback) => {
    const start = performance.now();
    const result = callback();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName}: ${(end - start).toFixed(2)}ms`);
    }

    return result;
};

// Intersection Observer hook for lazy loading components
export const useIntersectionObserver = (ref, options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        observer.observe(ref.current);

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return isIntersecting;
};
