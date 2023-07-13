import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import {styled as mstyled, alpha, createTheme, ThemeProvider} from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import {Link as RouterLink, useHistory} from "react-router-dom"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import React, {useEffect, useState} from "react"
import {AccountAddress, Bar, Icon, Scroll} from "./base"
import Stack from "@mui/material/Stack"
import Card from "@mui/material/Card"
import {useCurrentUser} from "../hooks/use-current-user"
import * as fcl from "@onflow/fcl"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountCircle from "@mui/icons-material/AccountCircle"
import {useTheme} from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import {setCookie} from "react-use-cookie"
import useCookie from 'react-use-cookie';


const Root = mstyled("div")(({theme}) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxHeight: "100vh",
  maxWidth: "100%",
  height: "100%",
  overflow: "clip",
  "a.externalLink": {
    color: theme.palette.text.secondary,
  },
  "a.externalLink:link": {
    textDecoration: "none",
  },
  "a.externalLink:visited": {
    textDecoration: "none",
  },
  "a.externalLink:hover": {
    textDecoration: "underline",
  },
  "a.externalLink:active": {
    textDecoration: "none",
  },
}))

const Search = mstyled("div")(({theme}) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(0),
  marginLeft: 0,
  width: "100%",

}))

const SearchIconWrapper = mstyled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = mstyled(InputBase)(({theme}) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}))

const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const { palette } = createTheme();
const { augmentColor } = palette;


const darkTheme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: RouterLink,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: RouterLink,
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: '0px',
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    background: {default:'#2a2a2a'},
    gray: createColor('#aaaaaa'),
    user: createColor('#eeeeee'),

  },
  typography: {
    fontFamily: "Inter, MonoLisa, JetBrains Mono, Fira Code, monospace",
    button: {
      textTransform: 'none'
    },
  }
});


const lightTheme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: RouterLink,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: RouterLink,
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: '0px',
        }
      }
    }
  },
  palette: {
    mode: 'light',
    background: {default:'#fafafa'},
    gray: createColor('#666666'),
    user: createColor('#eeeeee'),

  },
  typography: {
    fontFamily: "Inter, MonoLisa, JetBrains Mono, Fira Code, monospace",
    button: {
      textTransform: 'none'
    },
  }
})



export function AppBarWithSearch({toggleDrawer, togleDarkMode}) {
  let history = useHistory()
  const user = useCurrentUser()
  const theme = useTheme()
  function goSearch(query) {
    if (query.code === "Enter") {
      history.push("/" + query.target.value)
    }
  }

  return (

    <AppBar>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleDrawer()}
          sx={{minHeight: 32, mr: 0}}>
          <MenuIcon />
        </IconButton>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Transaction ID / Account Address / .find Address "
            inputProps={{"aria-label": "search"}}
            fullWidth={true}
            onKeyDown={goSearch}
          />
        </Search>

        <Bar>
          {user.loggedIn && <AccountAddress address={user.addr} color="user"/>}
          <IconButton
            size="small"
            shape="circle"
            onClick={user.loggedIn?fcl.unauthenticate:fcl.authenticate}
          >
            {user.loggedIn? <LogoutIcon/> : <AccountCircle/> }
          </IconButton>
        </Bar>

        {theme.palette.mode=="light" && <IconButton onClick={togleDarkMode}>
          <Icon icon="solid fa-moon" />
        </IconButton>}

        {theme.palette.mode=="dark" && <IconButton onClick={togleDarkMode}>
          <Icon icon="solid fa-sun" />
        </IconButton>}

      </Toolbar>

    </AppBar>

  )

}


export default function Component({sideContent, children, ...rest}) {
  const [open, setState] = useState(true)
  const [darkMode, setDarkMode] = useCookie("dark", "true")
  const [currentTheme, setCurrentTheme] = useState(darkMode=="true" ? darkTheme : lightTheme)

  useEffect(()=>{
    console.log("darkModeUE:", darkMode)
    const theme =  darkMode.toString()=="true" ? darkTheme : lightTheme;
    if (currentTheme.palette.mode!=theme.palette.mode) {
      console.log(currentTheme.palette.mode)
      console.log(theme.palette.mode)

      setCurrentTheme(theme)
      console.log("theme:", theme.palette.mode)
    }

  }, [darkMode])

  const toggleDrawer = () => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setState(!open)
  }

  const togleDarkMode = ()=>{
    if (darkMode=="true"){
      setDarkMode("false")
    }
    else{
      setDarkMode("true")
    }
    console.log(document.cookie)
   }
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />

      <Root>
      <Toolbar />
      <AppBarWithSearch toggleDrawer={toggleDrawer} togleDarkMode={togleDarkMode} />

      <Stack marginLeft={1} spacing={0} direction="row">
        <Box>
        {open && sideContent}
        </Box>
        <Card variant="elevation" sx={{padding:1, border:1, borderColor: `${currentTheme.palette.mode=="light"?"lightgray":"#555555"}` ,flexGrow: 1, marginTop:2, marginRight:1}}>
          <Scroll>
          {children}
          </Scroll>
        </Card>
      </Stack>

    </Root>
</ThemeProvider>
  )
}

