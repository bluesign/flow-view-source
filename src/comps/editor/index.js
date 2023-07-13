import React, { useEffect } from 'react';
import Editor,  { useMonaco } from "@monaco-editor/react";
import SyntaxHighlighter, { createElement } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import configureCadence from "./cadence"
import {useTheme} from "@mui/material"
import {a11yLight} from "react-syntax-highlighter/src/styles/hljs"

function setEditorReadOnly(readOnly) {
  return (editor, monaco)=>{
    editor.updateOptions({ readOnly: readOnly })
    editor.updateOptions({ scrollBeyondLastLine: false });
  }
}

export default function CodeEditor({prefix="", type="", index=0, code = "", onChange = null, name = "RAWR", lang="rust" }) {
  const monaco  = useMonaco();
  const theme = useTheme();

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
    const highlighterTheme = theme.palette.mode == "dark" ? vs2015:a11yLight

    return (

      <SyntaxHighlighter 
          language={lang} 
          style={highlighterTheme}
          customStyle={{
            overflow: "visible",
            fontSize:"14px",
            margin: 0,
            padding: 1,
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
  var monacoTheme = theme.palette.mode == "dark" ? "vs-dark":"vs-light"

  return (
    <Editor
      height="90vh"
      language="cadence"
      theme={monacoTheme}
      value={code}
      onChange={onChange}
      onMount={onChange?setEditorReadOnly(false):setEditorReadOnly(true)}
    />
  )
}
