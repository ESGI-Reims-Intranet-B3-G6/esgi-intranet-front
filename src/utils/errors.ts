import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export function getApiErrorString(apiError: FetchBaseQueryError | SerializedError) {
	let errorString: string = '';
	errorString = ' : ';
	if ('status' in apiError) {
		errorString +=
			'error' in apiError ? (apiError as { error: string }).error : (apiError.data as { message: string })?.message;
	} else {
		errorString += apiError.message;
	}

	return errorString;
}
