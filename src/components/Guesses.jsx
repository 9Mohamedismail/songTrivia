import { useEffect } from 'react'
import styled from 'styled-components'
import { FaCircleXmark, FaCircleCheck } from 'react-icons/fa6'
import gachaDestinyData from '../util/gachaDestinyData.json'

const StyledContainter = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	gap: 16px;
	width: 100%;
	padding: 0 12px;

	@media (max-width: 479px) {
		padding: 0 8px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`
const GuessContainter = styled.div`
	display: flex;
	flex-wrap: wrap;
	border-radius: 11px;
	border: solid #383838;
	width: 100%;
	max-width: 640px;
	min-height: 48px;
	padding: 6px;
	align-items: center;
	box-sizing: border-box;
	gap: 8px;

	@media (max-width: 479px) {
		min-height: 40px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

const GuessText = styled.h1`
	display: flex;
	font-size: 16px;
	margin: 0;
	font-family:
		IBM Plex Mono,
		Noto Sans Mono Variable,
		Noto Sans Mono,
		monospace;
	line-height: 1.3;
	gap: 4px;
	color: ${(props) => (props.correct === 'Skipped' ? '#1e293b' : props.correct ? '#059669' : '#dc2626')};
	flex: 1;
	min-width: 0;
	word-break: break-word;
	overflow-wrap: anywhere;
	width: 100%;

	svg {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
	}

	@media (max-width: 479px) {
		font-size: 12px;

		${(props) => props.fieldType === 'artist' && 'flex: 1; min-width: 80px; max-width: 150px;'}
		${(props) => props.fieldType === 'title' && 'flex: 1; min-width: 100px; max-width: 150px;'}
		${(props) => props.fieldType === 'genre' && 'flex: 0 0 60px;'}
		${(props) => props.fieldType === 'year' && 'flex: 0 0 50px;'}

		svg {
			flex-shrink: 0;
			width: 12px;
			height: 12px;
		}
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

function Guesses({ songGuesses, song }) {
	const getFeedback = (correct, guess) => {
		const feedback = {
			artist: guess.artist === correct.artist,
			title: guess.title === correct.title,
			genre: guess.genre === correct.genre,
			year: Math.abs(guess.year - correct.year) <= 1
		}
		return feedback
	}

	return (
		<StyledContainter>
			{songGuesses.map((guess, i) => {
				if (!guess) {
					return (
						<GuessContainter key={i}>
							<GuessText />
						</GuessContainter>
					)
				}

				if (guess.id === 'Skipped') {
					return (
						<GuessContainter key={i}>
							<GuessText correct="Skipped">
								<FaCircleXmark />
								SKIPPED
							</GuessText>
						</GuessContainter>
					)
				}

				const feedback = getFeedback(song, guess)

				return (
					<GuessContainter key={guess.id}>
						<GuessText correct={feedback.artist} fieldType="artist">
							{feedback.artist ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.artist}
						</GuessText>
						<GuessText correct={feedback.title} fieldType="title">
							{feedback.title ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.title}
						</GuessText>
						<GuessText correct={feedback.genre} fieldType="genre">
							{feedback.genre ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.genre}
						</GuessText>
						<GuessText correct={feedback.year} fieldType="year">
							{feedback.year ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.year}
						</GuessText>
					</GuessContainter>
				)
			})}
		</StyledContainter>
	)
}

export default Guesses
