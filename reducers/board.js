import * as actionTypes from 'constants/actionTypes'
import update from 'immutability-helper'

const initialState = {
    content: {},
    id: '',
    isFetchingBoard: false,
    boardError: null,
    isFetchingBoards: false,
    boardsError: null,
    boards: [],
    columns: [],
    isEditingBoards: false,
    sortKey: 'last_updated_time',
    sortDirection: 'DESC',
    groupFilter: '0',
    columnsProcessingImage: []
}

const board = (state = initialState, action) => {
    switch(action.type) {
    case actionTypes.RECEIVE_CARD:
        return {
            ...state,
            columns: state.columns.map(column => {
                if(column.id !== action.columnId) return column

                if(column.cards.some(card => card.id === action.card.id)) return column

                return {
                    ...column,
                    cards: [...column.cards, action.card]
                }
            })
        }
    case actionTypes.RECEIVE_COLUMN:
        if(state.columns.some(column => column.id === action.column.id)) return state

        return {
            ...state,
            columns: [...state.columns, action.column]
        }
    case actionTypes.RECEIVE_MOVED_CARD:
        return {
            ...state,
            columns: state.columns.map(column => {
                if(column.id !== action.columnId) return column
                return update(column, {
                    cards: {
                        $splice: [[action.dragIndex, 1], [action.hoverIndex, 0, column.cards[action.dragIndex]]]
                    }
                })
            })
        }
    case actionTypes.RECEIVE_BOARDS:
        return {
            ...state,
            boards: action.boards,
            isFetchingBoards: false,
            boardsError: null
        }
    case actionTypes.RECEIVE_BOARD:
        return {
            ...state,
            content: action.board.content,
            id: action.board.id,
            columns: action.board.columns,
            isFetchingBoard: false,
            boardError: null
        }
    case actionTypes.FETCH_BOARDS_ERROR:
        return {
            ...state,
            isFetchingBoards: false,
            boardsError: action.error
        }
    case actionTypes.FETCH_BOARDS:
        return {
            ...state,
            isFetchingBoards: true,
            boardsError: null
        }
    case actionTypes.FETCH_BOARD:
        return {
            ...state,
            isFetchingBoard: true,
            boardError: null
        }
    case actionTypes.FETCH_BOARD_ERROR:
        return {
            ...state,
            isFetchingBoard: false,
            boardError: action.error
        }
    case actionTypes.DELETE_CARD:
        return {
            ...state,
            columns: state.columns.map(column => {
                if(column.cards.some(card => card.id === action.cardId)) {
                    const index = column.cards.map(card => card.id).indexOf(action.cardId)
                    return {
                        ...column,
                        cards: [
                            ...column.cards.slice(0, index),
                            ...column.cards.slice(index + 1)
                        ]
                    }
                }

                return column
            })
        }
    case actionTypes.DELETE_COLUMN:
        if(state.columns.some(column => column.id === action.columnId)) {
            const index = state.columns.map(column => column.id).indexOf(action.columnId)
            return {
                ...state,
                columns: [
                    ...state.columns.slice(0, index),
                    ...state.columns.slice(index + 1)
                ]
            }
        }
        return state
    case actionTypes.DELETE_BOARD:
        return {
            ...state,
            id: '',
            content: {},
            columns: []
        }
    case actionTypes.UPDATE_CARD:
        return {
            ...state,
            columns: state.columns.map(column => {
                return {
                    ...column,
                    cards: column.cards.map(card => {
                        if(card.id !== action.card.id) return card

                        return {
                            ...card,
                            content: action.card.content,
                            parent: action.card.parent,
                            child: action.card.child,
                            id: action.card.id,
                            column_header: action.card.column_header
                        }
                    })
                }
            })
        }
    case actionTypes.UPDATE_COLUMN:
        return {
            ...state,
            columns: state.columns.map(column => {
                if(action.column.id !== column.id) return column

                return {
                    ...column,
                    content: action.column.content,
                    parent: action.column.parent,
                    child: action.column.child,
                    id: action.column.id
                }
            })
        }
    case actionTypes.REBUILD_COLUMN:
        return {
            ...state,
            columns: state.columns.map(column => {
                if(action.columnId !== column.id) return column

                return {
                    ...column,
                    cards: ((nodes, parent) => {
                        const cards = []
                        while(parent) {
                            const card = nodes.filter(node => node.parent === parent)[0]

                            if(!card) break

                            cards.push(card)
                            parent = cards[cards.length - 1].id
                        }

                        return cards
                    })(column.cards, action.columnId)
                }
            })
        }
    case actionTypes.TOGGLE_EDIT_BOARDS:
        return {
            ...state,
            isEditingBoards: !state.isEditingBoards
        }
    case actionTypes.UPDATE_BOARDS_SEARCH_DEFINITION:
        return {
            ...state,
            sortKey: action.sortKey,
            sortDirection: action.sortDirection,
            groupFilter: action.groupFilter
        }
    case actionTypes.UPDATE_PROCESSING_IMAGE_STATUS:
        if (action.processingImage) {
            return {
                ...state,
                columnsProcessingImage: [...state.columnsProcessingImage, action.columnId]
            }
        }

        return {
            ...state,
            columnsProcessingImage: state.columnsProcessingImage.filter(i => i === action.columnId)
        }
    default:
        return state
    }
}

export default board
