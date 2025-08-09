import React, {useEffect, useState} from 'react';
import {Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {fetchResource, addResource, updateResource, deleteResource} from '../../Store/Features/resource.js';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ResourceList() {
	const dispatch = useDispatch();
	const {data: resourceList = [], loading} = useSelector(state => state.resource);
	const [showArchived, setShowArchived] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [newName, setNewName] = useState('');
	const [editId, setEditId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editStatus, setEditStatus] = useState(false);

	useEffect(() => {
		dispatch(fetchResource());
	}, [dispatch]);

	const displayResources = resourceList?.filter(r =>
		showArchived ? r.status === true : r.status === false
	);

	const handleDelete = async (resource) => {
		if (window.confirm(`Удалить "${resource.name}"?`)) {
			await dispatch(deleteResource(resource.id));
			await dispatch(fetchResource());
		}
	};

	const handleAdd = () => {
		setShowAdd(true);
		setNewName('');
	};
	const handleAddSubmit = async (e) => {
		e.preventDefault();
		await dispatch(addResource({name: newName.trim()}));
		setShowAdd(false);
		setNewName('');
		await dispatch(fetchResource());
	};

	const startEdit = (resource) => {
		setEditId(resource.id);
		setEditName(resource.name);
		setEditStatus(resource.status);
	};
	const cancelEdit = () => {
		setEditId(null);
		setEditName('');
	};
	const handleSaveEdit = async () => {
		await dispatch(updateResource({id: editId, name: editName, status: editStatus}));
		await dispatch(fetchResource());
		setEditId(null);
		setEditName('');
	};

	const handleSetStatus = async (resource, newStatus) => {
		await dispatch(updateResource({id: resource.id, name: resource.name, status: newStatus}));
		await dispatch(fetchResource());
	};

	const handleArchiveToggle = () => setShowArchived(a => !a);

	return (
		<Box sx={{p: 2}}>
			<h2>Ресурсы</h2>
			<Box sx={{mb: 2, display: 'flex', gap: 2}}>
				<Button variant="contained" color="success" onClick={handleAdd}>Добавить</Button>
				<Button variant="contained" onClick={handleArchiveToggle}>
					{showArchived ? 'Активные' : 'Архив'}
				</Button>
			</Box>
			{showAdd && (
				<form onSubmit={handleAddSubmit} style={{marginBottom: 20}}>
					<input
						autoFocus
						placeholder="Название нового ресурса"
						value={newName}
						onChange={e => setNewName(e.target.value)}
						style={{minWidth: 200, marginRight: 10}}
					/>
					<Button variant="contained" type="submit" disabled={!newName.trim()}>Сохранить</Button>
					<Button onClick={() => setShowAdd(false)} sx={{ml: 1}}>Отмена</Button>
				</form>
			)}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Наименование</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow><TableCell colSpan={2}>Загрузка...</TableCell></TableRow>
						) : displayResources.length === 0 ? (
							<TableRow><TableCell colSpan={2}>Нет данных</TableCell></TableRow>
						) : (
							displayResources.map(resource =>
								<TableRow key={resource.id}>
									<TableCell>
										{editId === resource.id ? (
											<input
												value={editName}
												onChange={e => setEditName(e.target.value)}
												autoFocus
												style={{minWidth: 120, marginRight: 8}}
											/>
										) : (
											resource.name
										)}
									</TableCell>
									<TableCell align="right">
										{editId === resource.id ? (
											<>
												<Button
													onClick={handleSaveEdit}
													variant="contained"
													color="success"
													size="small"
													sx={{mr: 1}}
													disabled={!editName.trim()}
												>Сохранить</Button>
												<Button
													onClick={cancelEdit}
													variant="outlined"
													size="small"
												>Отмена</Button>
											</>
										) : (
											<>
												<Button
													onClick={() => startEdit(resource)}
													size="small"
													variant="outlined"
													sx={{mr: 1}}
												>Редактировать</Button>
												<Button
													onClick={() => handleDelete(resource)}
													size="small"
													variant="outlined"
													color="error"
													sx={{mr: 1}}
													title="Удалить"
												>
													<DeleteIcon fontSize="small"/>
												</Button>
												{resource.status === false ? (
													<Button
														onClick={() => handleSetStatus(resource, true)}
														size="small"
														color="secondary"
														sx={{minWidth: 0, p: "4px"}}
														title="В архив"
													>
														<UnarchiveIcon fontSize="small"/>
													</Button>
												) : (
													<Button
														onClick={() => handleSetStatus(resource, false)}
														size="small"
														color="primary"
														sx={{minWidth: 0, p: "4px"}}
														title="Восстановить"
													>
														<ArchiveIcon fontSize="small"/>
													</Button>
												)}
											</>
										)}
									</TableCell>
								</TableRow>
							)
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
