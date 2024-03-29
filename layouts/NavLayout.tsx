import React from 'react';
import Link from 'next/link';

import { signOut, useSession } from 'next-auth/react';

import MainLayout from './MainLayout';

import Box from '@mui/material/Box';
import Drawer, {DrawerProps} from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItemIcon, { ListItemIconProps } from '@mui/material/ListItemIcon';
import ListItemButton, {ListItemButtonProps} from '@mui/material/ListItemButton';
import ListItemText, {ListItemTextProps} from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HelpIcon from '@mui/icons-material/Help';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const StyledItemText = styled(ListItemText)<ListItemTextProps>(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  '& .MuiTypography-root': {
		fontWeight: 700,
		fontSize: 20,
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

const NavLayout: React.FC = ({children}) => {
	const { status } = useSession();
	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
			></AppBar>
			<StyledDrawer
				variant= 'permanent' 
				anchor= 'left'
			>
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
			</StyledDrawer>
			<MainLayout>
				{children}
			</MainLayout>
		</Box>
	);
};

export default NavLayout;
