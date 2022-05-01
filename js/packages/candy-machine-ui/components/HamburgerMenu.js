import styled from 'styled-components';

export const HamburgerMenu = {
	Wrapper: styled.button`
		display: none;
		align-items: center;
		cursor: pointer;
		border: none;
		background: transparent;
		outline: none;
		z-index: 1;
		width: ${({ theme }) => theme.spaces.xxl.replace('rem', '') * 1.2}rem;
		padding: var(--space-sm);
		& * {
			stroke: var(--brand);
			stroke-width: 1.5;
		}
		@media only screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
			display: block;
		}
	`,
	CloseMenuIcon: () => {
		return (
			<svg
				height='auto'
				width='100%'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 100 100'
			>
				<path d='M 33,33 L 66,66' />
				<path d='M 33,66 L 66,33' />
				<polyline
					points='50,15 80,33 80,66 50,85 20,66 20,33 50,15'
					strokeLinecap='round'
					fill='none'
					stroke-linejoing='miter'
				/>
			</svg>
		);
	},
	OpenMenuIcon: () => {
		return (
			<svg
				height='auto'
				width='100%'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 100 100'
			>
				<path d='M 30 39 H 69' />
				<path d='M 30 49.5 H 69' />
				<path d='M 30 60 H 69' />
				<polyline
					points='50,15 80,33 80,66 50,85 20,66 20,33 50,15'
					strokeLinecap='round'
					fill='none'
					stroke-linejoing='miter'
				/>
			</svg>
		);
	},
};
