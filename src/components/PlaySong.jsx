import { useRef, useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import equalizerAnim from '../assets/equalizer.json'
import { FaRegPlayCircle } from 'react-icons/fa'
import { storage } from '../hooks/useFirebaseSdk'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import gachaDestinyData from '../util/gachaDestinyData.json'
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

function PlaySong({ songDuration, songProgress, setSongProgress, song }) {
	const [isPlaying, setIsPlaying] = useState(false)

	const [audio, setAudio] = useState(null)

	const timeoutRef = useRef(null)

	useEffect(() => {
		if (!song) return

		const loadAudio = async () => {
			try {
				const clipUrl = await getDownloadURL(ref(storage, `audio-clips/${song.id}.mp3`))
				const audioObj = new Audio(clipUrl)
				const handleTimeUpdate = () => {
					setSongProgress(audioObj.currentTime)
					if (audioObj.currentTime >= songDuration) {
						audioObj.pause()
						setIsPlaying(false)
						setSongProgress(songDuration)
					}
				}
				audioObj.addEventListener('timeupdate', handleTimeUpdate)
				setAudio(audioObj)
			} catch (e) {
				console.error('Failed to load audio:', e)
			}
		}

		loadAudio()
	}, [song, songDuration])

	const handleAudio = () => {
		if (!audio) return
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
