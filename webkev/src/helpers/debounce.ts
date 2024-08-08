export const debounce = <T, U>(
    fn: (...args: T[]) => U,
    bounceMs: number,
): ((...args: T[]) => U) => {
    let called = false;
    return (...args: T[]) => {
        console.log("bouncing", called);
        if (called) {
            console.log("already called");
            return;
        }
        called = true;
        setTimeout(() => {
            console.log("timout", called);
            called = false;
        }, bounceMs);
        console.log("calling!");
        return fn(...args);
    };
};
