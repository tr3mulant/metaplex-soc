/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { useTheme } from 'styled-components';
import robot_light from '../images/icons/hexagon-robot-love-light.svg';
import robot_dark from '../images/icons/hexagon-robot-love-dark.svg';
import blockchain_light from '../images/icons/hexagon-blockchain-light.svg';
import blockchain_dark from '../images/icons/hexagon-blockchain-dark.svg';
import microchip_light from '../images/icons/hexagon-microchip-light.svg';
import microchip_dark from '../images/icons/hexagon-microchip-dark.svg';

export function RobotIconHexagon(props) {
	const theme = useTheme();
	const logo = theme.mode == 'light' ? robot_light : robot_dark;
	const {
		width = 1080,
		height = 935.31,
		src = logo,
		alt = 'Robot in a hexagaon with a Heart emoji face',
		layout = 'responsive',
		...other
	} = props;
	return (
		<Image
			src={logo}
			alt={alt}
			width={width}
			height={height}
			layout={layout}
			{...other}
		/>
	);
}

export function BlockchainIconHexagon(props) {
	const theme = useTheme();
	const logo = theme.mode == 'light' ? blockchain_light : blockchain_dark;
	const {
		width = 1080,
		height = 935.31,
		src = logo,
		alt = 'Blockchain in a hexagon',
		layout = 'responsive',
		...other
	} = props;
	return (
		<Image
			src={logo}
			alt={alt}
			width={width}
			height={height}
			layout={layout}
			{...other}
		/>
	);
}

export function MicrochipIconHexagon(props) {
	const theme = useTheme();
	const logo = theme.mode == 'light' ? microchip_light : microchip_dark;
	const {
		width = 1080,
		height = 935.31,
		src = logo,
		alt = 'Microchip in a hexagon',
		layout = 'responsive',
		...other
	} = props;
	return (
		<Image
			src={logo}
			alt={alt}
			width={width}
			height={height}
			layout={layout}
			{...other}
		/>
	);
}
