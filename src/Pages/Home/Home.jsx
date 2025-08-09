import {useState, useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {
	Box, Typography, Grid, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper,
	FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import axios from 'axios';


export default function Home() {
	const navigate = useNavigate();
	const [dateFrom, setDateFrom] = useState(null);
	const [dateTo, setDateTo] = useState(null);
	const [selectedNumbers, setSelectedNumbers] = useState([]);
	const [selectedResources, setSelectedResources] = useState([]);
	const [selectedUnits, setSelectedUnits] = useState([]);
	const [rows, setRows] = useState([]);
	const [numberOptions, setNumberOptions] = useState([]);

	const resourceList = useSelector(state => state.resource.data || []);
	const unitList = useSelector(state => state.unit.data || []);
	const resourceDict = useMemo(() => Object.fromEntries(resourceList.map(r => [r.id, r])), [resourceList]);
	const unitDict = useMemo(() => Object.fromEntries(unitList.map(u => [u.id, u])), [unitList]);
	const resourceOptions = useMemo(() => resourceList, [resourceList]);
	const unitOptions = useMemo(() => unitList, [unitList]);

	const fetchReceipts = async () => {
		try {
			const params = {
				status: 'all',
				...(dateFrom && {dateFrom: dateFrom.toISOString()}),
				...(dateTo && {dateTo: dateTo.toISOString()}),
				...(selectedNumbers.length && {numbers: selectedNumbers}),
				...(selectedResources.length && {resourceIds: selectedResources}),
				...(selectedUnits.length && {unitIds: selectedUnits}),
			};
			const r = await axios.get('https://localhost:3000/api/Receipt', {
				params,
				paramsSerializer: params => {
					return Object.entries(params)
						.map(([key, value]) => Array.isArray(value)
							? value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&')
							: `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
						.join('&');
				}
			});
			setRows(r?.data?.data || []);
		} catch {
			setRows([]);
		}
	};

	useEffect(() => {
		fetchReceipts();
	}, []);

	useEffect(() => {
		if (rows.length && numberOptions.length === 0) {
			setNumberOptions(Array.from(new Set(rows.map(row => row.number))));
		}
	}, [rows, numberOptions.length]);

	const handleApply = () => {
		fetchReceipts();
	};

	const flattenedRows = useMemo(() => {
		return rows.flatMap(document =>
			(document.receiptResources && document.receiptResources.length > 0)
				? document.receiptResources.map((r, idx) => ({
					...document,
					resourceRow: r,
					isFirst: idx === 0,
					resourcesCount: document.receiptResources.length
				}))
				: [{...document, resourceRow: null, isFirst: true, resourcesCount: 1}]
		);
	}, [rows]);

	return (
		<Box sx={{px: {xs: 1, sm: 4}, py: {xs: 2, sm: 4}}}>
			<Typography variant="h4" component="h2" gutterBottom>Поступления</Typography>
			<Paper sx={{p: 2, mb: 3}}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={3}>
						<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
							<Stack direction="row" spacing={1}>
								<DatePicker
									label="Период с"
									value={dateFrom}
									onChange={setDateFrom}
									renderInput={(params) => (
										<TextField {...params} fullWidth size="small" sx={{minWidth: 140}}/>
									)}
								/>
								<DatePicker
									label="по"
									value={dateTo}
									onChange={setDateTo}
									renderInput={(params) => (
										<TextField {...params} fullWidth size="small" sx={{minWidth: 140}}/>
									)}
								/>
							</Stack>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl fullWidth size="small" sx={{minWidth: 180}}>
							<InputLabel>Номера поступлений</InputLabel>
							<Select
								multiple
								value={selectedNumbers}
								onChange={e => setSelectedNumbers(e.target.value)}
								input={<OutlinedInput label="Номера поступлений"/>}
								renderValue={selected => (
									<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
										{selected.map(value => (<Chip key={value} label={value} size="small"/>))}
									</Box>
								)}
							>
								{numberOptions.map(option => (
									<MenuItem key={option} value={option}>{option}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl fullWidth size="small" sx={{minWidth: 170}}>
							<InputLabel>Ресурс</InputLabel>
							<Select
								multiple
								value={selectedResources}
								onChange={e => setSelectedResources(e.target.value)}
								input={<OutlinedInput label="Ресурс"/>}
								renderValue={selected => (
									<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
										{selected.map(id => (
											<Chip key={id} label={resourceDict[id]?.name || id} size="small"/>
										))}
									</Box>
								)}
							>
								{resourceOptions.map(option => (
									<MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={3}>
						<FormControl fullWidth size="small" sx={{minWidth: 170}}>
							<InputLabel>Единица измерения</InputLabel>
							<Select
								multiple
								value={selectedUnits}
								onChange={e => setSelectedUnits(e.target.value)}
								input={<OutlinedInput label="Единица измерения"/>}
								renderValue={selected => (
									<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
										{selected.map(id => (
											<Chip key={id} label={unitDict[id]?.name || id} size="small"/>
										))}
									</Box>
								)}
							>
								{unitOptions.map(option => (
									<MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={6} lg={3} mt={2}>
						<Button variant="contained" size="large" sx={{mr: 2}} onClick={handleApply}>
							Применить
						</Button>
						<Button
							variant="outlined"
							color="success"
							size="large"
							startIcon={<AddIcon/>}
							href="receipt/form"
						>
							Добавить
						</Button>
					</Grid>
				</Grid>
			</Paper>

			<Paper>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Номер</TableCell>
							<TableCell>Дата</TableCell>
							<TableCell>Ресурс</TableCell>
							<TableCell>Ед. изм.</TableCell>
							<TableCell>Количество</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{flattenedRows.map((row, i) => (
							<TableRow key={i} hover style={{cursor: 'pointer'}} onClick={() => navigate(`/receipt/form/${row.id}`)}>
								{row.isFirst && (
									<>
										<TableCell rowSpan={row.resourcesCount}>{row.number}</TableCell>
										<TableCell rowSpan={row.resourcesCount}>{row.date}</TableCell>
									</>
								)}
								<TableCell>
									{row.resourceRow
										? (resourceDict[row.resourceRow.resourceId]?.name || row.resourceRow.resourceId)
										: '-'}
								</TableCell>
								<TableCell>
									{row.resourceRow
										? (unitDict[row.resourceRow.unitOfMeasurementId]?.name || row.resourceRow.unitOfMeasurementId)
										: '-'}
								</TableCell>
								<TableCell>
									{row.resourceRow ? row.resourceRow.quantity : '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
		</Box>
	);
}
