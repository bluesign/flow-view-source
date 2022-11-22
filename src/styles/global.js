import {createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  :root {
      --bg: #232323;
      --fg: #ababab;
      --mute: #787878;
      --wow: #ff00cc;
      --alt: #cc00ff;
      --bad: tomato;
      --good: lime;
      --hi: rgba(66,0,255,0.25);
      --subtle: rgba(255,255,255,0.1);
    }
  }

  ::selection {
    background: var(--fg);
    color: var(--bg);
  }

  html, body {
    border:0;
    margin:0;
    font-family: var(--font-family);
    background: var(--bg);
    color: var(--fg);
  }

  progress {
    -webkit-appearance: none;
    background: var(--fg);
    color: blue;
  }

  label > input {
    margin-right: 0.75em;
  }
`
