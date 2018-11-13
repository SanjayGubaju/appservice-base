import { ClassDecorator } from './internal/class.decorator';

// tslint:disable-next-line:function-name
export function ROUTE(route: string) {
  return ClassDecorator.getDecoratorFunc(route);
}
