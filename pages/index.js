import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
// import { getSortedPostsData } from '../lib/posts'
// import useSWR from 'swr'
import { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import DirectionsIcon from '@material-ui/icons/Directions';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
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

// import NotInterestedIcon from '@material-ui/icons/NotInterested';

// const CustomInputLabel = withStyles(theme => ({
//   formControl: {
//     transform: 'translate(0, 10px) scale(1)'
//   }
// }))(InputLabel);

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

export default function Home({ allPostsData }) {
  // const { data, error } = useSWR('/api/user', fetch);
  const classes = useStyles();
  const { data, error } = {
    data: {
      documents: [{
        number: "15789648212",
        blacklist: true,
      }, {
        number: "13647852425",
        blacklist: false
      }, {
        number: "13468264192765",
        blacklist: false
      }]
    },
    error: false
  };

  const [filter, setFilter] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [checked, setChecked] = useState(data.documents.reduce((acc, elem) => {
    if (elem.blacklist) {
      acc.push(elem.number);
    }
    return acc;
  }, []));

  const [doc, setDoc] = useState('');
  const [validDoc, setValidDoc] = useState(true);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const addDoc = (event) => {
    if(!validDoc) {
      setOpenDialog(true);
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getDocType = (doc) => {
    console.log(doc, doc.length);
    if(doc.length === 11) {
      return "CPF";
    } else if(doc.length === 14) {
      return "CNPJ";
    }
  }

  // const getListItems = (documents) => {
  //   return documents.reduce((acc, doc, index) => {
  //     let show = false;
  //     switch (filter) {
  //       case 'CPF':
  //         if (doc.number.length === 11) {
  //           show = true;
  //         } else {
  //           show = false;
  //         }
  //       case 'CNPJ':
  //         if (doc.number.length === 14) {
  //           show = true;
  //         } else {
  //           show = false;
  //         }
  //       case 'Blacklist':
  //         if (doc.blacklist) {
  //           show = true;
  //         } else {
  //           show = false;
  //         }
  //       default:
  //         show = true;
  //     }

  //     console.log("sadsad", doc);
      
  //     if(show) {
  //       acc.push((<>
  //         <ListItem key={index}>
  //           <ListItemText id="switch-list-label-wifi" primary={docMask(doc.number)} />
  //           <ListItemSecondaryAction>
  //             <Switch
  //               edge="end"
  //               onChange={handleToggle(doc.number)}
  //               checked={checked.indexOf(doc.number) !== -1}
  //               inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
  //             />
  //           </ListItemSecondaryAction>
  //           <Divider className={classes.divider} orientation="horizontal" />
  //         </ListItem>
  //         {index !== data.documents.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
  //       </>))
  //     }
  //     return acc;
  //   }, []);
  // };

  const [listedDocuments, setListedDocuments] = useState(data.documents);

  const handleChange = (event) => {
    setFilter(event.target.value);
    // setListedDocuments(data.documents);
  };

  const handleSortChange = () => {
    
  }

  const checkDoc = (event) => {
    let maskedDoc = docMask(event.target.value);
    setDoc(maskedDoc);
    setValidDoc(docValidator(maskedDoc));
  }

  

if (error) return <div>failed to load</div>
if (!data) return <div>loading...</div>

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
          inputProps={{ 'aria-label': 'filter-cpf-cnpj' }}
        />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
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
            <MenuItem value={"CPF"}>CPF</MenuItem>
            <MenuItem value={"CNPJ"}>CNPJ</MenuItem>
            <MenuItem value={"Blacklist"}>Blacklist</MenuItem>
          </Select>
        </FormControl>
        <Divider className={classes.divider} orientation="vertical" />
        <FormControl className={classes.formControl}>
          {/* <InputLabel shrink id="filter-label" classes={{ formControl: classes.filter }}>Filtro</InputLabel> */}
          <Select
            labelId="filter-label"
            id="demo-simple-select"
            value={filter}
            displayEmpty
            onChange={handleSortChange}
            input={<InputBase />}
          >
            <MenuItem value="">
              <em>Ordenar</em>
            </MenuItem>
            <MenuItem value={"Crescente"}>Crescente</MenuItem>
            <MenuItem value={"Decrescente"}>Decrescente</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Box>
    {/* {!validDoc ? ( */}
    <Box width="50%">
      <p className={`${classes.errorText} ${validDoc ? classes.hidden : ''}`}>Documento inválido</p>
    </Box>
    <Box mt={5} pr={20} pl={20} className={classes.list}>
      <Paper classes={{root: classes.paperRoot}}>
        <List
          subheader={
            <ListSubheader classes={{ root: classes.listSubHeader }} id="nested-list-subheader">
              <p classes={{root: classes.listItem}}>Documentos</p><p>Tipo</p><p>Blacklist</p>
            </ListSubheader>
          }>
          {data.documents.map((doc, index) => 
          <>
          <ListItem key={index} classes={{root: classes.listItem}}>
            <ListItemText id="switch-list-label-number" primary={docMask(doc.number)} classes={{root: classes.listItemText}} />
            <ListItemText id="switch-list-label-type" primary={getDocType(doc.number)} classes={{root: classes.listItemText}} />
            <ListItemSecondaryAction key={index} classes={{root: classes.listItemText}}>
              <Switch
                edge="end"
                onChange={handleToggle(doc.number)}
                checked={checked.indexOf(doc.number) !== -1}
                inputProps={{ 'aria-labelledby': 'switch-list-label-number' }}
              />
            </ListItemSecondaryAction>
            <Divider className={classes.divider} orientation="horizontal" />
          </ListItem>
          {index !== data.documents.length - 1 ? (<Divider className={classes.horizontalDivider} orientation="horizontal" />) : (<></>)}
        </>)}
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
  // <Layout home>
  //   <Head>…</Head>
  //   <section className={utilStyles.headingMd}>…</section>
  //   <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
  //     <h2 className={utilStyles.headingLg}>Blog</h2>
  //     <ul className={utilStyles.list}>
  //       {allPostsData.map(({ id, date, title }) => (
  //         <li className={utilStyles.listItem} key={id}>
  //           {title}
  //           <br />
  //           {id}
  //           <br />
  //           {date}
  //         </li>
  //       ))}
  //     </ul>
  //   </section>
  // </Layout>
)
}

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // props for your component
//     }
//   }
// }

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }
// }