import React from 'react';

interface SuggestionButtonsProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ suggestions, onSelect, disabled = false }) => {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="min-h-[40px] rounded-lg border border-white/15 bg-night-3 px-3.5 py-2 text-left text-sm text-snow transition-colors duration-200 hover:border-ion/70 hover:text-ion disabled:cursor-not-allowed disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionButtons;
