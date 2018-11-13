import { MethodDecorator, RequestOptions } from './internal/method.decorator';

// tslint:disable-next-line:function-name
export function GET(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'get', options);
}

// tslint:disable-next-line:function-name
export function POST(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'post', options);
}

// tslint:disable-next-line:function-name
export function PUT(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'put', options);
}

// tslint:disable-next-line:function-name
export function DELETE(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'delete', options);
}

// tslint:disable-next-line:function-name
export function HEAD(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'head', options);
}

// tslint:disable-next-line:function-name
export function TRACE(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'trace', options);
}

// tslint:disable-next-line:function-name
export function OPTIONS(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'options', options);
}

// tslint:disable-next-line:function-name
export function CONNECT(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'connect', options);
}

// tslint:disable-next-line:function-name
export function PATCH(route: string, options?: RequestOptions) {
  return MethodDecorator.getDecoratorFunc(route, 'patch', options);
}
