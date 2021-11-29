import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { selectAll } from '../heroesFilters/filtersSlice';
import { useCreateHeroMutation } from '../../api/apiSlice';
import store from '../../store';
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [element, setElement] = useState('');

	const [createHero, { isLoading, isError }] = useCreateHeroMutation();

	const { filtersLoadingStatus } = useSelector(state => state.filters);
	const filters = selectAll(store.getState());


	const onCreate = (e) => {
		e.preventDefault();

		const hero = {
			id: uuidv4(),
			name,
			description,
			element
		};

		createHero(hero).unwrap();

		setName('');
		setDescription('');
		setElement('');
	}

	const renderFilters = (filters, status) => {
		if (isLoading) {
			return <option>Загрузка элементов</option>
		} else if (isError) {
			return <option>Ошибка загрузки</option>
		}

		if (filters && filters.length > 0) {
			return filters.map(({ name, label }) => {
				// Один из фильтров нам тут не нужен
				// eslint-disable-next-line
				if (name === 'all') return;

				return <option key={name} value={name}>{label}</option>
			})
		}
	}
	const options = renderFilters(filters, filtersLoadingStatus);
	return (
		<form onSubmit={onCreate} className="border p-4 shadow-lg rounded">
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
				<input
					required
					type="text"
					name="name"
					className="form-control"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Как меня зовут?" />
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">Описание</label>
				<textarea
					required
					name="text"
					className="form-control"
					id="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Что я умею?"
					style={{ "height": '130px' }} />
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">Выбрать элемент героя</label>
				<select
					required
					className="form-select"
					id="element"
					name="element"
					value={element}
					onChange={(e) => setElement(e.target.value)}>
					<option >Я владею элементом...</option>
					{options}
				</select>
			</div>

			<button type="submit" className="btn btn-primary">Создать</button>
		</form>
	)
}

export default HeroesAddForm;