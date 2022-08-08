import React from 'react';
import Link from 'next/link';

import { signOut } from 'next-auth/react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText, {ListItemTextProps} from '@mui/material/ListItemText';
import { Home, ShoppingCart, AttachMoney, Help, History, Logout } from '@mui/icons-material'
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

const drawerWidth = 240;

const iconColor = `${indigo[50]}`

const ItemText = styled(ListItemText)<ListItemTextProps>(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  '& .MuiTypography-root': {
		fontWeight: 700,
		fontSize: 20,
    '&:hover': {
      color: `yellow`,
    },
  },
}));

const NavLayout: React.FC = ({ children }) => {
	const theme = useTheme();
	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
			></AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					height: '100vh',
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						height: '100vh',
						boxSizing: 'border-box',
						backgroundColor: theme.palette.secondary.main,
					},
				}}
				variant='permanent'
				anchor='left'
			>
				<List>
					<Link href='/home' passHref>
						<ListItem button>
							<ListItemIcon >
								<Home sx={{color: iconColor}}/>
							</ListItemIcon>
							<ItemText primary={'Home'} />
						</ListItem>
					</Link>
					<Link href='/buy' passHref>
						<ListItem button>
							<ListItemIcon>
								<ShoppingCart sx={{color: iconColor}} />
							</ListItemIcon>
							<ItemText primary={'Buy'} />
						</ListItem>
					</Link>
					<Link href='/sell' passHref>
						<ListItem button>
							<ListItemIcon>
								<AttachMoney sx={{color: iconColor}} />
							</ListItemIcon>
							<ItemText sx={{color: iconColor}} primary={'Sell'} />
						</ListItem>
					</Link>
					<Link href='/quote' passHref>
						<ListItem button>
							<ListItemIcon>
								<Help sx={{color: iconColor}} />
							</ListItemIcon>
							<ItemText primary={'Quote'} />
						</ListItem>
					</Link>
					<Link href='/history' passHref>
						<ListItem button>
							<ListItemIcon>
								<History sx={{color: iconColor}} />
							</ListItemIcon>
							<ItemText primary={'History'} />
						</ListItem>
					</Link>
				</List>
				<List sx={{height: '100%', display: 'flex', alignItems: 'flex-end'}}>
					<ListItemButton onClick={() => signOut()} alignItems='center'>
							<ListItemIcon>
								<Logout sx={{color: iconColor}} />
							</ListItemIcon>
						<ItemText primary={'Logout'} />
					</ListItemButton>
				</List>
			</Drawer>
			<Box
				component='main'
				sx={{ flexGrow: 1, backgroundColor: theme.palette.primary.main, p: 3 }}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default NavLayout;
