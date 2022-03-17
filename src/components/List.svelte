<script>
    import CreateCard from "~/components/CreateCard.svelte";
    import ListTitle from "~/components/ListTitle.svelte";
    import Card from "~/components/Card.svelte";
    import { onMount, onDestroy } from "svelte";
    import { cards } from "~/store/list";
    import Sortable from "sortablejs";

    export let list;
    export let sortableLists;

    let sortableCards;
    let cardsEl;

    function disableSortable(event) {
        console.log(event);
        sortableLists.option("disabled", event.detail);
        sortableCards.option("disabled", event.detail);
    }

    onMount(() => {
        sortableCards = new Sortable(cardsEl, {
            group: "My cards", // 한 목록에서 다른 목록으로 요소를 끌어오려면 두 목록의 그룹 값이 같아야 한다
            handle: ".card", // 드래그 핸들이 될 요소의 선택자를 입력
            delay: 50, // 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간 추가
            animation: 0, // 정렬할 때 애니메이션 속도
            forceFallback: true, // 다양한 환경의 일관된 drag&drop을 위해 html5 기본 dnd 동작을 무시
            onEnd(event) {
                console.log(event);
                cards.reorder({
                    fromListId: event.from.dataset.listId,
                    toListId: event.to.dataset.listId,
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex,
                });
            },
        });
    });
</script>

<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle {list} on:editMode={disableSortable} />
            <p>
                {list.cards.length} cards
            </p>
        </div>
        <div data-list-id={list.id} class="list_cards" bind:this={cardsEl}>
            {#each list.cards as card (card.id)}
                <Card {card} listId={list.id} on:editMode={disableSortable} />
            {/each}
        </div>
        <CreateCard listId={list.id} on:editMode={disableSortable} />
    </div>
</div>

<style lang="scss">
    :global(.list.sortable-ghost) {
        position: relative;
        opacity: 0.2;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 4px;
        }
    }
    :global(.list.sortable-chosen) {
        cursor: move;
    }
    .list {
        word-break: break-all;
        display: inline-block;
        width: 290px;
        height: 100%;
        box-sizing: border-box;
        font-size: 16px;
        white-space: normal;
        margin: 0 4px;
        line-height: 20px;

        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background: #ebecf0;
            border-radius: 4px;
            .list__heading {
                margin-bottom: 10px;
                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
            }
            .list__cards {
                overflow-x: hidden;
                overflow-y: auto;
                margin-bottom: 10px;
            }
        }
    }
</style>
