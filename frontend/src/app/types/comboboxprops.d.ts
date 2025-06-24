export type ComboBoxProps = {
    
  listOfElements: string[];
  selected: string | null;
  onSelect: (value: string) => void;
};