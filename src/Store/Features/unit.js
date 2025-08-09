import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	data: null,
	loading: false,
	error: null
};

export const deleteUnit = createAsyncThunk(
	"unit/deleteUnit",
	async (id, {rejectWithValue}) => {
		try {
			await axios.delete(`https://localhost:3000/api/Unit/${id}`);
			return id;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const updateUnit = createAsyncThunk(
	'unit/updateUnit',
	async ({id, name, status}, {rejectWithValue}) => {
		try {
			await axios.put(`https://localhost:3000/api/Unit/${id}`, {name, status});
			return {id, name};
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);


export const archiveUnit = createAsyncThunk(
	'unit/archiveUnit',
	async ({id, name, status}, {rejectWithValue}) => {
		try {
			await axios.put(`https://localhost:3000/api/Unit/${id}`, {
				name,
				status
			});
			return id;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const fetchUnit = createAsyncThunk(
	'unit/fetchUnit',
	async (_, {rejectWithValue}) => {
		try {
			const response = await axios.get('https://localhost:3000/api/Unit', {
				params: {status: 'all'}
			});
			return response.data?.data || response.data || [];
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const addUnit = createAsyncThunk(
	'unit/addUnit',
	async (payload, {rejectWithValue}) => {
		try {
			const res = await axios.post('https://localhost:3000/api/Unit', payload);
			return res.data?.data || res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

const unitSlice = createSlice({
	name: 'unit',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUnit.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUnit.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchUnit.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка загрузки';
			});
	}
});

export default unitSlice.reducer;
