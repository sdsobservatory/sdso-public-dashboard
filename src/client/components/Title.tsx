import { Metadata } from "../../model";

export interface TitleProps {
  title: string
}

export const Title = (props: TitleProps) => {
  document.title = "LumiSky - " + props.title;
  return (
    <div class="text-center pb-2">
      <p class="h4">{props.title}</p>
    </div>
  );
};
