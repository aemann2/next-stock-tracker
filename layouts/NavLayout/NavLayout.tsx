import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;

const NavLayout: React.FC = ({ children }) => {
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
					},
				}}
				variant='permanent'
				anchor='left'
			>
				<List>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'Home'} />
					</ListItem>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'Buy'} />
					</ListItem>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'Sell'} />
					</ListItem>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'Quote'} />
					</ListItem>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'History'} />
					</ListItem>
				</List>
				<List>
					<ListItem button>
						<ListItemIcon></ListItemIcon>
						<ListItemText primary={'Logout'} />
					</ListItem>
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
