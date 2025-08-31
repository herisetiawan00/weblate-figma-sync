import { h, JSX } from "preact";
import FinishPage from "../../ui/finish/FinishPage";
import FormPage from "../../ui/form/FormPage";
import LoadingPage from "../../ui/loading/LoadingPage";

export const routes: Record<string, (args: any) => JSX.Element> = {
  '/': (args: any) => <FormPage {...args} />,
  '/loading': (args: any) => <LoadingPage {...args} />,
  '/finish': (args: any) => <FinishPage {...args} />,
}

export type Route = keyof typeof routes;

export default routes;

