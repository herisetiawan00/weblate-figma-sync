import { h, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import routes, { Route } from "../common/constants/routes";
import { emit, on } from "@create-figma-plugin/utilities";
import { IClose, INavigationPop, INavigationPopUntil, INavigationPush, INavigationReplace } from "../common/event";

const Router = (args: { home: Route }) => {
  const [stack, setStack] = useState<JSX.Element[]>([]);
  const [stackName, setStackName] = useState<string[]>([]);

  const push = ({name, args} : {name: Route, args?: any}) => {
    const builder = routes[name];
    setStack([...stack, builder(args)]);
    setStackName([...stackName, name]);
  }

  const pop = () => {
    if (stack.length > 1) {
      setStack(stack.slice(0, -1));
      setStackName(stackName.slice(0, -1));
    } else {
      emit<IClose>('CLOSE');
    }
  }

  const popUntil = (name: Route) => {
    while (stackName[stackName.length - 1] != name) {
      pop();
    }
  }

  const replace = ({name, args} :{name: Route, args?: any}) => {
    pop();
    push({name, args});
  }

  useEffect(() => {
    on<INavigationReplace>('N_REPLACE', replace);
    on<INavigationPush>('N_PUSH', push);
    on<INavigationPop>('N_POP', pop);
    on<INavigationPopUntil>('N_POP_UNTIL', popUntil);
    push({ name: args.home });
  }, [args.home]);

  return stack.length > 0 ? stack[stack.length - 1] : <div />;
}

export default Router;

