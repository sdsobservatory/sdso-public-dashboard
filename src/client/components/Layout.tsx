export interface LayoutProps {
  children: any;
}

export const Layout = (props: LayoutProps) => (
  <div class="container-xl p-4 g-3">
    <div class="row g-3 justify-content-center">{props.children}</div>
  </div>
);
