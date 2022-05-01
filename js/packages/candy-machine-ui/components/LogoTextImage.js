/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { useTheme } from 'styled-components';
import logo_light from '../images/psychopomp-comics-inv@4x.png';
import logo_dark from '../images/psychopomp-comics@4x.png';

export default function LogoTextImage(props) {
	const theme = useTheme();
	const logo = theme.mode == 'light' ? logo_light : logo_dark;
	const {
		width = 2413,
		height = 541,
		src = logo,
		alt = 'Psychopomp Compics',
		layout = 'intrinsic',
		...other
	} = props;
	return (
		<Image
			width={width}
			height={height}
			src={logo}
			alt={alt}
			layout={layout}
			{...other}
		/>
	);
}
