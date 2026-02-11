import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
	value: number;
	hello: string | null;
	userInfo: object | null;
}

const initialState: AuthState = {
	value: 0,
	hello: null,
	userInfo: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		increment: state => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			state.value += 1;
		},
		decrement: state => {
			state.value -= 1;
		},
		incrementByAmount: (state, action: PayloadAction<number>) => {
			state.value += action.payload;
		},
		setHello: (state, action: PayloadAction<string>) => {
			state.hello = action.payload;
		},
		setUserInfo: (state, action: PayloadAction<object>) => {
			state.userInfo = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, setHello, setUserInfo } = authSlice.actions;

export default authSlice;
