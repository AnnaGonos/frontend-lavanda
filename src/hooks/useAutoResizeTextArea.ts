import { useRef, useEffect } from 'react';

export const useAutoResizeTextArea = (value: string, maxHeight: number = 300) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    }, [value, maxHeight]);

    return textareaRef;
};
