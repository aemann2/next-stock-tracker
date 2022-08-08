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
import ListItemText from '@mui/material/ListItemText';

import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const NavLayout: React.FC = ({ children }) => {
	const theme = useTheme();
	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
			></AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.primary.contrastText,
					},
				}}
				variant='permanent'
				anchor='left'
			>
				<List>
					<Link href='/home' passHref>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={'Home'} />
						</ListItem>
					</Link>
					<Link href='/buy' passHref>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={'Buy'} />
						</ListItem>
					</Link>
					<Link href='/sell' passHref>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={'Sell'} />
						</ListItem>
					</Link>
					<Link href='/quote' passHref>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={'Quote'} />
						</ListItem>
					</Link>
					<Link href='/history' passHref>
						<ListItem button>
							<ListItemIcon></ListItemIcon>
							<ListItemText primary={'History'} />
						</ListItem>
					</Link>
				</List>
				<List>
					<ListItemButton onClick={() => signOut()} alignItems='center'>
						<ListItemText primary={'Logout'} />
					</ListItemButton>
				</List>
			</Drawer>
			<Box
				component='main'
				sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default NavLayout;
