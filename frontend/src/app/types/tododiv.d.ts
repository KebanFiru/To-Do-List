export type ToDoDivProps = {
  
  selectedTodo: number | null;
  selectedDate: string | null;
  triggerRefresh: () => void;
  onDeselect: () => void;  
};
