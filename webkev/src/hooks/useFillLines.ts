import { useEffect, useState, useRef, MutableRef } from "preact/hooks";
import { createElement, VNode } from "preact";

export const useFillLines = (): [MutableRef<HTMLDivElement>, VNode[]] => {
    const [lineCount, setLineCount] = useState(0);
    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        const height = ref.current.offsetHeight;
        setLineCount(height / 22);
    }, []);
    const lines: VNode[] = [];
    for (let i = 0; i < lineCount; i++) {
        lines.push(createElement("span", {}));
    }

    return [ref, lines];
};
