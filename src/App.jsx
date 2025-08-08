import {useState, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {fetchResource} from './Store/Features/resource.js'
import {fetchUnit} from './Store/Features/unit.js'
import Routing from "./Routing.jsx";
import Components from "./Components";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

const drawerWidth = 240;

function App() {
	const dispatch = useDispatch()
	const [mobileOpen, setMobileOpen] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));


	useEffect(() => {
		dispatch(fetchResource())
		dispatch(fetchUnit())
	}, [dispatch])

	const navList1 = {
		title: "Склад",
		list: [
			{
				id: 1,
				path: "/",
				name: "Поступление"
			},
		]
	}

	const navList2 = {
		title: "Справочники",
		list: [
			{
				id: 1,
				path: "/",
				name: "Единицы измерения"
			},
			{
				id: 2,
				path: "/",
				name: "Ресурсы"
			},
		]
	}

	const drawerContent = (
		<Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
			<Box component="nav" sx={{flexGrow: 1, overflowY: 'auto'}}>
				<Components.Nav title={navList1.title} list={navList1.list}/>
				<Components.Nav title={navList2.title} list={navList2.list}/>
			</Box>
		</Box>
	);

	return (
		<Box sx={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
			<AppBar
				position="fixed"
				sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
			>
				<Toolbar>
					{isMobile && (
						<IconButton
							color="inherit"
							edge="start"
							onClick={() => setMobileOpen(!mobileOpen)}
							sx={{mr: 2, display: {md: 'none'}}}
						>
							<MenuIcon/>
						</IconButton>
					)}
					<Typography variant="h6" noWrap component="div">
						<RouterLink component={RouterLink} to="/">
							Управлени складом
						</RouterLink>
					</Typography>
				</Toolbar>
			</AppBar>

			<Box
				component="nav"
				sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}
				aria-label="side menu"
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={() => setMobileOpen(false)}
					ModalProps={{keepMounted: true}}
					sx={{
						display: {xs: 'block', md: 'none'},
						'& .MuiDrawer-paper': {
							width: drawerWidth,
						},
					}}
				>
					{drawerContent}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: {xs: 'none', md: 'block'},
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							top: theme => theme.mixins.toolbar.minHeight || 64,
							height: `calc(100vh - ${theme => theme.mixins.toolbar.minHeight || 64}px)`,
						}
					}}
					open
				>
					{drawerContent}
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					bgcolor: 'background.default',
					pt: {xs: 7, sm: 8},
					px: 3,
					height: '100vh',
					overflowY: 'auto'
				}}
			>
				<Routing/>
			</Box>
		</Box>
	);
}

export default App;
