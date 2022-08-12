import React from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';


const MainLayout: React.FC = ({ children }) => {
	const theme = useTheme();
	return (
		<Box
		component='main'
		sx={{ flexGrow: 1, backgroundColor: theme.palette.primary.main, color:theme.palette.primary.contrastText, p: 3, height:'100vh' }}
	>
		<Toolbar />
		{children}
	</Box>
	)
}

export default MainLayout;