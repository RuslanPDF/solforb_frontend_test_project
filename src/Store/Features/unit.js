import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
	data: null,
	loading: false,
	error: null
};

export const fetchUnit = createAsyncThunk(
	'unit/fetchUnit',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get('https://localhost:3000/api/Unit', {
				params: { status: 'all' }
			});
			return response.data?.data || response.data || [];
		} catch (err) {
			return rejectWithValue(err.response?.data?.message);
		}
	}
);

const unitSlice = createSlice({
	name: 'unit',
	initialState,
	reducers: {
	},
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
