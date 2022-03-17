import { writable } from "svelte/store";
import { v4 as uuid } from 'uuid'
import _find from 'lodash/find'
import _remove from "lodash/remove";
import _cloneDeep from 'lodash/cloneDeep'

const generateId = () => uuid()

const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

const _lists = writable(repoLists)
//$lists 는 js 파일에서 임의로 사용하는 것(스토어 데이터라는 의미로 사용). 자동구독이랑 상관없음
//
_lists.subscribe($lists => {
    window.localStorage.setItem('lists', JSON.stringify($lists))
})

export const lists = {
    subscribe: _lists.subscribe,
    reorder(payload) {
        const { oldIndex, newIndex } = payload
        _lists.update($lists => {
            const clone = _cloneDeep($lists[oldIndex])
            $lists.splice(oldIndex, 1)
            $lists.splice(newIndex, 0, clone)
            return $lists
        })
    },
    add(payload) {
        const { title } = payload
        _lists.update($lists => {
            $lists.push({
                id: generateId(),
                title: title,
                cards: []
            })
            return $lists
        })
    },
    edit(payload) {
        const { listId, title } = payload
        _lists.update($lists => {
            // const foundList = $lists.find((l) => {
            //     return l.id === listId
            // })
            const foundList = _find($lists, { id: listId })
            foundList.title = title
            return $lists
        })
    },
    remove(payload) {
        const { listId } = payload
        _lists.update($lists => {
            _remove($lists, { id: listId })
            return $lists
        })
    }
}

export const cards = {
    reorder(payload) {
        const { oldIndex, newIndex, fromListId, toListId } = payload
        _lists.update($lists => {
            const fromList = _find($lists, { id: fromListId })
            const toList = fromListId === toListId ? fromList : _find($lists, {id:toListId })
            const clone = _cloneDeep(fromList.cards[oldIndex])
            fromList.cards.splice(oldIndex, 1)
            toList.cards.splice(newIndex, 0, clone)
            return $lists
        })
    },
    add(payload) {
        const { listId, title } = payload
        _lists.update($lists => {
            const foundList = _find($lists, { id: listId })
            foundList.cards.push({
                id: generateId(),
                title: title
            })
            return $lists
        })
    },
    edit(payload) {
        const { listId, cardId, title } = payload
        _lists.update($lists => {
            const foundList = _find($lists, { id: listId })
            const foundCard = _find(foundList.cards, { id: cardId })
            foundCard.title = title
            return $lists
        })
    },
    remove(payload) {
        const { listId, cardId} = payload
        _lists.update($lists => {
            const foundList = _find($lists, { id: listId })
            _remove(foundList.cards, { id: cardId })
            return $lists
        })
    }
}