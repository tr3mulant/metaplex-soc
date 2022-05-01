import {
	ThreeUpContainer,
	ThreeUpItem,
	ThreeUpImageContainer,
} from './ThreeUp.styled';
import {
	MicrochipIconHexagon,
	BlockchainIconHexagon,
	RobotIconHexagon,
} from '../HexagonIcons';

export default function ThreeUpNft() {
	return (
		<ThreeUpContainer>
			<ThreeUpItem>
				<ThreeUpImageContainer>
					<MicrochipIconHexagon sizes='15rem' />
				</ThreeUpImageContainer>
				<h2>Digitally Native</h2>
				<p>
					Our comics are free to read on our website, and we will continue to
					experiment with online story consumption
				</p>
			</ThreeUpItem>
			<ThreeUpItem>
				<ThreeUpImageContainer>
					<BlockchainIconHexagon sizes='15rem' />
				</ThreeUpImageContainer>
				<h2>NFT-Powered</h2>
				<p>
					Since our content is free, our main revenue stream is through digital
					collectibles on the Solana blockchain
				</p>
			</ThreeUpItem>
			<ThreeUpItem>
				<ThreeUpImageContainer>
					<RobotIconHexagon sizes='15rem' />
				</ThreeUpImageContainer>
				<h2>Artist-Centric</h2>
				<p>
					With smart contract technology we are able to share profits and
					royalties with the artists that helped create our stories and IP
				</p>
			</ThreeUpItem>
		</ThreeUpContainer>
	);
}
