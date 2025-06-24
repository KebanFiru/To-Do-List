export type TimeTableProps = {

    selectedDate: string | null;
    onSelect: (value: string) => void;
    selectedTime: string|null;
    onTimeSelect:(value:string) => void;
    
}