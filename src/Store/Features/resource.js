import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	data: [],
	loading: false,
	error: null,
};

export const fetchResource = createAsyncThunk(
	'resource/fetchResource',
	async (_, {rejectWithValue}) => {
		try {
			const res = await axios.get('https://localhost:3000/api/Resource', {
				params: {status: 'all'}
			});
			return res.data?.data || res.data || [];
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const addResource = createAsyncThunk(
	'resource/addResource',
	async ({name}, {rejectWithValue}) => {
		try {
			const res = await axios.post('https://localhost:3000/api/Resource', {name, status: false});
			return res.data?.data || res.data;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const updateResource = createAsyncThunk(
	'resource/updateResource',
	async ({id, name, status}, {rejectWithValue}) => {
		try {
			await axios.put(`https://localhost:3000/api/Resource/${id}`, {name, status});
			return {id, name, status};
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

export const deleteResource = createAsyncThunk(
	'resource/deleteResource',
	async (id, {rejectWithValue}) => {
		try {
			await axios.delete(`https://localhost:3000/api/Resource/${id}`);
			return id;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

const resourceSlice = createSlice({
	name: 'resource',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchResource.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchResource.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchResource.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка загрузки данных';
			})
			.addCase(addResource.fulfilled, (state, action) => {
				if (state.data && action.payload) state.data.push(action.payload);
			});
	}
});

export default resourceSlice.reducer;
