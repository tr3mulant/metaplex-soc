import styled from 'styled-components';

const ThreeUpContainer = styled.div`
	margin-top: var(--space-xxl);
	max-width: 90rem;
	margin-left: auto;
	margin-right: auto;
	display: grid;
	grid-gap: var(--space-xl);
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-areas: 'item item item';

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		max-width: 27rem;
		grid-template-columns: 1fr;
		grid-template-areas:
			'item'
			'item'
			'item';
	}
`;

const ThreeUpItem = styled.article`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const ThreeUpImageContainer = styled.div`
	width: 15rem;
	max-width: 100%;
	margin-left: auto;
	margin-right: auto;
`;

export { ThreeUpContainer, ThreeUpItem, ThreeUpImageContainer };
