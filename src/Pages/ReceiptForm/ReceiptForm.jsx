import React, {useState, useEffect, useMemo} from 'react';
import {
	Box, Button, IconButton, Table, TableBody, TableCell, TableContainer,
	TableHead, TableRow, TextField, Paper, Select, MenuItem, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import {useParams} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {useSelector} from 'react-redux';

const createRow = (resource = '', unit = '', amount = '', id = null) => ({
	resource, unit, amount, id
});

export default function ReceiptForm() {
	const {id} = useParams();
	const isEditMode = Boolean(id);

	const {data: resourceList = [], loading: resourceLoading} = useSelector(state => state.resource);
	const {data: unitList = [], loading: unitLoading} = useSelector(state => state.unit);

	const [number, setNumber] = useState('');
	const [date, setDate] = useState('');
	const [rows, setRows] = useState([createRow()]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const duplicateIdx = useMemo(() =>
			rows
				.map((row, idx) =>
					row.resource &&
					rows.findIndex((r, i) => i !== idx && r.resource === row.resource) !== -1
						? idx : null
				)
				.filter(idx => idx !== null),
		[rows]
	);

	useEffect(() => {
		if (!isEditMode) {
			setLoading(false);
			return;
		}
		(async () => {
			try {
				const {data} = await axios.get(`https://localhost:3000/api/Receipt/${id}`);
				const receipt = data?.data;
				setNumber(receipt.number ?? '');
				setDate(receipt.date ? receipt.date.substring(0, 10) : '');
				setRows(
					receipt.receiptResources?.map(r =>
						createRow(
							r.resourceId ?? '',
							r.unitOfMeasurementId ?? '',
							r.quantity ?? '',
							r.id ?? undefined
						)
					) ?? [createRow()]
				);
			} catch (e) {
				setError(true);
			} finally {
				setLoading(false);
			}
		})();
	}, [id, isEditMode]);

	const handleAdd = () => setRows([...rows, createRow()]);

	const handleDelete = idx => setRows(rows.filter((_, i) => i !== idx));

	const handleChange = (idx, field, value) => setRows(
		rows.map((row, i) => i === idx ? {...row, [field]: value} : row)
	);

	const handleSave = async () => {
		const payload = {
			number,
			date: date ? new Date(date).toISOString() : null,
			items: rows.map(row => {
				const item = {
					resourceId: Number(row.resource),
					unitOfMeasurementId: Number(row.unit),
					quantity: Number(row.amount)
				};
				if (row.id) item.id = Number(row.id);
				return item;
			})
		};
		try {
			if (isEditMode) {
				await axios.put(`https://localhost:3000/api/Receipt/${id}`, payload);
				alert('Документ обновлен!');
			} else {
				await axios.post('https://localhost:3000/api/Receipt', payload);
				alert('Документ создан!');
			}
		} catch {
			alert('Ошибка при сохранении!');
		}
	};

	if (error) return <div>Нет поступления с таким id</div>;
	if (loading) return <div>Загрузка...</div>;

	return (
		<Box p={2}>
			<h1>Поступление</h1>
			<Box display="flex" gap={2} mb={2} mt={2}>
				<TextField
					label="Номер"
					value={number}
					onChange={e => setNumber(e.target.value)}
				/>
				<TextField
					label="Дата"
					type="date"
					value={date}
					onChange={e => setDate(e.target.value)}
					InputLabelProps={{shrink: true}}
				/>
			</Box>
			<Button
				variant="contained"
				color="success"
				sx={{mr: 1}}
				disabled={duplicateIdx.length > 0}
				onClick={handleSave}
			>
				Сохранить
			</Button>
			<Button variant="contained" color="error">Удалить</Button>
			<TableContainer component={Paper} sx={{mt: 2}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<IconButton onClick={handleAdd}><AddIcon/></IconButton>
							</TableCell>
							<TableCell>Ресурс</TableCell>
							<TableCell>Ед. изм.</TableCell>
							<TableCell>Количество</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, i) => (
							<TableRow key={i}>
								<TableCell>
									<IconButton color="error" onClick={() => handleDelete(i)}><DeleteIcon/></IconButton>
								</TableCell>
								<TableCell>
									<FormControl fullWidth error={duplicateIdx.includes(i)}>
										<InputLabel id={`resource-select-label-${i}`}>Ресурс</InputLabel>
										<Select
											labelId={`resource-select-label-${i}`}
											value={row.resource}
											label="Ресурс"
											onChange={e => handleChange(i, 'resource', e.target.value)}
											disabled={resourceLoading}
										>
											<MenuItem value=""><em>Не выбран</em></MenuItem>
											{resourceList?.map(res =>
												<MenuItem key={res.id} value={res.id}>{res.name}</MenuItem>
											)}
										</Select>
										{duplicateIdx.includes(i) &&
											<FormHelperText>Такой ресурс уже есть</FormHelperText>
										}
									</FormControl>
								</TableCell>
								<TableCell>
									<FormControl fullWidth>
										<InputLabel id={`unit-select-label-${i}`}>Ед. изм.</InputLabel>
										<Select
											labelId={`unit-select-label-${i}`}
											value={row.unit}
											label="Ед. изм."
											onChange={e => handleChange(i, 'unit', e.target.value)}
											disabled={unitLoading}
										>
											<MenuItem value=""><em>Не выбрана</em></MenuItem>
											{unitList?.map(unit =>
												<MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
											)}
										</Select>
									</FormControl>
								</TableCell>
								<TableCell>
									<TextField
										type="number"
										value={row.amount}
										onChange={e => handleChange(i, 'amount', e.target.value)}
										inputProps={{min: 1}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{duplicateIdx.length > 0 && (
				<Box color="error.main" mt={2}>
					В документе не может быть двух одинаковых ресурсов!
				</Box>
			)}
		</Box>
	);
}
