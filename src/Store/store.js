import {configureStore} from '@reduxjs/toolkit'
import resourceReducer from "./Features/resource.js";
import unitReducer from "./Features/unit.js";

const store = configureStore({
	reducer: {
		resource: resourceReducer,
		unit: unitReducer,
	},
})

export default store
