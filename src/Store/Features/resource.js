import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	data: null,
	loading: false,
	error: null,
};

export const fetchResource = createAsyncThunk(
	'resource/fetchResource',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get('https://localhost:3000/api/Resource', {
				params: { status: 'all' }
			});
			return response.data?.data || response.data || [];
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

const resourceSlice = createSlice({
	name: 'resource',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
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
			});
	}
});

export default resourceSlice.reducer;
