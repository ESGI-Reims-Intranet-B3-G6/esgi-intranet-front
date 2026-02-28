import { useRef, useEffect, type RefObject, type ReactNode } from 'react';

/**
 * Hook that runs callback when there has been clicks outside of the passed ref
 */
function useOutsideCallbacker(
  ref: RefObject<HTMLDivElement | null>,
  callback: () => void,
  event: 'mousedown' | 'mouseup' | 'click',
  ignore: string[]
) {
	useEffect(() => {
		/**
		 * Run callback if clicked on outside of element
		 */
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ignore.includes((event.target as Element)?.id || '') && !ref.current.contains(event.target as Node)) {
				callback();
			}
		}
		// Bind the event listener
		document.addEventListener(event, handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener(event, handleClickOutside);
		};
	}, [ref, callback, event, ignore]);
}

/**
 * Component that runs a callback if you click outside of it
 */
function OutsideCallbacker({
  callback,
  children,
	event = 'click',
  ignore = [],
}: {
	callback: () => void;
	children: ReactNode;
	event?: 'mousedown' | 'mouseup' | 'click';
  ignore?: string[]
}) {
	const wrapperRef = useRef(null);
	useOutsideCallbacker(wrapperRef, callback, event, ignore);

	return <div ref={wrapperRef}>{children}</div>;
}

export default OutsideCallbacker;
