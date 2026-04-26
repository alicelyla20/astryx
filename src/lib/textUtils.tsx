import React from "react";

/**
 * Parses plain text containing URLs and replaces them with <a> tags.
 * It also preserves line breaks using <br /> elements.
 */
export function parseTextWithLinks(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match http or https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // If this part is a URL
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors"
        >
          {part}
        </a>
      );
    }
    
    // Otherwise, it's normal text containing possible line breaks
    return (
      <span key={index}>
        {part.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i !== part.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    );
  });
}
