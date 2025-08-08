import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import cs from "./Nav.module.scss";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const Nav = ({title, list}) => {
	return (
		<>
			<Typography
				variant="h6"
				sx={{
					pl: 2,
					pt: 2,
					pb: 0,
					color: 'text.primary',
					fontWeight: 700,
					fontSize: 22,
					letterSpacing: 1,
				}}
			>
				{title}
			</Typography>
			<List dense sx={{pl: 1}}>
				{list.map((item) => (
					<ListItem disablePadding key={item.id}>
						<ListItemButton component={RouterLink} to={item.path}>
							<ListItemText
								primary={item.name}
								primaryTypographyProps={{
									fontSize: 15,
									fontWeight: 400,
									color: 'text.secondary',
								}}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</>
	);
};

export default Nav;