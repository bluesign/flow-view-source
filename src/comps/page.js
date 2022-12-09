import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled as mstyled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import styled from "styled-components"
import CurrentUser from "./currentUser"
import { useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";


const Root = styled.div`
  background: var(--bg);
  color: var(--fg);
  display: flex;
`

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  max-width: 100%;
`

const Search = mstyled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: '100%',
   
  }));
  
  const SearchIconWrapper = mstyled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = mstyled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      
    },
  }));
  
  export function AppBarWithSearch({toggleDrawer}) {
    let history = useHistory();

    function goSearch(query){
      if (query.code==="Enter"){
        history.push("/" +  query.target.value)
      } 
    }

    return (
      <AppBar >
        <Toolbar>
<IconButton 
            edge="start"
            color="inherit"
            onClick={toggleDrawer()}
            sx={{minHeight:32, mr: 0}}>   
    <MenuIcon />
          </IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="TransactionId / Account Address "
              inputProps={{ 'aria-label': 'search' }}
              fullWidth={true}
              onKeyDown={goSearch}
            />
          </Search>
        
          <CurrentUser/>
        </Toolbar>

      </AppBar>
    )
    
  }



export default function Component({sideContent, children, ...rest})  { 
  const [open, setState] = useState(true);

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(!open);
  };
  return (
    <Root>
        <Main>
        <Toolbar/>
        <AppBarWithSearch toggleDrawer={toggleDrawer}/>
        <Box p={1} sx={{ display: 'flex' }}>
          {open && sideContent}
          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            {children}
          </Box>
        </Box>
        </Main>
      </Root>
    )
}

