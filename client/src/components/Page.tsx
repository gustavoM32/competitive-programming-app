import Sidebar from "./Sidebar";

export default function Page(props: any) {
  return <Sidebar title={props.title} activeItem={props.sidebarActiveItem} content={props.children}/>
}
