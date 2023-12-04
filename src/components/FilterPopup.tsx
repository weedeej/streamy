import { MovieQuality, SortList } from "@/enums";
import { ListMoviesParam } from "@/types"
import { Close } from "@mui/icons-material";
import { Checkbox, FormControlLabel, IconButton, ListItem, ListItemText, MenuItem, Paper, Popover, Radio, RadioGroup, Rating, Select, Stack, TextField, Typography } from "@mui/material";

type FilterPopupProps = {
    currentFilters: ListMoviesParam;
    onFilterChange: (key: keyof ListMoviesParam, value: any) => void;
    anchorEl: Element | null;
    onClose: () => void;
}

export function FilterPopup(props: FilterPopupProps) {
    const { currentFilters, onFilterChange, anchorEl, onClose } = props;
    const { order_by, quality, sort_by, limit, minimum_rating } = currentFilters;

    return (<Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Paper sx={{ p: 2 }}>
            <Stack direction="column" gap={1}>
                <Stack direction="column" gap={0}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" fontWeight={700}>
                            Order By
                        </Typography>
                        <IconButton size="small" onClick={onClose}>
                            <Close sx={{width: 16, height: 16}}/>
                        </IconButton>
                    </Stack>
                    <Stack direction="row" gap={2}>
                        <RadioGroup value={order_by} onChange={(e, v) => onFilterChange("order_by", v)} row>
                            <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
                            <FormControlLabel value="desc" control={<Radio />} label="Descending" />
                        </RadioGroup>
                    </Stack>
                </Stack>
                <Stack direction="column" gap={0}>
                    <Typography variant="body2" fontWeight={700}>
                        Quality
                    </Typography>
                    <Select size="small" value={quality} onChange={(e) => onFilterChange("quality", e.target.value)}>
                        {
                            Object.values(MovieQuality).map((v) => <MenuItem value={v}>{v}</MenuItem>)
                        }
                    </Select>
                </Stack>
                <Stack direction="column" gap={0}>
                    <Typography variant="body2" fontWeight={700}>
                        Sort By
                    </Typography>
                    <Select size="small" value={sort_by} onChange={(e) => onFilterChange("sort_by", e.target.value)}>
                        {
                            Object.entries(SortList).map(([k, v]) => <MenuItem value={v}>{k}</MenuItem>)
                        }
                    </Select>
                </Stack>
                <Stack direction="column" gap={0} flexGrow={1} flexBasis={0}>
                    <Typography variant="body2" fontWeight={700}>
                        Results Limit
                    </Typography>
                    <TextField value={limit} type="number" size="small" onChange={(e) => onFilterChange("limit", e.target.value)} />
                </Stack>
                <Stack direction="column" gap={0}>
                    <Typography variant="body2" fontWeight={700}>
                        Minimum Rating
                    </Typography>
                    <Rating value={minimum_rating} max={10} sx={{ justifyContent: "center" }} onChange={(e, v) => {
                        onFilterChange("minimum_rating", v! - 1)
                        // TOOD: FIX RATING
                    }} />
                </Stack>
            </Stack>
        </Paper>
    </Popover>)
}