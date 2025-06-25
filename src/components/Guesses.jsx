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

	@media (max-width: 480px) {
		padding: 0 8px;
	}
`
const GuessContainter = styled.div`
	display: flex;
	flex-wrap: wrap;
	border: 1px solid;
	width: 100%;
	max-width: 640px;
	min-height: 48px;
	padding: 6px;
	border-radius: 6px;
	align-items: center;
	box-sizing: border-box;
	gap: 8px;

	@media only screen and (max-width: 719px) {
		min-height: 48px;
	}
`

const GuessText = styled.h1`
	display: flex;
	align-items: center;
	font-size: 14px;
	margin: 0;
	line-height: 1.3;
	gap: 4px;
	color: ${(props) => (props.correct === 'Skipped' ? '#1e293b' : props.correct ? '#059669' : '#dc2626')};
	flex: 1;
	min-width: 0;
	word-break: break-word;

	svg {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
	}

	@media only screen and (max-width: 719px) {
		font-size: 16px;

		svg {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
		}
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
						<GuessText correct={feedback.artist}>
							{feedback.artist ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.artist}
						</GuessText>
						<GuessText correct={feedback.title}>
							{feedback.title ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.title}
						</GuessText>
						<GuessText correct={feedback.genre}>
							{feedback.genre ? <FaCircleCheck /> : <FaCircleXmark />}
							{guess.genre}
						</GuessText>
						<GuessText correct={feedback.year}>
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
