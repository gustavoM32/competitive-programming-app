import Home from "pages/Home";
import ProblemList from "pages/ProblemList";
import ProblemLists from "pages/ProblemLists";
import Problems from "pages/Problems";
import HomeIcon from "@mui/icons-material/Home";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ListIcon from "@mui/icons-material/List";
import CfProblems from "pages/CfProblems";
import BallotIcon from '@mui/icons-material/Ballot';

const pages = [
  {
    path: "/",
    sidebar: "/",
    title: "Home",
    icon: <HomeIcon />,
    element: <Home />,
  },
  {
    path: "/problems",
    sidebar: "/problems",
    title: "Problems",
    icon: <TextSnippetIcon />,
    element: <Problems />,
  },
  {
    path: "/cfProblems",
    sidebar: "/cfProblems",
    title: "CF Problems",
    icon: <BallotIcon />,
    element: <CfProblems />,
  },
  {
    path: "/problemLists",
    sidebar: "/problemLists",
    title: "Problem lists",
    icon: <ListIcon />,
    element: <ProblemLists />,
  },
  {
    path: "/problemLists/:problemListId",
    sidebar: "/problemLists",
    title: "Problem list",
    element: <ProblemList />,
  },
];

export default pages;