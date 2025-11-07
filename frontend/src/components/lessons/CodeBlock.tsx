import React from 'react';

type CodeBlockProps = {
  tag: string; // Tag like <html>, <head>, <body>, etc.
  onClick: (tag: string) => void; // Callback when a block is clicked/tapped
  doctypeAdded: boolean; // Whether DOCTYPE has been added to show description
  htmlAdded: boolean;
  headAdded: boolean;
  bodyAdded: boolean;
  headingsAdded?: boolean; // Make optional
  paragraphsAdded?: boolean; // Make optional
  linksAdded?: boolean; // Make optional
  imagesAdded?: boolean; // Make optional
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  tag,
  onClick,
  doctypeAdded,
  htmlAdded,
  headAdded,
  bodyAdded,
  headingsAdded,
  paragraphsAdded,
  linksAdded,
  imagesAdded
}) => {
  // For HTMLelements, handle additional cases
  if (tag === 'headings' && !headingsAdded) {
    return (
      <div
        className="code-block"
        onClick={() => onClick(tag)}
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          margin: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <span>{`<h1>, <h2>, <h3>`}</span>
      </div>
    );
  }

  if (tag === 'paragraphs' && !paragraphsAdded) {
    return (
      <div
        className="code-block"
        onClick={() => onClick(tag)}
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          margin: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <span>{`<p>`}</span>
      </div>
    );
  }

  if (tag === 'links' && !linksAdded) {
    return (
      <div
        className="code-block"
        onClick={() => onClick(tag)}
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          margin: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <span>{`<a>`}</span>
      </div>
    );
  }

  if (tag === 'images' && !imagesAdded) {
    return (
      <div
        className="code-block"
        onClick={() => onClick(tag)}
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          margin: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#f8f8f8',
        }}
      >
        <span>{`<img>`}</span>
      </div>
    );
  }

  // Original code for handling DOCTYPE, html, head, body for HTMLdocument
  return (
    <div
      className="code-block"
      onClick={() => onClick(tag)}
      style={{
        border: '1px solid #ddd',
        padding: '10px',
        margin: '5px',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: '#f8f8f8', // Light background for the block
      }}
    >
      {tag === 'DOCTYPE' && !doctypeAdded ? (
        <span>{`<!DOCTYPE html>`}</span>
      ) : tag === 'html' && !htmlAdded ? (
        <span>{`<html>`}</span>
      ) : tag === 'head' && !headAdded ? (
        <span>{`<head>`}</span>
      ) : tag === 'body' && !bodyAdded ? (
        <span>{`<body>`}</span>
      ) : (
        <span>{`<${tag}>`}</span> // Show the tag if added
      )}
    </div>
  );
};

export default CodeBlock;
