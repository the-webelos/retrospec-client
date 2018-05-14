import * as actionTypes from '../constants/actionTypes'
import update from 'immutability-helper'

const initialState = {
    name: '',
    id: '',
    isFetchingBoard: false,
    isFetchingBoards: false,
    boards: [],
    columns: [
        {
            id: "1",
            name: "column 1",
            cards: [
                {
                    id: "1",
                    text: "Hello",
                    votes: 2
                },
                {
                    id: "2",
                    text: "Hello 2",
                    votes: 5
                },
                {
                    id: "3",
                    text: "Hello 3",
                    votes: 6
                } 
            ]
        },
        {
            id: "2",
            name: "column 2",
            cards: [
                {
                    id: "4",
                    text: "Hello",
                    votes: 2
                },
                {
                    id: "5",
                    text: "Hello 2",
                    votes: 5
                },
                {
                    id: "6",
                    text: "Hello 3",
                    votes: 6
                } 
            ]
        }
    ]
}

const board = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.RECEIVE_CARD:
            return {
                ...state,
                columns: state.columns.map(column => {
                    if(column.id !== action.columnId) return column
                    return {
                        ...column,
                        cards: [...column.cards, action.card]
                    }
                })
            }
        case actionTypes.RECEIVE_COLUMN:
            return {
                ...state,
                columns: [...state.columns, action.column]
            }
        case actionTypes.RECEIVE_MOVED_CARD:
            return {
                ...state,
                columns: state.columns.map((column) => {
                    if(column.id !== action.columnId) return column
                    return update(column, {
                        cards: {
                            $splice: [[action.dragIndex, 1], [action.hoverIndex, 0, column.cards[action.dragIndex]]]
                        }
                    })
                })
            }
        case actionTypes.VOTE_ON_CARD:
            return {
                ...state,
                columns: state.columns.map((column) => {
                    return {
                        ...column,
                        cards: column.cards.map((card) => {
                            if(card.id !== action.cardId) return card
                            return {
                                ...card,
                                votes: card.votes + 1
                            }
                        })
                    }
                })
            }
        case actionTypes.RECEIVE_BOARDS:
            return {
                ...state,
                boards: action.boards,
                isFetchingBoards: false
            }
        case actionTypes.RECEIVE_BOARD:
            return {
                ...state,
                name: action.board.name,
                id: action.board.id,
                columns: action.board.columns,
                isFetchingBoard: false
            }
        case actionTypes.FETCH_BOARDS:
            return {
                ...state,
                isFetchingBoards: true
            }
        case actionTypes.FETCH_BOARD:
            return {
                ...state,
                isFetchingBoard: true
            }
        default:
            return state
    }
}

export default board
