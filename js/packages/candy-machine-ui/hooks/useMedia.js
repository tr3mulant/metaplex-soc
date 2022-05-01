import { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';

export const useMedia = () => {
	const theme = useTheme();

	const [isMobile, setMobile] = useState(false);

	useEffect(() => {
		const onResize = () => {
			const isMobile =
				window.innerWidth <= parseInt(theme.breakpoints.sm.replace('px', ''));
			setMobile(isMobile);
		};

		window.addEventListener('resize', onResize);

		function isMobileSized() {
			setMobile(
				window.innerWidth <= parseInt(theme.breakpoints.sm.replace('px', ''))
			);
		}

		window.addEventListener('resize', isMobileSized);

		isMobileSized();

		return () => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('resize', isMobileSized);
		};
	}, [isMobile, theme.breakpoints.sm]);

	return { isMobile };
};
