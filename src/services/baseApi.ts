import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery.ts';

export default createApi({
	reducerPath: 'baseApi',
	baseQuery,
	endpoints: () => ({}),
});
