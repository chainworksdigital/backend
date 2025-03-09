import {
    Button,
    List,
    TextField,
    CssBaseline,
    Drawer,
    ListItem,
    ListItemText,
    Hidden,
    IconButton,
    Divider,
    createTheme,
    ThemeProvider,
    Select,
    CardContent,
    CardActions,
    Card,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    Checkbox,
    Radio,
    Grid,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Box,
    Chip,
    Switch,
    Collapse,
    FormHelperText,
    Paper,
    Toolbar,
    AppBar,
  } from "@mui/material";
  import { margin, styled } from "@mui/system";
  import { border, fontSize } from "@mui/system";
  
  const drawerWidth = 275;
  
  // div
  export const RootDiv = styled("div")(({ theme }) => ({
    // flexGrow: 1,
    minHeight: 800,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      minHeight: window.innerHeight,
      "align-items": "center",
    },
  }));
  
  export const CustomStyledButton = styled(Button)(({ theme }) => ({
    backgroundColor:  "#42B7FA",
    color: "black",
    textTransform: "none",
    boxShadow: "none",
    border: "1px solid black",
    padding: "10px 15px",
    width: "22.5vw",
    borderRadius: 1,
    "&:hover": {
      boxShadow: "5px 5px black",
      backgroundColor: "#42B7FA",
    }
  }));
  
  
  export const NavBarRootDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row", // Default layout for larger screens
    justifyContent: "space-between", // Space items out for larger screens
    alignItems: "center",
    width: "100%",
    padding: "0 1em", // Padding for spacing
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column", // Stack items vertically for medium screens
      justifyContent: "center", // Center items
      alignItems: "center", // Center items
      padding: "1em", // Add padding for medium screens
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column", // Always column layout on mobile
      justifyContent: "center", // Center items
      alignItems: "center", // Center items
      padding: "0.5em", // Smaller padding for mobile devices
    },
  }));
  
  
  export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    display: "flex",
    flexDirection: "row", // Default layout for larger screens
    justifyContent: "center", // Center navbar content
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    boxShadow: "none",
    borderRadius: 5,
    padding: "0.5em 1em",
    width: "100%",
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column", // Stack items vertically for medium screens
      padding: "1em", // Adjust padding
      borderRadius: 0, // Remove border radius for medium screens
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column", // Always column layout on mobile
      padding: "0.5em", // Adjust padding for small devices
      justifyContent: "center", // Center items
      alignItems: "center", // Center items
    },
  }));
  
  export const RootCenterDiv = styled("div")(({ theme }) => ({
    marginTop: 5,
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      marginTop: 0,
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      // zIndex: "-10",
    },
  }));
  export const FiftyDiv = styled("div")(({ theme }) => ({
    width: "50%",
    overflowX: "auto",
    marginRight: 7,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      justifyContent: "center",
      display: "flex",
    },
  }));
  // export const ThirtyDiv = styled("div")(({ theme }) => ({
  //   width: "33%",
  //   overflowX: "auto",
  //   marginRight: 7,
  //   [theme.breakpoints.down("lg")]: {
  //     display: "flex",
  //     width: "100%",
  //     justifyContent: "center",
  //     flexDirection: "column",
  //   },
  // }));
  export const ThirtyDiv = styled("div")(({ theme }) => ({
    width: "33%",
     marginRight: 7,
    [theme.breakpoints.down("lg")]: {
      width: "100%",
      marginRight: 0,
      justifyContent: "center",
      flexDirection: "column",
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: 0,
    },
  }));
   
  
  export const HideInMobileDiv = styled("div")(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      // width:"200px",
      flexDirection: "column",
      alignItems: "center",
      padding: "10px",
      margin: "0%",
    },
  }));
  export const BasicDiv = styled("div")(({ theme }) => ({
    display: "flex",
    marginRight: "10px",
    flexDirection: "column",
    width: "94%",
     backgroundColor: "#F4F4F4",
    height: "auto",
    marginTop: "10px",
    overflow: "auto",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  
    // Default for small devices
    marginRight: "10px",
    width: "94%",
  
    // Add responsiveness
    [theme.breakpoints.up("sm")]: {
      width: "98%", // 80% width for tablets
      marginRight: "auto", // Center align
      marginLeft: "auto",
    },
    [theme.breakpoints.up("md")]: {
      width: "95%", // 60% width for medium screens
    },
    [theme.breakpoints.up("lg")]: {
      width: "93%", // 50% width for large screens
    },
  }));
  
  export const TitleDiv = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    color: "#1f5256",
    marginTop: "12px",
  }));
  export const HeaderDiv = styled("div")(({ theme }) => ({
    width: "100%",
    backgroundColor: "#f3f3f3",
    height: "50px",
    borderRadius: 5,
    marginTop: 0,
    display: "flex",
    justifyContent: "center",
  }));
  export const ListDiv = styled("div")(({ theme }) => ({
    margin: 20,
  }));
  export const ListHeaderDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    marginBottom: "11px",
    marginTop: "3px",
    justifyContent: "space-between",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const TestHeaderDiv = styled("div")(({ theme }) => ({
    top: 0,
    color: "black",
    backgroundColor: "white",
    width: "100%",
    height: "25vh",
    // paddingTop: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    marginBottom: 13,
    [theme.breakpoints.down("md")]: {
      height: "44vh",
    },
  }));
  export const FilterDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 7,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const BulkDiv = styled("div")(({ theme }) => ({
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      marginTop: "45px",
      alignItems: "flex-end",
    },
  }));
  export const ColumnFlexDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }));
  export const RowFlexDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }));
  export const RowToColumnFlexDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const DropDownDiv = styled("div")(({ theme }) => ({
    position: "relative",
    left: drawerWidth + 26,
    width: "calc(100% - 275px)",
    // borderBottom: "2px solid #1f5156",
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    paddingBottom: "1%",
    [theme.breakpoints.down("md")]: {
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  export const ButtonDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  }));
  export const GeogebraParentDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    // marginLeft: "1vw",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const GeogebraDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // marginLeft: "4.5vw",
    marginRight: "1vw",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0 !important",
    },
  }));
  export const GeogebraTextDiv = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    // marginLeft: "5.5vw",
  }));
  export const GeogebraOptionDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginLeft: "1vw",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0",
    },
  }));
  export const GeogebraOptionTextDiv = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    margin: "3vh 2vw -2vh",
  }));
  export const ResultAreaDiv = styled("div")(({ theme }) => ({
    display: "flex",
    marginLeft: "5vw",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  }));
  export const InstructorsSolutionAreaDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    marginTop: "7px",
    marginBottom: "7px",
    marginLeft: "5vw",
    marginRight: "10px",
    // alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  }));
  export const OptionAreaDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    marginBottom: "20px",
    marginLeft: "2.5vw",
    marginRight: "10px",
    // alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  }));
  export const OptionDisplayDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // width: imageExists ? "70%" : "100%",
    overflowX: "auto",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      width: "100%",
    },
  }));
  export const AssessmentOptionDisplayDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    // width: imageExists ? "70%" : "100%",
    // overflowX: "auto",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      width: "100%",
    },
  }));
  export const OptionLatexDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    // width: "90%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  
  export const OptionPngDiv = styled("div")(({ theme }) => ({
    marginLeft: "10px",
    marginRight: "10px",
    overflowX: "auto",
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  export const OptionNumberDiv = styled("div")(({ theme }) => ({
    display: "flex",
    width: "fit-content",
    overflowX: "hidden",
    [theme.breakpoints.down("md")]: {
      // width: "11.5%",
    },
  }));
  export const QuestionDiv = styled("div")(({ theme }) => ({
    marginBottom: "10px",
    marginRight: "10px",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      marginRight: "0px",
    },
  }));
  export const QuestionPngDiv = styled("div")(({ theme }) => ({
  
    overflowX: "auto",
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  export const QuestionPngDiv1 = styled("div")(({ theme }) => ({
  
    // overflowX: "auto",
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  export const QuestionDisplayDiv = styled("div")(({ theme }) => ({
    // width: imageExists ? "70%" : "100%",
    // overflowX: "auto",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  export const QuestionMultiLanguageDiv = styled("div")(({ theme }) => ({
    marginRight: "5vw",
    marginTop: 13,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      marginRight: "0",
      marginTop: 3,
      flexDirection: "column",
    },
  }));
  export const TextAreaHeader = styled("div")(({ theme }) => ({
    position: "relative",
    left: drawerWidth,
    marginTop: "20px",
    paddingBottom: "1%",
    [theme.breakpoints.down("md")]: {
      left: "0px",
    },
  }));
  export const TextAreaDiv = styled("div")(({ theme }) => ({
    position: "relative",
    left: drawerWidth + 26,
    width: "calc(100% - 275px)",
    // borderBottom: "2px solid #1f5156",
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    paddingBottom: "1%",
    [theme.breakpoints.down("md")]: {
      left: "0px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  export const LeftDrawerDiv = styled("div")(({ theme }) => ({
    marginLeft: drawerWidth + 26,
    [theme.breakpoints.down("md")]: {
      marginLeft: 30,
    },
  }));
  export const ToolBarDiv = styled("div")(({ theme }) => ({
    minHeight: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "z-index": 10,
    width: drawerWidth,
  }));
  export const TestWrapperDiv = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginLeft: "7px",
    marginRight: "7px",
    width: "fit-content",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      height: "min-content",
      width: "100%",
    },
  }));
  export const TestNavDiv = styled("div")(({ theme }) => ({
    position: "absolute",
    right: "4vw",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 13,
    marginLeft: "13px",
    marginRight: "13px",
    [theme.breakpoints.down("md")]: {
      position: "relative",
    },
  }));
  export const InstructionsDiv = styled("div")(({ theme }) => ({
    margin: "1vh 10px 10px 1vw",
    display: "flex",
    justifyContent: "space-around",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const SelectDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    // margin: "20px 7px 0px 7px",
    justifyContent: "space-around",
    width: "350px",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
    },
  }));
  export const SchoolDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    margin: "5px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const TimerDiv = styled("div")(({ theme }) => ({
    display: "flex",
    paddingTop: "5px",
    marginLeft: "14px",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      // marginLeft: "10px",
    },
    [theme.breakpoints.down("md")]: {
      // marginLeft: "-59px",
      // marginTop: "22vh",
    },
  }));
  export const TestMarksDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "5px",
    [theme.breakpoints.down("md")]: {
      // marginBottom: "33vh",
      // marginLeft: "-81px",
    },
  }));
  export const QuestionNumberDiv = styled("div")(({ theme }) => ({
    width: "20vw",
    right: "5vw",
    [theme.breakpoints.down("md")]: {
      width: "inherit",
    },
  }));
  export const WrapTextDiv = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      overflowX: "scroll",
      alignItems: "flex-start",
    },
  }));
  // button
  const buttonStyles = {
    width: "fit-content",
    margin: "7px 7px",
    position: "sticky",
    fontSize: "15px",
    textTransform: "initial",
    border: "1px solid black",
    // backgroundColor: "#1f5156",
    // color: "white",
    backgroundColor: "#42B7FA",
    color: "black",
    // "&:hover": {
    //   backgroundColor: "#f5b921",
    //   color: "black",
    // },
    "&:hover": {
      boxShadow:"5px 5px black",
      backgroundColor: "#42B7FA",
    }
   
   
  };
  
  
  
  export const StyledEditButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    "&:disabled": {
      backgroundColor: "#f3f3f3",
      color: "grey",
    },
  }));
  export const StyledButton = styled(Button)(({ theme }) => ({
    // width: "100%",
    height: "6vh",
    margin: "7px",
    marginRight: "7px",
    fontSize: "clamp(10px, 2vw, 16px)", // Responsive font size
    textTransform: "capitalize",
    border: "1px solid black",
    backgroundColor: "#42B7FA",
    color: "black",
    borderRadius: "8px",
    "&:hover": {
      boxShadow: "5px 5px black",
      backgroundColor: "#42B7FA",
    },
    // Media queries for additional responsiveness
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px", // Smaller font size for small screens
      padding: "8px 12px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "16px", // Default font size for medium and larger screens
      padding: "10px 16px",
    },
  }));
  
  export const StyledButton2 = styled(Button)(({ theme }) => ({
    // width: "100%",
    height: "5vh",
    margin: "7px",
    marginRight: "7px",
    fontSize: "clamp(10px, 2vw, 16px)", // Responsive font size
    textTransform: "capitalize",
    border: "1px solid black",
    backgroundColor: "inherit",
    color: "black",
    boxShadow:"none",
    borderRadius: "4px",
    "&:hover": {
      boxShadow: "5px 5px black",
      backgroundColor: "#42B7FA",
    },
    // Media queries for additional responsiveness
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px", // Smaller font size for small screens
      padding: "8px 12px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "16px", // Default font size for medium and larger screens
      padding: "10px 16px",
    },
  }));
  
  export const StyledButton3 = styled(Button)(({ theme }) => ({
    // width: "100%",
    height: "4vh",
    margin: "7px",
    marginRight: "7px",
    fontSize: "clamp(10px, 2vw, 13px)", // Responsive font size
    textTransform: "capitalize",
    border: "1px solid black",
    backgroundColor: "inherit",
    color: "black",
    boxShadow:"none",
    borderRadius: "50px",
    "&:hover": {
      boxShadow: "5px 5px black",
      color:"white",
      backgroundColor: "black",
     },
    // Media queries for additional responsiveness
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px", // Smaller font size for small screens
      padding: "8px 12px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "16px", // Default font size for medium and larger screens
      padding: "10px 16px",
    },
  }));
  
  export const subButtonStyle = styled(Button)(({ theme }) => ({
    ...buttonStyles,
  }));
  export const StyledActiveButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    color: "black",
    backgroundColor: "#f5b921",
  }));
  const submitButtonStyles = {
    color: "black",
    // backgroundColor: "#1f5156",
    fontWeight: "bold",
    backgroundColor: "#eb2d53",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#f5b921",
      color: "black",
    },
  };
  export const StyledSubmitButton = styled(Button)(({ theme }) => ({
    ...submitButtonStyles,
    [theme.breakpoints.down("md")]: {
      alignItems: "left",
    },
  }));
  export const StyledSubmitBottomButton = styled(Button)(({ theme }) => ({
    ...submitButtonStyles,
    padding: "1vh 1vw",
    margin: "2vh 0vw",
  }));
  export const StyledSubmitTopButton = styled(Button)(({ theme }) => ({
    ...submitButtonStyles,
    position: "absolute",
    right: "4vw",
    top: "23vh", //make chandes in back button and testNav css if any changes here
    paddingLeft: "1vw",
    paddingRight: "1vw",
    marginLeft: "1vw",
    marginRight: "1vw",
    [theme.breakpoints.down("md")]: {
      top: "40vh",
    },
  }));
  export const StyledSubmitTopButtonInTEst = styled(Button)(({ theme }) => ({
    ...submitButtonStyles,
    // right: "4vw",
    // top: "23vh", //make chandes in back button and testNav css if any changes here
    paddingLeft: "1vw",
    paddingRight: "1vw",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      top: "40vh",
    },
  }));
  export const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  }));
  
  // nav and drawer and appbar
  export const StyledNav = styled("nav")(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "columns",
    width: drawerWidth,
    [theme.breakpoints.down("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  }));
  export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    textAlign: "left",
    // backgroundColor: "#1f5156",
    color: "#f5b921",
    width: drawerWidth,
    "z-index": 10,
    position: "absolute",
    borderRight: "0px solid #1f5156",
    [theme.breakpoints.down("md")]: {
      top: "0px",
      position: "absolute",
    },
  }));
  export const DrawerDiv = styled("div")(({ theme }) => ({
    // backgroundColor: "#1f5156",
    width: drawerWidth,
    "overflow-x": "scroll",
    "overflow-y": "hidden",
    paddingBottom: "7px",
  }));
  
  
  
  // text
  export const StyledTextField = styled(TextField)(({ theme }) => ({
    width: "350px",
    margin: "10px 7px 0px 7px",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
      margin: "5px 0px 5px 0px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    }
  }));
  export const StyledTextField1 = styled(TextField)(({ theme }) => ({
    width: "160px",
    margin: "0px 7px 10px 7px",
    marginLeft: "10px",
    fontsize: "16px",
    [theme.breakpoints.down("md")]: {
      width: "150px",
      margin: "5px 0px 5px 0px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "150px",
      fontSize: "12px",
    }
  }));
  export const StyledQuestionTextField = styled(TextField)(({ theme }) => ({
    width: "100%",
    // margin: "10px 7px 0px 7px",
    [theme.breakpoints.down("md")]: {
      // width: "100%",
      // margin: "5px 0px 5px 0px",
    },
  }));
  export const StyledTypography = styled(Typography)(({ theme }) => ({
    textAlign: "justify",
    display: "flex",
    alignItems: "center",
    margin: "13px 0 0 13px",
    fontSize: 18,
    [theme.breakpoints.down("md")]: {
      display: "block",
      fontSize: 15,
      textAlign: "left",
    },
  }));
  export const AlertTimerTypography = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "2rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2rem",
    },
  }));
  export const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
    color: "red",
    marginLeft: 20,
  }));
  
  const testTitle = {
    marginTop: "2vh",
    fontSize: "1.8em",
    marginLeft: 10,
    fontWeight: "bold",
    textAlign: "center",
  };
  export const TestTitleRow1 = styled(Typography)(({ theme }) => ({
    ...testTitle,
    [theme.breakpoints.down("md")]: {
      marginLeft: 3,
    },
  }));
  export const TestTitleRow2 = styled(Typography)(({ theme }) => ({
    ...testTitle,
    fontSize: "1.4em",
    [theme.breakpoints.down("md")]: {
      marginLeft: 3,
    },
  }));
  export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    width: "350px",
    margin: "10px 7px 0px 7px",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
      margin: "5px 0px 5px 0px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    },
  }));
  export const StyledAutocompleteTextField = styled(TextField)(({ theme }) => ({
    width: "350px",
    margin: 0,
    verticalAlign: "inherit",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
      margin: 0,
    },
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    },
  }));
  
  export const StyledAutocompleteTextField1 = styled(TextField)(({ theme }) => ({
    width: "350px",
    margin: 0,
    verticalAlign: "inherit",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
      margin: 0,
    },
    [theme.breakpoints.down("sm")]: {
      width: "200px",
      marginLeft:"30px",
    },
  }));
  
  export const StyledAutocompleteTextField2 = styled(TextField)(({ theme }) => ({
    width: "350px",
    margin: 0,
    verticalAlign: "inherit",
    fontSize: {xs:"10px",sm:"12px",md:"14px",lg:"16px"},
  
    [theme.breakpoints.down("md")]: {
      width: "40%",
      margin: 0,
    },
    [theme.breakpoints.down("sm")]: {
      width: "40%",
     },
     [theme.breakpoints.down("xs")]: {
      width: "100%",
     }
  }));
  
  export const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: "#1F5156",
    fontSize: "16px",
    margin: "20px 0 0 0",
  }));
  
  // dialog
  export const StyledDialog = styled(Dialog)(({ theme }) => ({}));
  export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({}));
  export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({}));
  export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({}));
  export const DialogDiv = styled("div")(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    padding: "1vh 0.5vw",
  }));
  export const StyledDialogButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    width: "100%",
    height: "3vh",
    margin: "2vh 0vw",
    justifyContent: "center",
    // backgroundColor: "#f5b921",
    // color: "black",
    "&:hover": {
      backgroundColor: "#f5b921",
      color: "black",
    },
  }));
  
  // card
  export const CardParentDiv = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  }));
  export const StyledCard = styled(Card)(({ theme }) => ({
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f3f3",
    borderRadius: "15px",
    // marginBottom: "5%",
    overflow: "auto",
    "&:hover": {
      backgroundColor: "#efefef",
    },
    [theme.breakpoints.down("md")]: {
      // width: "85%",
    },
  }));
  export const CardDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexGrow: 1,
    position: "relative",
    width: "100%",
    // bottom: "15px",
  }));
  export const StyledCardActions = styled(CardActions)(({ theme }) => ({
    // marginBottom: 5,
  }));
  export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    paddingLeft: "15px",
    paddingRight: "5px",
    paddingTop: "2px",
    paddingBottom: "2px",
  }));
  
  export const StyledCardButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    // position: "absolute",
    margin: "0px 5px 0 5px",
    // color: "#FF8A48",
    textTransform: "capitalize",
    border: "1px solid",
    "&:hover": {
      backgroundColor: "#FF8A48",
      color: "white",
    },
  }));
  export const StyledCardTypography = styled(Typography)(({ theme }) => ({
    fontSize: 15,
    color: "#1f5156",
    marginTop: "12px",
  }));
  export const StyledCardTextField = styled(TextField)(({ theme }) => ({
    fontSize: 15,
    color: "#1f5156",
    width: "350px",
    margin: "10px 7px 0px 7px",
    [theme.breakpoints.down("md")]: {
      width: "fit-content",
      margin: "5px 0px 5px 0px",
    },
  }));
  export const StyledCardSpan = styled("span")(({ theme }) => ({
    display: "inline",
    position: "relative",
    left: 10,
    color: "black",
  }));
  
  // icons
  export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    alignItems: "flex-start",
    marginTop: "2px",
    marginRight: "13px",
  }));
  export const StyledRadio = styled(Radio)(({ theme }) => ({
    alignItems: "flex-start",
    marginTop: "2px",
    marginRight: "13px",
  }));
  
  // table
  export const StyledTable = styled(Table)(({ theme }) => ({
    width: "100%",
    height: "100%",
  }));
  export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    width: "100%",
    margin: "20px 7px 0 7px",
    height: "60%", // Default height
  
    overflowY: "scroll",
    scrollbarColor: "skyblue transparent", // For Firefox
  
    // Custom scrollbar styles
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "skyblue",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  
    // Responsive height adjustments
    [theme.breakpoints.up('xs')]: {
      height: `calc(60% of 127vh - 20px)`,
    },
    [theme.breakpoints.up('sm')]: {
      height: `calc(60% of 127vh - 20px)`,
    },
    [theme.breakpoints.up('md')]: {
      height: `calc(60% of 126vh - 20px)`,
    },
    [theme.breakpoints.up('lg')]: {
      height: `calc(60% of 104vh - 20px)`,
    },
  }));
  
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({}));
  export const StyledTableBody = styled(TableBody)(({ theme }) => ({}));
  export const StyledTableHead = styled(TableHead)(({ theme }) => ({}));
  
  export const TableParentDiv = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    margin: 7,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const TableDiv = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  }));
  export const TableButtonDiv = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }));
  export const StyledTableButton = styled(Button)(({ theme }) => ({
    ...buttonStyles,
    // position: "absolute",
    margin: "0px 5px 0 5px",
    // color: "#FF8A48",
    textTransform: "capitalize",
    border: "1px solid",
    "&.MuiButton-startIcon": {
      margin: "0px 0px 0px 0px",
    },
    "&:hover": {
      backgroundColor: "#FF8A48",
      color: "white",
    },
  }));
  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    head: {
      backgroundColor: "#1f5156",
      color: "white",
      fontSize: 20,
    },
    body: {
      fontSize: 20,
    },
  }));
  export const StyledTableTextField = styled(TextField)(({ theme }) => ({
    width: "35%",
    marginRight: "3%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  
  // random
  export const Styledli = styled("li")(({ theme }) => ({
    marginBottom: "7px",
  }));
  
  export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({}));
  export const StyledListItemText = styled(ListItemText)(({ theme }) => ({}));
  export const StyledChip = styled(Chip)(({ theme }) => ({ margin: 1 }));
  export const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    // padding: 1,
  }));
  export const StyledImg = styled("img")(({ theme }) => ({
    width: "100%",
    height: "100%",
    // marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      // display: "none",
      // position: "fixed",
    },
  }));
  export const StyledImg1 = styled("img")(({ theme }) => ({
    width: "180%",
    height: "100%",
    // marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      // display: "none",
      // position: "fixed",
    },
  }));
  
  export const StyledSelect = styled(Select)(({ theme }) => ({
    width: "350px",
    margin: "10px 7px 0px 7px",
    [theme.breakpoints.down("md")]: {
      width: "80vw",
      margin: "5px 0px 5px 0px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    }
    
  }));
  
  export const StyledGrid = styled(Grid)(({ theme }) => ({
    boxShadow: "none",
    minWidth: "100%",
    paddingBottom: "0px",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));
  
  export const StyledSwitch = styled(Switch)(({ theme }) => ({}));
  export const StyledCollapse = styled(Collapse)(({ theme }) => ({}));
  
  export const StyledPaper = styled(Paper)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      overflowX: "scroll",
      alignItems: "flex-start",
    },
  }));
  
  export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    backgroundColor: "#efefef",
    color: "black",
  }));
  
  
  //list 
  export const StyledContainer = styled('div')(({ theme }) => ({
    // backgroundColor: theme.palette.background.paper,
    // borderRadius: theme.shape.borderRadius,
    // boxShadow: theme.shadows[1],
  }));
  
  export const StyledListContainer = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr repeat(5, auto)', // Adjust columns as needed
    // gap: theme.spacing(2), // Space between columns
    alignItems: 'center',
    // padding: theme.spacing(1),
    // borderBottom: `1px solid ${theme.palette.divider}`,
  }));
  
  export const StyledItem = styled('div')(({ theme }) => ({
    // padding: theme.spacing(1),
    textAlign: 'left',
    fontSize: '14px',
    // color: theme.palette.text.primary,
  }));