import styled, { useTheme } from 'styled-components';
import LogoWithText from '../LogoWithText';
import { m } from 'framer-motion';

const PsychoDescriptionContainer = styled.div`
	display: flex;
	align-items: center;
	margin-top: var(--space-xl);
	max-width: 72rem;
	margin-left: auto;
	margin-right: auto;

	& > div + div {
		margin-left: var(--space-lg);
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
		flex-wrap: wrap;
		max-width: 27rem;
	}
`;

const PsychoDescriptionImage = styled(m.div)`
	width: 20rem;
	flex-shrink: 0;

	@media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
		width: 100%;
		flex-shrink: initial;
	}
`;

const PsychoDescriptionText = styled.div`
	flex-shrink: 1;

	@media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
		width: 100%;
		flex-shrink: initial;
		margin-top: var(--space-xl);
	}
`;

export default function PsychoDescription() {
	const theme = useTheme();
	return (
		<PsychoDescriptionContainer>
			<PsychoDescriptionImage>
				<LogoWithText
					sizes={`(max-width: ${theme.breakpoints.xs}) 27rem, 20rem`}
				/>
			</PsychoDescriptionImage>
			<PsychoDescriptionText>
				<h2>A New Kind of Comic Studio</h2>
				<hr />
				<p>
					{
						'Psychopomp Comics will guide you into another realm. We are digitally native, NFT-powered and artist-centric. We use these values to disrupt the industry and provide unique experiene that bridges the legacy and digital world'
					}
				</p>
			</PsychoDescriptionText>
		</PsychoDescriptionContainer>
	);
}
