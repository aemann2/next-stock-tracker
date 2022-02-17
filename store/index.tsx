import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialNavState = {
	cash: null,
};

export const navSlice = createSlice({
	name: 'nav',
	initialState: initialNavState,
	reducers: {
		setCash: (state, action) => {
			state.cash = action.payload;
		},
	},
});

const initialModeState = {
	darkMode: true,
};

const modeSlice = createSlice({
	name: 'mode',
	initialState: initialModeState,
	reducers: {
		setDarkMode: (state) => {
			state.darkMode = !state.darkMode;
		},
	},
});

const store = configureStore({
	reducer: {
		nav: navSlice.reducer,
		mode: modeSlice.reducer,
	},
});

export const navActions = navSlice.actions;

export const modeActions = modeSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
