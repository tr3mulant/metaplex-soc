import Image from 'next/image';
import { useTheme } from 'styled-components';
import logo_light from '../images/final_wtype_inv_cropped@4x.png';
import logo_dark from '../images/final_wtype_transparent_cropped@4x.png';

export default function LogoTextImage(props) {
	const theme = useTheme();
	const logo = theme.mode == 'light' ? logo_light : logo_dark;
	const {
		width = 2210,
		height = 2917,
		src = logo,
		alt = 'Psychopomp Compics',
		layout = 'responsive',
		...other
	} = props;
	return (
		<Image
			width={width}
			height={height}
			src={src}
			alt={alt}
			layout={layout}
			{...other}
		/>
	);
}
