import React, { useEffect } from 'react';
import Editor,  { useMonaco } from "@monaco-editor/react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import configureCadence from "./cadence"

function setEditorReadOnly(readOnly) {
  return (editor, monaco)=>{
    editor.updateOptions({ readOnly: readOnly })
    editor.updateOptions({ scrollBeyondLastLine: false });
  }
}

export default function CodeEditor({prefix="", type="", index=0, code = "", onChange = null, name = "RAWR", lang="rust" }) {
  const monaco  = useMonaco();

  if (prefix!==""){
    code = prefix + " - "  + JSON.stringify(code,  null, 4)
  }
  useEffect(() => {
      if (!monaco) return
      configureCadence(monaco)

  }, [monaco]);

  if (lang!=="cadence"){
      return (
      <SyntaxHighlighter 
          language={lang} 
          style={vs2015}
          customStyle={{
            fontSize:"0.8em", 
            backgroundColor:"transparent"
          }}
      >
      {code}
      </SyntaxHighlighter>
      )
  }

  if (!monaco) return null;

  return (
    <Editor
      height="90vh"
      language="cadence"
      theme="vs-dark"
      value={code}
      onChange={onChange}
      onMount={onChange?setEditorReadOnly(false):setEditorReadOnly(true)}
    />
  )
}
