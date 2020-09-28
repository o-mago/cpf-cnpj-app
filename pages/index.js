import useSWR from 'swr';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { docMask } from '../utils/masks';
import { docValidator } from '../utils/validators';
import Skeleton from '@material-ui/lab/Skeleton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '50%'
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  horizontalDivider: {
    height: 1,
    margin: 4,
  },
  formControl: {
    margin: 10,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    color: 'red',
    fontSize: 10
  },
  filter: {
    transform: 'translate(0, 10px) scale(1)'
  },
  hidden: {
    visibility: 'hidden'
  },
  listSubHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#ffffff',
    backgroundColor: '#3f51b5'
  },
  paperRoot: {
    overflow: 'hidden'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  listItemText: {
    maxWidth: '50%'
  }
}), {
  name: "MuiCustomStyle"
});

export default function Home() {

  const [searchPayload, setSearchPayload] = useState({
    limit: 8,
    page: 1
  });
  const fetcher = (url, payload) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())
  };

  const { data, error, mutate, isValidating } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/getDocuments`, searchPayload], (url, payload) => fetcher(url, payload));
  const [page, setpage] = useState(1);
  const [limitPerPage, setlimitPerPage] = useState(8);
  const [skelLine, setSkelLine] = useState(Array.from(Array(limitPerPage).keys()));

  const classes = useStyles();

  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [doc, setDoc] = useState('');
  const [validDoc, setValidDoc] = useState(true);

  const handleToggle = async (doc) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateDocument`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({_id: doc._id, blacklist: !doc.blacklist})
    }).then((res) => res.json())
    mutate(data.map(elem => elem._id === doc._id ? {...elem, blacklist: !elem.blacklist} : elem));
  };

  const addDoc = async (event) => {
    if ((doc.length > 0 && !validDoc) || doc.length === 0) {
      setOpenDialog(true);
    } else {
      let formatedDoc = doc.replace(/\D/g,"");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addDocument`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({document: doc})
      }).then((res) => res.json())
      mutate([...data, {document: formatedDoc, blacklist: false}]);
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getDocType = (doc) => {
    if (doc.length === 11) {
      return "CPF";
    } else if (doc.length === 14) {
      return "CNPJ";
    }
  }

  const handleChange = (event) => {
    setFilter(event.target.value);
    setSearchPayload({
      [event.target.value]: true,
      sort: sort,
      page: page,
      limit: limitPerPage,
      search: stringNumber(doc)
    });
    mutate();
  };

  const searchDoc = () => {
    setSearchPayload({...searchPayload, search: stringNumber(doc)});
    mutate();
  }

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setSearchPayload({...searchPayload, sort: event.target.value});
    mutate();
  }

  const checkDoc = (event) => {
    let maskedDoc = docMask(event.target.value);
    setDoc(maskedDoc);
    if(event.target.value.length > 0) {
      setValidDoc(docValidator(maskedDoc));
    } else {
      setValidDoc(true);
    }
  }

  const stringNumber = (str) => {
    return str.replace(/\D/g,"");
  }

  if (error) return <div>failed to load</div>

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
      <Box mt={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
        <Paper component="form" className={classes.paper}>
          <InputBase
            className={classes.input}
            placeholder="Insira o CPF ou CNPJ"
            onChange={checkDoc}
            value={doc}
            error={!validDoc}
            onKeyDown={(e) => e.key === 'Enter' ? searchDoc() : null}
            inputProps={{ 'aria-label': 'filter-cpf-cnpj' }}
          />
          <IconButton className={classes.iconButton} aria-label="search" onClick={searchDoc}>
            <SearchIcon />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={addDoc}>
            <AddIcon />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <FormControl className={classes.formControl}>
            {/* <InputLabel shrink id="filter-label" classes={{ formControl: classes.filter }}>Filtro</InputLabel> */}
            <Select
              labelId="filter-label"
              id="demo-simple-select"
              value={filter}
              displayEmpty
              onChange={handleChange}
              input={<InputBase />}
            >
              <MenuItem value="">
                <em>Filtro</em>
              </MenuItem>
              <MenuItem value={"cpf"}>CPF</MenuItem>
              <MenuItem value={"cnpj"}>CNPJ</MenuItem>
              <MenuItem value={"blacklist"}>Blacklist</MenuItem>
            </Select>
          </FormControl>
          <Divider className={classes.divider} orientation="vertical" />
          <FormControl className={classes.formControl}>
            {/* <InputLabel shrink id="filter-label" classes={{ formControl: classes.filter }}>Filtro</InputLabel> */}
            <Select
              labelId="filter-label"
              id="demo-simple-select"
              value={sort}
              displayEmpty
              onChange={handleSortChange}
              input={<InputBase />}
            >
              <MenuItem value="">
                <em>Ordenar</em>
              </MenuItem>
              <MenuItem value={"asc"}>Crescente</MenuItem>
              <MenuItem value={"desc"}>Decrescente</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>
      {/* {!validDoc ? ( */}
      <Box width="50%">
        <p className={`${classes.errorText} ${validDoc ? classes.hidden : ''}`}>Documento inválido</p>
      </Box>
      <Box mt={5} pr={20} pl={20} className={classes.list}>
        <Paper classes={{ root: classes.paperRoot }}>
          <List
            subheader={
              <ListSubheader classes={{ root: classes.listSubHeader }} id="nested-list-subheader">
                <p classes={{ root: classes.listItem }}>Documentos</p><p>Tipo</p><p>Blacklist</p>
              </ListSubheader>
            }>
            {data ? data.map((doc, index) =>
              <>
                <ListItem key={index} classes={{ root: classes.listItem }}>
                  <Divider className={classes.divider} orientation="horizontal" />
                  <ListItemText id="switch-list-label-number" primary={docMask(doc.document)} classes={{ root: classes.listItemText }} />
                  <ListItemText id="switch-list-label-type" primary={getDocType(doc.document)} classes={{ root: classes.listItemText }} />
                  <ListItemSecondaryAction key={index} classes={{ root: classes.listItemText }}>
                    <Switch
                      edge="end"
                      onChange={() => handleToggle(doc)}
                      checked={doc.blacklist}
                      inputProps={{ 'aria-labelledby': 'switch-list-label-number' }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {data && index !== data.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
              </>) :
              skelLine.map((elem, index) =>
                (<>
                  <ListItem key={index} classes={{ root: classes.listItem }}>
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                  </ListItem>
                  {skelLine && index !== skelLine.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
                </>))
            }
          </List>
        </Paper>
      </Box>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Documento inválido</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Documento não pode ser adicionado
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}