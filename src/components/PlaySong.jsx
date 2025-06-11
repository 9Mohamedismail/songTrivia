import { useRef, useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import equalizerAnim from '../assets/equalizer.json'
import { FaRegPlayCircle } from 'react-icons/fa'
import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 640px;
	padding: 12px;
	box-sizing: border-box;

	@media (max-width: 480px) {
		padding: 8px;
	}
`

const TimeDisplay = styled.h2`
	font-size: 18px;
	margin: 0;
	font-weight: 500;
	color: #374151;
	min-width: 50px;

	@media (max-width: 480px) {
		font-size: 16px;
		min-width: 45px;
	}
`

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

	@media (max-width: 480px) {
		width: 56px;
		height: 56px;
	}
`

function PlaySong({ songDuration, songProgress, setSongProgress }) {
	const [isPlaying, setIsPlaying] = useState(false)

	const audioRef = useRef(new Audio('/toodeep.mp3'))
	const timeoutRef = useRef(null)

	useEffect(() => {
		const audio = audioRef.current

		const handleTimeUpdate = () => {
			setSongProgress(audio.currentTime)
			if (audio.currentTime >= songDuration) {
				audio.pause()
				setIsPlaying(false)
				setSongProgress(songDuration)
			}
		}

		audio.addEventListener('timeupdate', handleTimeUpdate)

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate)
		}
	}, [songDuration])

	const handleAudio = () => {
		const audio = audioRef.current
		clearTimeout(timeoutRef.current)

		if (isPlaying) {
			audio.pause()
			audio.currentTime = 0
			setIsPlaying(false)
			setSongProgress(0)
		} else {
			audio.currentTime = 0
			audio
				.play()
				.then(() => setIsPlaying(true))
				.catch((e) => console.error('Playback error:', e))
		}
	}

	return (
		<StyledContainter>
			<TimeDisplay>{`0:${String(Math.floor(songProgress)).padStart(2, '0')}`}</TimeDisplay>
			<MediaWrapper>
				{isPlaying ? (
					<Lottie animationData={equalizerAnim} loop autoplay onClick={handleAudio} />
				) : (
					<FaRegPlayCircle onClick={handleAudio} />
				)}
			</MediaWrapper>
			<TimeDisplay>0:16</TimeDisplay>
		</StyledContainter>
	)
}

export default PlaySong
