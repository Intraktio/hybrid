import { ActionReducer, Action } from '@ngrx/store';
import { INIT, ADD_LIST, CLEAN_LIST, CLEAN_CACHE } from '../actions';

export interface IListState {
    [key: string]: {
        page: number;
        totalPages: number;
        totalItems: number;
        list: Array<any>
    }
}

const defaultItem = {
    page: 0,
    totalPages: undefined,
    totalItems: undefined,
    list: []
};

const defaultState = {};

function getListKey(payload) {
    const { itemType, query } = payload;
    return query ? itemType + JSON.stringify(query) : itemType;
}

export const listReducer: ActionReducer<Object> = (state: IListState = defaultState, action: Action) => {
    const payload = action.payload;

    switch (action.type) {
        case ADD_LIST: {
            const { itemType, query, totalPages, totalItems, list = [], page = 0 } = payload;

            const ids = list.map((item) => item.id);
            const key = getListKey(payload);
            if (state[key] && state[key].page === page) return state;
            return Object.assign({}, state, {
                [key]: {
                    page,
                    totalPages,
                    totalItems,
                    list: (state[key] || defaultItem).list.concat(ids)
                }
            });
        }

        case CLEAN_LIST: {
            const key = getListKey(payload);
            let newState = Object.assign({}, state);
            delete newState[key];
            return newState;
        }

        case INIT: {
            return payload.list || defaultState;
        }

        case CLEAN_CACHE: {
            return defaultState;
        }

        default:
            return state;
    }
}
