import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Stack,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';

import ItemCache, { subscribeItemCache, ForceCacheRefresh, getAll } from '../../Sheets/MiddleColumn/Inventory/ItemCache';
import Navbar from '../../Navbar/Navbar';
import EditItem from './ItemEditPanel.jsx';
import { useNotification } from '../../Utils/NotificationContext.jsx';

export function ItemEditPage() {
  const [refreshPage, setRefreshPage] = useState(false);
  const [items, setItems] = useState(() => getAll());
  const { showNotification } = useNotification();
  const [editedItem, setEditedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editedType, setEditedType] = useState(''); // track item type for the panel

  useEffect(() => {
    let unsub = () => {};
    ItemCache.ready()
      .then(() => {
        setItems(getAll());
        unsub = subscribeItemCache(() => setItems(getAll()));
      })
      .catch((e) => console.error('Item cache init failed:', e));
    setRefreshPage(false);
    return () => unsub();
  }, [refreshPage]);

  const grouped = useMemo(() => {
    const byType = { Weapon: [], Armor: [], Tool: [], Other: [] };
    for (const item of items) {
      const type = String(item.type || 'unknown').toLowerCase();
      if (type === 'weapon') byType.Weapon.push(item);
      else if (type === 'armor') byType.Armor.push(item);
      else if (type === 'tool') byType.Tool.push(item);
      else byType.Other.push(item);
    }
    const sortByName = (arr) => arr.slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    return {
      Weapon: sortByName(byType.Weapon),
      Armor: sortByName(byType.Armor),
      Tool: sortByName(byType.Tool),
      Other: sortByName(byType.Other),
    };
  }, [items]);

  async function handleDelete(item) {
    const name = item.name || '';
    if (!name) return;
    const ok = window.confirm(`Delete item "${name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      const token = localStorage.getItem('authToken');

      var payload = { 'itemName': name, 'token': token, 'itemType': item.type || 'None' };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/info/delete_item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.detail}`);
      }
      await ForceCacheRefresh();
      setRefreshPage(true);
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification(`Delete failed: ${err.message}`, 'error');
    }
  }

  async function handleEditClose(success) {
    setEditOpen(false);
    if (success) {
      await ForceCacheRefresh();
      setRefreshPage(true);
    }
  }

  const Section = ({ title, data }) => {
    if (!data.length) return (
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{title}{title === "Misc." ? "" : "s"}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setEditedItem(null); setEditedType(title); setEditOpen(true); }}
          >
            Create New {title}
          </Button>
        </Box>
      </Paper>
    );

    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, bgcolor: (t) => t.palette.action.hover }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">{title}{title === "Misc." ? "" : "s"}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setEditedItem(null); setEditedType(title); setEditOpen(true); }}
          >
            Create New {title}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
          {data.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`${title}-${String(item.name)}`}
              sx={{ '@media (min-width:900px)': { flexBasis: '32.3333%', maxWidth: '33.3333%' } }}
            >
              <Card variant="outlined" sx={{ height: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle1" className='!font-semibold' noWrap title={item.name}>{item.name}</Typography>
                  {item.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      title={item.description}
                    >
                      {item.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    {item.weight !== undefined && (<Typography variant="caption" color="text.secondary">Wt: {item.weight}</Typography>)}
                    {item.cost !== undefined && (<Typography variant="caption" color="text.secondary">Cost: {item.cost}</Typography>)}
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button variant="outlined" color="primary" onClick={() => { setEditedItem(item); setEditedType(title); setEditOpen(true); }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(item)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 3 }, marginTop: '-18px', bgcolor: '#fff', minHeight: '100vh' }}>
        <Stack spacing={2}>
          <Section title="Weapon" data={grouped.Weapon} />
          <Section title="Armor" data={grouped.Armor} />
          <Section title="Tool" data={grouped.Tool} />
          <Section title="Misc." data={grouped.Other} />
        </Stack>
      </Box>

      {/* Single edit dialog at page level */}
      <EditItem onClose={handleEditClose} isOpen={editOpen} itemType={editedType} item={editedItem} />
    </>
  );
}

export default ItemEditPage;