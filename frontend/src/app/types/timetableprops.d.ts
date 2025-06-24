export type TimeTableProps = {
  selectedDate: string | null;
  onSelectedTodo: (value: number) => void;
  refreshKey: number; // NEW to re-fetch todos when data changes
};
