<script>
    import Sortable from "sortablejs";
    import { onMount } from "svelte";
    import List from "~/components/List.svelte";
    import CreateList from "~/components/CreateList.svelte";
    import { lists } from "~/store/list";
    import ListTitle from "./ListTitle.svelte";

    let listsEl; //
    let sortableLists; // List 정렬을 위한 SortableJS 인스턴스를 지정

    // lists 스토어의 값($lists)이 변경되면 아래 반으성 구문이 실행됨
    // $: {
    //     console.log($lists);
    // }

    onMount(() => {
        sortableLists = new Sortable(listsEl, {
            group: "My Lists", // 한 목록에서 다른 목록으로 요소를 끌어오려면 두 목록의 그룹 값이 같아야 한다
            handle: ".list", // 드래그 핸들이 될 요소의 선택자를 입력
            delay: 50, // 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간 추가
            animation: 0, // 정렬할 때 애니메이션 속도
            forceFallback: true, // 다양한 환경의 일관된 drag&drop을 위해 html5 기본 dnd 동작을 무시
            onEnd(event) {
                console.log(event);
                lists.reorder({
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex,
                });
            },
        });
    });
</script>

<div class="list-container">
    <div class="lists" bind:this={listsEl}>
        {#each $lists as list (list.id)}
            <List {list} {sortableLists} />
        {/each}
    </div>
    <CreateList />
</div>

<style lang="scss">
    .list-container {
        width: 100vw;
        height: calc(100vh - 40px);
        padding: 30px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        font-size: 0;
        .lists {
            display: inline-block;
            height: 100%;
            white-space: nowrap;
            font-size: 0;
        }
    }
</style>
