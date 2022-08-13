import React, {useState} from 'react';
import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

import MainLayout from './MainLayout';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer, {DrawerProps} from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';

import ListItemIcon, { ListItemIconProps } from '@mui/material/ListItemIcon';
import ListItemButton, {ListItemButtonProps} from '@mui/material/ListItemButton';
import ListItemText, {ListItemTextProps} from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HelpIcon from '@mui/icons-material/Help';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import { useRouter } from 'next/router';

const drawerWidth = 200;
const mobileDrawerWidth = 150;

const StyledItemText = styled(ListItemText)<ListItemTextProps>(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  '& .MuiTypography-root': {
		fontWeight: 600,
		fontSize: 15,
    [theme.breakpoints.up('sm')]: {
      fontSize: 20,
			fontWeight: 700,
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)<ListItemIconProps>(() => ({
  color: indigo[50],
}));

interface customListItemButtonProps extends ListItemButtonProps {
	href?: String;
}

const StyledListItemButton = styled(ListItemButton)<customListItemButtonProps>(({ theme, href }) => (
	href && href === useRouter().pathname ? 
	{
		'.MuiListItemIcon-root, .MuiTypography-root': {
			color: theme.palette.warning.main
		} 
} : {
	'&:hover': {
		'.MuiListItemIcon-root, .MuiTypography-root': {
		color: 'yellow'
	}
	}
} ));

const StyledDrawer = styled(Drawer)<DrawerProps>(({ theme }) => ({
	width: drawerWidth,
	flexShrink: 0,
	height: '100vh',
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		height: '100vh',
		boxSizing: 'border-box',
		backgroundColor: theme.palette.secondary.main
	}
}))

interface Props {
	children: JSX.Element;
  window?: () => Window;
}

const NavLayout= (props: Props) => {
	const { window, children } = props;
	const { status } = useSession();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

	const navLinks = (
		<>
			<List>
				<Link href='/home' passHref>
					<StyledListItemButton>
						<StyledListItemIcon >
							<HomeIcon/>
						</StyledListItemIcon>
						<StyledItemText primary={'Home'} />
					</StyledListItemButton>
				</Link>
				<Link href='/buy' passHref>
					<StyledListItemButton>
						<StyledListItemIcon>
							<ShoppingCartIcon/>
						</StyledListItemIcon>
						<StyledItemText primary={'Buy'} />
					</StyledListItemButton>
				</Link>
				<Link href='/sell' passHref>
					<StyledListItemButton>
						<StyledListItemIcon>
							<AttachMoneyIcon/>
						</StyledListItemIcon>
						<StyledItemText primary={'Sell'} />
					</StyledListItemButton>
				</Link>
				<Link href='/quote' passHref>
					<StyledListItemButton>
						<StyledListItemIcon>
							<HelpIcon/>
						</StyledListItemIcon>
						<StyledItemText primary={'Quote'} />
					</StyledListItemButton>
				</Link>
				<Link href='/history' passHref>
					<StyledListItemButton>
						<StyledListItemIcon>
							<HistoryIcon/>
						</StyledListItemIcon>
						<StyledItemText primary={'History'} />
					</StyledListItemButton>
				</Link>
			</List>
				{ status === "authenticated" ? 
				<List sx={{height: '100%', display: 'flex', alignItems: 'flex-end'}}>
					<StyledListItemButton onClick={() => signOut()} alignItems='center'>
							<StyledListItemIcon>
								<LogoutIcon/>
							</StyledListItemIcon>
						<StyledItemText primary={'Logout'} />
					</StyledListItemButton>
				</List> : null
				}
		</>
	)

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ 
					width: { sm: `calc(100% - ${drawerWidth}px)` }, 
					ml: { sm: `${drawerWidth}px` } 
				}}
			>
			<Toolbar sx={{display: {xs: 'flex', sm:'none'}, justifyContent:'space-between'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
					<IconButton
						color='inherit'
					>
						<DarkModeIcon />
					</IconButton>
        </Toolbar>
			</AppBar>
			<Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
				<StyledDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: mobileDrawerWidth },
          }}
        >
					{navLinks}
				</StyledDrawer>
				<StyledDrawer
					variant= 'permanent' 
					anchor= 'left'
					sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
				>
					{navLinks}
				</StyledDrawer>
			</Box>
			<MainLayout>
				{children}
			</MainLayout>
		</Box>
	);
};

export default NavLayout;
