import { useRef, useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import equalizerAnim from '../assets/equalizer.json'
import { FaRegPlayCircle } from 'react-icons/fa'
import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`
const MediaWrapper = styled.div`
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg,
	canvas,
	div {
		width: 100%;
		height: 100%;
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
			setIsPlaying(false)
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
			<h1>{`0:${String(Math.floor(songProgress)).padStart(2, '0')}`}</h1>
			<MediaWrapper>
				{isPlaying ? <Lottie animationData={equalizerAnim} loop autoplay /> : <FaRegPlayCircle onClick={handleAudio} />}
			</MediaWrapper>
			<h1> 0:16</h1>
		</StyledContainter>
	)
}

export default PlaySong
