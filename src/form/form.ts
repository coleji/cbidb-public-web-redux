import { Dispatch, Action, Reducer } from "redux";

export const UPDATE_FORM_DISPATCH_TYPE = "UPDATE_FORM";

export const dispatchFormUpdate: (dispatch: Dispatch<FormAction>, formName: string) => (fieldName: string, fieldValue: any) => void = 
(dispatch, formName) => (fieldName, fieldValue) => dispatch({
    type: UPDATE_FORM_DISPATCH_TYPE, formName, fieldName, fieldValue
})

export const formReducer: <T extends object>(formName: string) => Reducer<T> = <T extends object>(formName: string) => (state: T = <T>{}, action: FormAction) => {
    type FormSubSet = {
        [K in keyof T]: T[K]
    }

    if (action.formName != formName) return state;
    
    console.log(action)
    switch (action.type) {
    case "UPDATE_FORM":
        var updated: any = {};
        updated[action.fieldName] = action.fieldValue;
        return <T>{...<object>state, ...<object>(updated as FormSubSet)};
    default:
        return state;
    }
}

type FormActionType =
	| "UPDATE_FORM"

interface FormAction extends Action {
    type: FormActionType,
    formName: string,
	fieldName: string,
	fieldValue: any
}