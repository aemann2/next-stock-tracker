import React from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import DarkModeIcon from '@mui/icons-material/DarkMode';

const MainLayout: React.FC = ({ children }) => {
	const theme = useTheme();
	return (
		<Box
		component='main'
		sx={{ flexGrow: 1, backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText, px: 3, py:1, height:'100vh' }}
	>
		<Toolbar sx={{ display: { sm: 'none' } }} />
		<IconButton
			color="inherit"
			sx={{marginLeft: 'auto', display: {xs:'none', sm:'flex'}}}
		>
			<DarkModeIcon />
		</IconButton>
		{children}
	</Box>
	)
}

export default MainLayout;