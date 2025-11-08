import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import App from './App';

// Custom Single-SPA React 18 implementation
let root: Root | null = null;

export async function bootstrap() {
  console.log('React MFE bootstrapping...');
  return Promise.resolve();
}

export async function mount(props: any) {
  console.log('React MFE mounting...', props);
  console.log('Available DOM elements:', Array.from(document.querySelectorAll('[id*="single-spa"]')).map(el => el.id));
  
  // Handle domElement as function or direct element
  let domElement;
  if (props.domElement) {
    console.log('Using props.domElement (function):', typeof props.domElement);
    domElement = typeof props.domElement === 'function' ? props.domElement() : props.domElement;
    console.log('Resolved domElement from props:', domElement);
  } else {
    console.log('Fallback: looking for single-spa-application:react-mfe');
    domElement = document.getElementById('single-spa-application:react-mfe');
    console.log('Found by ID:', domElement);
  }
  
  console.log('Final DOM element:', domElement, 'Type:', typeof domElement);
  
  if (!domElement) {
    console.error('Available elements:', document.querySelectorAll('*[id]'));
    throw new Error(`Dom element not found for React MFE. Checked: ${props.domElement ? 'props.domElement' : 'single-spa-application:react-mfe'}`);
  }
  
  // Create React 18 root
  root = createRoot(domElement);
  root.render(<App {...props} />);
  
  return Promise.resolve();
}

export async function unmount() {
  console.log('React MFE unmounting...');
  
  if (root) {
    root.unmount();
    root = null;
  }
  
  return Promise.resolve();
}
