import { Validation } from '../validation/validators';
export declare function QUERYPARAM(paramName: string, validation?: Validation): (controllerClass: any, methodName: string, index: number) => void;
export declare function PATHPARAM(paramName: string, validation?: Validation): (controllerClass: any, methodName: string, index: number) => void;
export declare function REQUEST(): (controllerClass: any, methodName: string, index: number) => void;
export declare function RESPONSE(): (controllerClass: any, methodName: string, index: number) => void;
export declare function USER(): (controllerClass: any, methodName: string, index: number) => void;
