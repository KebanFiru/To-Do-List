export type TimeTableProps = {

    selectedDate: string | null;
    onSelect: (value: string) => void;
    selectedTodo: number|null;
    onSelectedTodo:(value:number) => void;
}