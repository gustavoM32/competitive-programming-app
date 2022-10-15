import Sidebar from "./Sidebar";

export default function Page(props: any) {
  return (
    <Sidebar
      title={props.title}
      sidebarData={props.sidebarData}
      content={props.children}
    />
  );
}
