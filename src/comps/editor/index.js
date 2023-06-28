import React, { useEffect } from 'react';
import Editor,  { useMonaco } from "@monaco-editor/react";
import SyntaxHighlighter, { createElement } from 'react-syntax-highlighter';
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
 
  const isObject = obj => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
  }
  if (prefix!==""){
    if (!isObject(code)){
     // code = [code]
    }
    //code =  JSON.stringify(code,  null, 2).split("\n").map(line=>line.substring(2)).slice(1).join("\n")
    //code =  JSON.stringify(code,  null, 2)

    const YAML = require('json-to-pretty-yaml');
    code = YAML.stringify(code);
    lang="yaml"
    if (code.split("\n")[0].trim()===""){
      code = code.split("\n").slice(1).join("\n")
    }
    
  }
  useEffect(() => {
      if (!monaco) return
      configureCadence(monaco)

  }, [monaco]);

  function checkNodes(parent, node){
    
    if (node.children) {
      node.children = node.children.map(child=>{
        child = checkNodes(node, child)
        return child
      })
    }
    else{
      var address  = node.value.match(/(0x)[0-9a-f]{12,16}/g)
      if (address){
        node.value = node.value.replace("\""+address[0]+"\"", address[0])
        parent.tagName = "a" 
        parent.properties.href = `/${address}`
        parent.properties.title = `Check account - ${address}`
      }
      
     /* var contractEvent  = node.value.match(/A\.[0-9a-f]{12,16}\.(.*?)\.(.*?)/g)
      if (contractEvent){
        console.log(contractEvent)
      }
*/
    }

    return node
  }
  if (lang!=="cadence"){
      return (
      <SyntaxHighlighter 
          language={lang} 
          style={vs2015}
          customStyle={{
            fontSize:"14px",
            margin:0,
            padding:0,
            fontFamily: "MonoLisa,JetBrains Mono,Fira Code,monospace",
            backgroundColor:"transparent"
          }}
          renderer={({rows, stylesheet, useInlineStyles})=>{
            return(
              <>
                {rows.map(node=>{
                  node = checkNodes(node, node)
                  const {style, key} = node
               
                  return createElement({
                    node,
                    stylesheet,
                    style,
                    useInlineStyles,
                    key
                  })
                })}
              </>
            )
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
