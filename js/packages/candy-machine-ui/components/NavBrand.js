import Link from 'next/link';
import styled from 'styled-components';
import MotionLogo from './styles/MotionLogo.styled';

const NavBrandContainer = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 8rem;
	display: inline-block;
	z-index: 1;

	svg {
		height: 100%;
		width: auto;
	}
`;

export const NavBrand = ({ onClick }) => {
	return (
		<NavBrandContainer>
			<Link href='/'>
				<a onClick={onClick}>
					<MotionLogo />
				</a>
			</Link>
		</NavBrandContainer>
	);
};
