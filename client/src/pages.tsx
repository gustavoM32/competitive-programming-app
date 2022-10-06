import CfContests from "pages/CfContests";
import Home from "pages/Home";
import ProblemList from "pages/ProblemList";
import ProblemLists from "pages/ProblemLists";
import Problems from "pages/Problems";
import HomeIcon from "@mui/icons-material/Home";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ListIcon from "@mui/icons-material/List";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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
  {
    path: "/cfContests",
    sidebar: "/cfContests",
    title: "CF Contests",
    type: "cf",
    icon: <EmojiEventsIcon />,
    element: <CfContests />,
  },
];

export default pages;