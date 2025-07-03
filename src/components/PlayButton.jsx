import styled from 'styled-components'
import Lottie from 'lottie-react'
import equalizerAnim from '../assets/equalizer.json'
import { FaRegPlayCircle } from 'react-icons/fa'

const MediaWrapper = styled.div`
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	cursor: pointer;
	border-radius: 50%;
	transition: all 0.2s ease;

	&:hover {
		background: #f3f4f6;
		transform: scale(1.05);
	}

	&:active {
		transform: scale(0.95);
	}

	svg {
		width: 100%;
		height: 100%;
		color: #374151;
	}

	@media (max-width: 479px) {
		width: 72px;
		height: 72px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

function PlayButton({ handleAudio, isPlaying }) {
	return (
		<MediaWrapper>
			{isPlaying ? (
				<Lottie animationData={equalizerAnim} loop autoplay onClick={handleAudio} />
			) : (
				<FaRegPlayCircle onClick={handleAudio} />
			)}
		</MediaWrapper>
	)
}

export default PlayButton
