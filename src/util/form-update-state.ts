import { some } from "fp-ts/lib/Option";

const formUpdateState = <T extends object>(state: T, setState: (newState: T) => void, formPropName: string) => (id: string & keyof T, value: string) => {
	var newFormPart: any = {};
	newFormPart[id] = some(value);

	var formPartOfState: any = {};
	formPartOfState[formPropName] = {
		...(<any>state)[formPropName],
		...newFormPart
	};
	

	setState({
		...state,
		...formPartOfState
	})
};

export default formUpdateState