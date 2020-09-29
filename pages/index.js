import useSWR from 'swr';
import { useState, useEffect } from 'react';
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
import LinearProgress from '@material-ui/core/LinearProgress';

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
  fixed: {
    position: 'fixed',
    zIndex: 2,
    top: 0
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
    fontSize: 10,
    display: 'inline-block',
    padding: '0 3px'
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
  },
  linarLoad: {
    position: 'fixed',
    top: 0,
    width: '100%'
  }
}), {
  name: "MuiCustomStyle"
});

export default function Home() {

  const [searchPayload, setSearchPayload] = useState({
    limit: 10,
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
  // const [page, setPage] = useState(1);
  const [limitPerPage, setlimitPerPage] = useState(10);
  const [skelLine, setSkelLine] = useState(Array.from(Array(limitPerPage).keys()));

  const [infiniteScroll, setInfiniteScroll] = useState(false);

  const [docData, setDocData] = useState({docs: [], lastPage: 0});

  const [dialog, setDialog] = useState({
    title: '',
    text: ''    
  })

  const [updateLoad, setUpdateLoad] = useState(false);

  const classes = useStyles();

  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [doc, setDoc] = useState('');
  const [validDoc, setValidDoc] = useState(true);

  const handleScroll = () => {
    // To get page offset of last user
    const lastDocLoaded = document.querySelector(
      ".MuiList-root > .MuiListItem-container:last-child"
    )
    if (lastDocLoaded && !infiniteScroll && !updateLoad) {
      // // const lastDocLoadedOffset = lastDocLoaded.offsetTop + lastDocLoaded.clientHeight;
      // const lastDocLoadedOffset = lastDocLoaded.getBoundingClientRect().top + window.scrollY;
      // const pageOffset = window.pageYOffset + window.innerHeight;
      const pageOffset = Math.ceil(window.innerHeight + window.scrollY);
      // // Detects when user scrolls down till the last user
      console.log("test1", window.pageYOffset, window.innerHeight, pageOffset);
      console.log("test2", document.body.offsetHeight);
      if (pageOffset >= document.body.offsetHeight) {
        // Stops loading
        // console.log("test3", page, docData);
        if (searchPayload.page < docData.lastPage) {
          // setPage(page+1);
          setInfiniteScroll(true);
          setSearchPayload({...searchPayload, page: searchPayload.page+1});
          mutate();
          // Trigger fetch
          // const query = router.query
          // query.page = parseInt(userData.curPage) + 1
          // router.push({
          //   pathname: router.pathname,
          //   query: query,
          // })
        }
      }
    }
  }

  useEffect(() => {
    if(data) {
      if(updateLoad) {
        setUpdateLoad(false);
      }
      if(infiniteScroll) {
        console.log("llkllklkl",{docs: [...docData.docs, ...data.docs], lastPage: data.lastPage});
        setInfiniteScroll(false);
        setDocData({docs: [...docData.docs, ...data.docs], lastPage: data.lastPage});
      } else {
        console.log("sadsdas", data);
        setDocData(data);
      }
    }
  }, [data]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  });

  const handleToggle = async (doc) => {
    setUpdateLoad(true);
    setDocData({docs: docData.docs.map(elem => elem._id === doc._id ? {...elem, blacklist: !elem.blacklist} : elem), lastPage: docData.lastPage});
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateDocument`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({_id: doc._id, blacklist: !doc.blacklist})
    }).then((res) => res.json());
    setUpdateLoad(false);
  };

  const addDoc = async (event) => {
    if ((doc.length > 0 && !validDoc) || doc.length === 0) {
      setDialog({
        title: 'Documento inválido',
        text: 'Documento não pode ser adicionado'
      });
      setOpenDialog(true);
    } else {
      setUpdateLoad(true);
      let formatedDoc = doc.replace(/\D/g,"");
      if(searchPayload.page === docData.lastPage) {
        setDocData({docs: [...docData.docs, {document: formatedDoc, blacklist: false}], lastPage: docData.lastPage});
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addDocument`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({document: doc})
      }).then((res) => res.json());
      setUpdateLoad(false);
      setDialog({
        title: 'Documento adicionado',
        text: 'Documento adicionado com sucesso'
      });
      setOpenDialog(true);
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSearchPayload({
      filter: [event.target.value],
      sort: sort,
      page: 1,
      limit: limitPerPage,
      search: stringNumber(doc)
    });
    mutate();
  };

  const searchDoc = () => {
    setSearchPayload({...searchPayload, page: 1, search: stringNumber(doc)});
    mutate();
  }

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setSearchPayload({...searchPayload, page: 1, sort: event.target.value});
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
      {updateLoad ? <LinearProgress className={classes.linarLoad} /> : <></>}
      <Box mt={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%" className={classes.fixed}>
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
              onChange={handleFilterChange}
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
        <Box width="50%">
          <Paper component="form" className={`${classes.errorText} ${validDoc ? classes.hidden : ''}`}>
            <span>Documento inválido</span>
          </Paper>
        </Box>
      </Box>
      <Box mt={15} pr={20} pl={20} mb={10} className={classes.list}>
        <Paper classes={{ root: classes.paperRoot }}>
          <List
            subheader={
              <ListSubheader classes={{ root: classes.listSubHeader }} id="nested-list-subheader">
                <p classes={{ root: classes.listItem }}>Documentos</p><p>Tipo</p><p>Blacklist</p>
              </ListSubheader>
            }>
            {(!(!infiniteScroll && !data)) && docData && docData.docs ? docData.docs.map((doc, index) =>
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
                {docData && docData.docs && index !== docData.docs.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
              </>) : <></>}
              {!data ? infiniteScroll ?
              (<>
                <ListItem key={1} classes={{ root: classes.listItem }}>
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                  <Skeleton variant="text" width="20%" />
                </ListItem>
              </>) :
              skelLine.map((elem, index) =>
                (<>
                  <ListItem key={index} classes={{ root: classes.listItem }}>
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                    <Skeleton variant="text" width="20%" />
                  </ListItem>
                  {skelLine && index !== skelLine.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
                </>)) : <></>
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
        <DialogTitle id="alert-dialog-slide-title">{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {dialog.text}
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