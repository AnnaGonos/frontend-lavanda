import React from 'react';
import { useAutoResizeTextArea } from '../../hooks/useAutoResizeTextArea';

interface Props {
    id: string;
    label?: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    maxLength?: number;
    placeholder?: string;
}

export const AutoResizeTextarea: React.FC<Props> = ({
                                                        id,
                                                        label,
                                                        value,
                                                        onChange,
                                                        maxLength = 254,
                                                        placeholder,
                                                    }) => {
    const displayValue = value ?? '';
    const textareaRef = useAutoResizeTextArea(displayValue);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= maxLength) {
            onChange(e);
        }
    };

    return (
        <div className={label && ("form__group")}>
            {label && (
                <label htmlFor={id} className="form__label">
                    {label}
                </label>
            )}

            <div className="form__textarea">
                <textarea
                    id={id}
                    ref={textareaRef}
                    className="form__control"
                    value={displayValue}
                    onChange={handleChange}
                    maxLength={maxLength}
                    placeholder={placeholder}
                />
                <p className="form__counter">
                    {displayValue.length}/{maxLength}
                </p>
            </div>
        </div>
    );
};
