export interface LayoutProps {
  children: any;
}

export const Layout = (props: LayoutProps) => <div class="container-xl p-4">{props.children}</div>;
