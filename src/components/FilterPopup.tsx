import { ListMoviesParam } from "@/types"
import { Paper, Popover } from "@mui/material";

type FilterPopupProps = {
    currentFilters: ListMoviesParam;
    onFilterChange: (key: keyof ListMoviesParam, value: any) => void;
    anchorEl: Element | null;
    onClose: () => void;
}

export function FilterPopup(props: FilterPopupProps) {
    const {currentFilters, onFilterChange, anchorEl, onClose} = props;
    
    return (<Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
        <Paper sx={{p: 2}}>

        </Paper>
    </Popover>)
}