import { m } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import { useMedia } from '../../hooks/useMedia';
import Image from 'next/image';
import SeedOfCainBanner from '../../images/seed-of-cain/banner.jpg';
import SeedOfCainPillar from '../../images/seed-of-cain/pillar.jpg';
import SeedOfCainLogo from '../../images/seed-of-cain/logo.png';

const SeedOfCainLogoContainer = styled(m.div)`
	position: absolute;
	bottom: 25%;
	right: 5%;
	width: 33.3%;
	z-idex: 2;

	@media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
		bottom: 10%;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		width: 25rem;
	}
`;

export default function SeedOfCainHero() {
	const theme = useTheme();
	const { isMobile } = useMedia();
	return (
		<>
			{isMobile ? (
				<Image
					src={SeedOfCainPillar}
					alt='Seed of Cain Promo Banner showing Colonel Frost standing in rubble with a Cog and the city behind him'
					width={2700}
					height={3600}
					layout='responsive'
					placeholder={'blur'}
				/>
			) : (
				<Image
					src={SeedOfCainBanner}
					alt='Seed of Cain Promo Banner showing Colonel Frost standing in rubble with a city behind him'
					width={6075}
					height={3417}
					layout='responsive'
					placeholder={'blur'}
				/>
			)}
			<SeedOfCainLogoContainer
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					delay: 1,
					duration: 1,
				}}
			>
				<Image
					src={SeedOfCainLogo}
					alt='Seed of Cain Logo'
					layout='responsive'
					width={3076}
					height={1649}
					sizes={`(max-width: ${theme.breakpoints.sm}) 25rem, 33.3%`}
				/>
			</SeedOfCainLogoContainer>
		</>
	);
}
