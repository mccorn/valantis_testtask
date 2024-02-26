import "./styles.css"
import { CardData } from "../../types"

export type CardPropTypes = {
	data: CardData
}

function Card(props: CardPropTypes) {
	return props.data ? (
		<div className="card">
			<h5 className="card__title">{props.data.product}</h5>
			{props.data.brand &&
				<div>Бренд: {props.data.brand}</div>
			}
			<div>Цена: {props.data.price}</div>

			<div className="card__subtext">{props.data.id}</div>
		</div>
	) : null
}



export default Card