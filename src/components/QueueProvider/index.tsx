import React from "react";
import { QueueCenter } from "./QueueCenter";

export function QueueProvider(props: any) {
  const { children } = props;
  const child = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

  return (<>
  <QueueCenter/>
    {child}
  </>)

}