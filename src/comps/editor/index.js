import styled from "styled-components"
import React, { useEffect, useRef, useState } from 'react';
import Editor,  { useMonaco } from "@monaco-editor/react";


export const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: block;

  .drag-box {
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 30px;
    top: 0;
    z-index: 12;
  }

  .constraints {
    width: 96vw;
    height: 90vh;
    position: fixed;
    left: 2vw;
    right: 2vw;
    top: 2vw;
    bottom: 2vw;
    pointer-events: none;
  }

  .playground-syntax-error-hover {
    background-color: rgba(238, 67, 30, 0.1);
  }

  .playground-syntax-error-hover-selection {
    background-color: rgba(238, 67, 30, 0.3);
    border-radius: 3px;
    animation: 1s ease-in-out infinite;
  }

  .playground-syntax-warning-hover {
    background-color: rgb(238, 169, 30, 0.1);
  }

  .playground-syntax-warning-hover-selection {
    background-color: rgb(238, 169, 30, 0.3);
    border-radius: 3px;
    animation: 1s ease-in-out infinite;
  }

  .playground-syntax-info-hover {
    background-color: rgb(85, 238, 30, 0.1);
  }

  .playground-syntax-info-hover-selection {
    background-color: rgb(85, 238, 30, 0.3);
    border-radius: 3px;
    animation: 1s ease-in-out infinite;
  }

  .playground-syntax-hint-hover,
  .playground-syntax-unknown-hover {
    background-color: rgb(160, 160, 160, 0.1);
  }

  .playground-syntax-hint-hover-selection,
  .playground-syntax-unknown-hover-selection {
    background-color: rgb(160, 160, 160, 0.3);
    border-radius: 3px;
    animation: 1s ease-in-out infinite;
  }
`;

const noop = () => {}


export function CodeEditor({code = "", onChange = noop, name = "RAWR"}) {
const monaco = useMonaco();
  
  useEffect(() => {
    if (monaco) {

        monaco.editor.defineTheme('cadenceTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'custom-address', foreground: 'ff0000', fontStyle: 'bold' },
            ],
            colors: {
                //'editor.foreground': '#FF0000'
            }
        });
                
    }
  }, [monaco]);
    if (!monaco) return null;
    return (
      <Editor
         height="90vh"
        language="rust"
        theme="cadenceTheme"
        value={code}
        onChange={onChange}
      />
    )
}
